const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc    Calculate Child education loan amount
//@method  POST /api/v1/childeducationloan
//@auth    Private
exports.childloan = asyncHandler(async (req, res, next) => {
  const childloan = req.body;
  let loanData = [];
  loanData.push({ current_cost: process.env.EXPECTED_EDUCATION_COST });

  const years_to_univercity = 18 - childloan.currentage;

  loanData.push({ years_to_collage: years_to_univercity });

  const cost_of_degree = process.env.EXPECTED_EDUCATION_COST;
  const inflation_cost = process.env.EXPECTED_INFLATION_COST / 100;
  //1+c9
  const number = 1 + inflation_cost;

  const cost_of_degree_at_time = Math.pow(number, years_to_univercity);
  const final_value = cost_of_degree_at_time * cost_of_degree;

  loanData.push({ final_value });

  const currency_fluctuation =
    (process.env.EXPECTED_INR_CURRENCY / 100) * cost_of_degree;
  const inr_to_currency =
    process.env.CURRENT_INR_VALUE * 1 + process.env.EXPECTED_INR_CURRENCY;
  const inr_to_currency_value = Math.pow(inr_to_currency, years_to_univercity);

  const inr_to_uni_date = cost_of_degree_at_time * inr_to_currency_value;
  loanData.push({ inr_to_uni_date });
  res.status(201).json({
    success: true,
    data: loanData,
  });
});
exports.expenses = asyncHandler(async (req, res, next) => {
  const expenseData = [];
  const userData = req.body;

  //Income Data
  const tmsat = userData.monthlySalary;
  const tmriat = userData.monthlyRentalIncome;
  const tmiiat = userData.monthlyInvestment;
  const totalIncome = Number(tmsat) + Number(tmriat) + Number(tmiiat);
  expenseData.push({ totalIncome });

  //Expenses data
  const hLoan = userData.homeLoan;
  const cLoan = userData.carLoan;
  const pLoan = userData.personalLoan;
  const ccLoan = userData.creditCardLoan;
  const otherLoan = userData.otherLoan;
  const totalEMI =
    Number(hLoan) +
    Number(cLoan) +
    Number(pLoan) +
    Number(ccLoan) +
    Number(otherLoan);
  expenseData.push({ totalEMI });

  //Monthly insurance premium
  const lifeInsurance = userData.lifeInsurance;
  const termInsurance = userData.termInsurance;
  const healthInsurance = userData.healthInsurance;
  const houseInsurance = userData.houseInsurance;
  const carInsurance = userData.carInsurance;
  const otherInsurance = userData.otherInsurance;
  const totalPremium =
    Number(lifeInsurance) +
    Number(termInsurance) +
    Number(healthInsurance) +
    Number(houseInsurance) +
    Number(carInsurance) +
    Number(otherInsurance);
  expenseData.push({ totalPremium });

  //living expenses
  const houseRental = userData.houseRental;
  const foodExpenses = userData.foodExpenses;
  const clothingExpenses = userData.clothingExpenses;
  const utilExpeses = userData.utilExpeses;
  const car = userData.car;
  const mobile = userData.mobile;
  const houseHoldHelp = userData.houseHoldHelp;
  const kidsEducation = userData.kidsEducation;
  const medicalEx = userData.medicalEx;
  const otherEx = userData.otherEx;
  const otherPersoanalEx = userData.otherPersoanalEx;
  const totalExp =
    Number(houseRental) +
    Number(foodExpenses) +
    Number(clothingExpenses) +
    Number(utilExpeses) +
    Number(car) +
    Number(mobile) +
    Number(houseHoldHelp) +
    Number(kidsEducation) +
    Number(medicalEx) +
    Number(otherEx) +
    Number(otherEx) +
    Number(otherPersoanalEx);
  expenseData.push({ totalExp });

  //monthly leisure expenses
  const travelBudgt = userData.travel;
  const entertBudgt = userData.entertBudgt;
  const luxuryBudgt = userData.luxuryBudgt;
  const otherBudgt = userData.otherBudgt;
  const totalLeisure =
    Number(travelBudgt) +
    Number(entertBudgt) +
    Number(luxuryBudgt) +
    Number(otherBudgt);
  expenseData.push({ totalLeisure });

  //monthly saving and investments
  const savings_endowment = userData.savings_endowment;
  const ulip_sip = userData.ulip_sip;
  const fd = userData.fd;
  const postOffice_pf = userData.postOffice_pf;
  const otherInvestments = userData.otherInvestments;
  const totalInvestments =
    Number(savings_endowment) +
    Number(ulip_sip) +
    Number(fd) +
    Number(postOffice_pf) +
    Number(otherInvestments);
  expenseData.push({ totalInvestments });

  const totalExpenses =
    Number(totalEMI) +
    Number(totalPremium) +
    Number(totalExp) +
    Number(totalLeisure) +
    Number(totalInvestments);
  const totalSurplus = Number(totalIncome) - Number(totalExpenses);
  expenseData.push({ totalExpenses }, { totalSurplus });

  const totalSavingRatio =
    (Number(totalSurplus) + Number(totalInvestments)) / Number(totalIncome);
  const monthlyLoanPayment = Number(totalEMI) / Number(totalIncome);
  const monthlyMortgagePayment = Number(hLoan) / Number(totalIncome);
  const monthlyInsurancePremium = Number(totalPremium) / Number(totalIncome);
  const monthlyRental = Number(houseRental) / Number(totalIncome);
  const monthlyLivingExpensesPercentage =
    (Number(totalExp) - Number(houseRental)) / Number(totalIncome);
  const monthlyLeisureExpensesPercentage =
    Number(totalLeisure) / Number(totalIncome);

  const monthlyContribution = totalInvestments / totalIncome;

  expenseData.push(
    { totalSavingRatio },
    { monthlyLoanPayment },
    { monthlyMortgagePayment },
    { monthlyInsurancePremium },
    { monthlyRental },
    { monthlyLivingExpensesPercentage },
    { monthlyLeisureExpensesPercentage },
    { monthlyContribution }
  );
  res.status(200).json({ success: true, data: expenseData });
});
exports.taxDeduction = asyncHandler( async(req, res, next) => {
  const taxData = req.body;
  const taxResult = [];

  const basicSalary = taxData.basicSalary
  const hra = taxData.hra
  const specialAllowance = taxData.specialAllowance
  const otherIncome = taxData.otherIncome

  //Calculate Gross Income
const grossIncome = Number(basicSalary)+Number(hra)+Number(specialAllowance)+Number(otherIncome)
  if(hra<360000){
    const hraDeduction = hra
  }else{
    const hraDeduction = 360000
  }
  const standardDeduction = taxData.standardDeduction
  const ownedPropertyTaxAndLoanInterest = taxData.ownedPropertyTaxAndLoanInterest

  //Gross total Income
  const grossTotalIncome = Number(grossIncome)-Number(hraDeduction)-Number(standardDeduction)-Number(ownedPropertyTaxAndLoanInterest)
  
  const under80C = taxData.under80C
  const under80D = taxData.under80D

  //Net taxable income
  const taxableIncome = Number(grossTotalIncome)-Number(under80C)-Number(under80D)
  //calculation for old slabs and new slabs
  //OLD SLAB
if(taxableIncome<=500000){

}

  //NEW SLAB
});
