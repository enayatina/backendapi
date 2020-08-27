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
exports.taxDeduction = asyncHandler(async (req, res, next) => {
  const taxData = req.body;
  console.log(taxData);
  const taxResult = [];

  const basicSalary = taxData.basicSalary;
  const hra = taxData.hra;
  const specialAllowance = taxData.specialAllowance;
  const otherIncome = taxData.otherIncome;

  //Calculate Gross Income
  let grossIncome =
    Number(taxData.basicSalary) +
    Number(taxData.hra) +
    Number(taxData.specialAllownce) +
    Number(taxData.otherIncome);
  let hraDeduction = '';
  console.log('gross income', grossIncome);
  if (hra < 360000) {
    hraDeduction = hra;
  } else {
    hraDeduction = 360000;
  }
  console.log(hraDeduction);
  const standardDeduction = taxData.standardDeduction;
  const ownedPropertyTaxAndLoanInterest =
    taxData.ownedPropertyTaxAndLoanInterest;

  //Gross total Income
  const grossTotalIncome =
    grossIncome -
    hraDeduction -
    taxData.standardDeduction -
    ownedPropertyTaxAndLoanInterest;

  console.log('gross total income', grossTotalIncome);

  const under80C = taxData.under80C;
  const under80D = taxData.under80D;

  let under80C_ideal = 150000
  let under80d_ideal = 50000



  //Net taxable income
  const taxableIncome = grossTotalIncome -under80C_ideal - under80d_ideal;
  console.log('taxable income', taxableIncome);
  //calculation for old slabs and new slabs
  //OLD SLAB
  let c6 = 12500;
  let c7 = 50000;
  let c8 = 50000;
  let c9 = 75000;
  let c10 = 75000;

  let b6 = 5;
  let b7 = 20;
  let b8 = 20;
  let b9 = 30;
  let b10 = 30;

  

  if (taxableIncome <= 500000) {
    const finalAmount = 0;
  }
  if (taxableIncome > 500000 && taxableIncome <= 750000) {    
    const amount = taxableIncome - 500000   
    var percent = (20 / 100) * amount;
    var finalAmount = 12500 + Number(percent)
  }

  if (taxableIncome > 750000 && taxableIncome <= 1000000) {
    const amount = taxableIncome - 1000000   
   var percent = (20 / 100) * amount;
   var finalAmount = 12500 + Number(percent)
  }

  if (taxableIncome > 1000000 && taxableIncome <= 1250000) {    
   const amount = taxableIncome - 1000000   
   var percent = (30 / 100) * amount;
   var finalAmount = 112500 + Number(percent)
  }
  if (taxableIncome > 1250000 && taxableIncome <= 1500000) {    
    const amount = taxableIncome - 1000000    
    var percent = (30 / 100) * amount;
    var finalAmount = 112500 + Number(percent)      
   }

   if (taxableIncome > 1500000) {    
    const amount = taxableIncome - 1000000    
    var percent = (30 / 100) * amount;
    var finalAmount = 112500 + Number(percent)
   }
   taxResult.push({oldSlab:finalAmount});

   //NEW SLAB
   if (grossIncome <= 500000) {
    var finalAmount_new = 12500 + Number(percent)
  }
  if (grossIncome > 500000 && grossIncome <= 750000) {    
    
    const amount = grossIncome - 500000    
    var percent = (10 / 100) * amount;
    var finalAmount_new = 12500 + Number(percent)
  }

  if (grossIncome > 750000 && grossIncome <= 1000000) {
    
    const amount = grossIncome - 750000   
   var percent = (15 / 100) * amount;
   var finalAmount_new = 37500 + Number(percent)
  }

  if (grossIncome > 1000000 && grossIncome <= 1250000) {    
    
   const amount = grossIncome - 1000000   
   var percent = (20 / 100) * amount;
   var finalAmount_new = 112500 + Number(percent)
  }
  if (grossIncome > 1250000 && grossIncome <= 1500000) {  
    
    const amount = taxableIncome - 1250000    
    var percent = (25 / 100) * amount;
    var finalAmount_new = 125000 + Number(percent)      
   }

   if (grossIncome > 1500000) {    
    const amount = grossIncome - 1500000    
    var percent = (30 / 100) * amount;
    var finalAmount_new = 187500+Number(percent)   
    
   }
   taxResult.push({newSlab:finalAmount_new});

   res.status(200).json({ success: true, data: taxResult });
});
