const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Assets = require('../models/Assets');
const Assumption = require('../models/Assumptions');
const Token = require('../models/Token');
const LiabilityData = require('../models/LiabilityData');
const Insurance = require('../models/Insurance');
const Dependents = require('../models/Dependents');
const Goals = require('../models/Goals');

//@desc    Calculate Planning Data based on user's input
//@method  POST /api/v1/user/getPlanning/:id
//@auth    Public
exports.getPlanning = asyncHandler(async (req, res, next) => {
  let userData = [];
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with email ${req.params.email}`, 401)
    );
  }

  //calculations begins
  //step1 - get all the data from db for the user
  //Number form begins
  //save and invest
  //for lump sum - current savings + FD - (6 * monthly expenses)
  //for monthly - yearly saving/12

  const userID = user._id;
  //constant values
  const retirement_age = 65;

  //get the assets data for the user
  const userAssets = await Assets.findOne({ userID: userID });
  if (!userAssets) {
    return next(new ErrorResponse(`User not found with id ${userID}`, 401));
  }

  const lump_sum_invest =
    Number(userAssets.savings) + Number(userAssets.fixedDeposit) - (6 * user.monthly_expenses);

  const current_invested_assets = userAssets.investments;
  const lump_sum_investiable_amount =
    Number(userAssets.savings) + Number(userAssets.fixedDeposit) - (6 * user.monthly_expenses);

  //calculate current assets
  const current_assets = Number(current_invested_assets) + Number(lump_sum_investiable_amount);

  //calculate yearly savings
  const yearly_savings = current_assets * 12;
  const monthly_invest = yearly_savings / 12;

  userData.push({ yearly_savings });
  userData.push({ monthly_invest });

  //Financial risk management
  //get ideal (li_a)value (10*annual income + libilities)
  //get sum of libilities using aggregate function
  const liabilities = await LiabilityData.findOne({ userID: userID });
  console.log(liabilities);
  userData.push({ liabilities });
  let liabTotal = 0;
  let totalEmi = 0;
  if (liabilities.libilities) {
    const arr = liabilities.libilities;

    arr.forEach((element) => {
      liabTotal += element.outstanding;
      totalEmi += element.emi;
    });
  }

  //get insurance data
  const insurancedata = await Insurance.findOne({ userID: userID });

  //get dependents data
  const dependentdata = await Dependents.findOne({ userID: userID });
  userData.push({ dependentList: dependentdata });
  let spouseSupport = 0;
  let kidsSupport = 0;
  let parentsSupport = 0;
  if (dependentdata.spouse) {
    spouseSupport = Math.min(user.age, 85 - dependentdata.spouse);
  }
  if (dependentdata.kids < 1) {
    kidsSupport = 0;
  } else {
    kidsSupport = 22 - Number(dependentdata.kids);
  }
  if (dependentdata.parents < 1) {
    kidsSupport = 0;
  } else {
    parentsSupport = Math.min(user.age, 85 - Number(dependentdata.parents));
  }

  //console.log(Math.max(spouseSupport, kidsSupport, parentsSupport));

  //Term insurance
  const years_to_retire = retirement_age - user.age;
  const li_a = 10 * user.annual_income_after_tax + liabTotal;
  const annual_e = user.monthly_expenses * 12;
  const li_b =
    Math.max(spouseSupport, kidsSupport, parentsSupport) * annual_e + liabTotal;
  const ideal = Math.max(li_a, li_b);

  //CALCULATE SHORTFALL
  const life_insurance = ideal - insurancedata.life_coverage;
  userData.push({ life_insurance });
  userData.push({ retirement_age });

  //CRITICAL ILLNESS
  if (years_to_retire > 5) {
    const cr_ill_ideal = 5 * user.annual_income_after_tax;
    const cr_ill_shortfall = cr_ill_ideal - insurancedata.ci_coverage;

    let cr_in_color = '';
    if (cr_ill_shortfall >= cr_ill_ideal) {
      cr_in_color = 'green';
    } else {
      cr_in_color = 'red';
    }

    userData.push({ cr_ill_shortfall });
    userData.push({ cr_in_color });
  }

  //HEALTH INSURANCE
  let no_of_dependent = 0;
  if (dependentdata.spouse > 1) {
    no_of_dependent++;
  }
  if (dependentdata.kids > 1) {
    no_of_dependent++;
  }
  if (dependentdata.parents > 1) {
    no_of_dependent++;
  }

  const recommendedAmount = user.annual_income_after_tax * 1.1;
  const dependentAmount = 3 * user.annual_income_after_tax * 0.5;
  const dependentAmountFinal = 3 * dependentAmount;

  const totalCoverage = recommendedAmount + dependentAmountFinal;
  const health_shortfall = totalCoverage - insurancedata.health_insurance;

  let hi_in_color = '';
  if (health_shortfall >= totalCoverage) {
    hi_in_color = 'green';
  } else {
    hi_in_color = 'red';
  }

  userData.push({ health_shortfall });
  userData.push({ no_of_dependent });
  userData.push({ hi_in_color });

  //GET GOAL CALCULATIONS
  const goals = await Goals.findOne({ userID: userID });
  const arr_goal = goals.goals;

  let totalTime = 0;
  arr_goal.forEach((element) => {
    totalTime += element.time_horizon;
  });

  if (totalTime < 2) {
    let goal_prediction = true;
    userData.push({ goal_prediction });
  } else {
    let goal_prediction = false;
    userData.push({ goal_prediction });
  }

  //Current status calculations
  //INVESTMENTS
  const emergency_fund = Number(userAssets.savings) + Number(userAssets.fixedDeposit);
  
  const monthly_salary = user.annual_income_after_tax / 12;
  const monthly_savings = user.monthly_savings;
  const monthly_expense = monthly_salary - monthly_savings;

  const emergency_fund_ratio = emergency_fund / monthly_expense;
  userData.push({ emergency_fund_ratio },{emergency_fund}, {monthly_salary}, {monthly_savings}, {monthly_expense});
  let investment_color = '';
  let emergency_fund_ratio_X = '';
  let emergency_fund_ratio_A = '';
  let emergency_fund_ratio_B_1 = '';
  emergency_fund_ratio_B_1_1 = '';
  let emergency_fund_ratio_B_2 = '';
  let emergency_fund_ratio_B = '';
  let rate_of_return = 4;
  let avg_FD = 6;
  let saving_ror = 4;
  if (emergency_fund_ratio < 3) {
    investment_color = 'red';
    emergency_fund_ratio_X = 3 * monthly_expense - emergency_fund;
  }
  if (emergency_fund_ratio > 3 && emergency_fund_ratio < 6) {
    investment_color = 'green';
    emergency_fund_ratio_X = 3 * monthly_expense - emergency_fund;
  }
  if (emergency_fund_ratio > 6) {
    investment_color = 'blue';
    emergency_fund_ratio_A = emergency_fund - 6 * monthly_expense;
    emergency_fund_ratio_B_1_1 = 1 + rate_of_return;
    emergency_fund_ratio_B_1_2 =
      emergency_fund_ratio_A * emergency_fund_ratio_B_1_1;
    emergency_fund_ratio_B_1 = Math.pow(emergency_fund_ratio_B_1_2, 20);

    emergency_fund_ratio_B_2_1 = 1 + avg_FD;
    emergency_fund_ratio_B_2_2 =
      emergency_fund_ratio_A * emergency_fund_ratio_B_2_1;
    emergency_fund_ratio_B_2 = Math.pow(emergency_fund_ratio_B_2_2, 20);

    emergency_fund_ratio_B =
      emergency_fund_ratio_B_1 - emergency_fund_ratio_B_2;
  }
  userData.push({ investment_color });
  userData.push({ emergency_fund_ratio_B }, { emergency_fund_ratio_A });

  //Remedy data to be calculated here
  //Get the data for calculations
  const emergency_fund_ratio_color = investment_color;
  userData.push({ emergency_fund_ratio_color });

  const debt_servicing_ratio = totalEmi / monthly_salary;
  let debt_servicing_ratio_color = '';
  if (debt_servicing_ratio > 35) {
    debt_servicing_ratio_color = 'red';
  }
  if (debt_servicing_ratio <= 35) {
    debt_servicing_ratio_color = 'green';
  }
  userData.push({ debt_servicing_ratio });
  userData.push({ debt_servicing_ratio_color });

  const saving_ratio = monthly_savings / monthly_salary;
  let saving_ratio_color = '';
  if (saving_ratio > 10) {
    saving_ratio_color = 'red';
  } else {
    saving_ratio_color = 'green';
  }
  userData.push({ saving_ratio });
  userData.push({ saving_ratio_color });

  const totalAssetValue =
    Number(userAssets.savings) +
    Number(userAssets.fixedDeposit) +
    Number(userAssets.investments) +
    Number(userAssets.residentialProperty);
  const invest_to_networth_ratio = userAssets.investments / totalAssetValue;
  let invest_to_networth_ratio_color = '';
  if (invest_to_networth_ratio < 50) {
    invest_to_networth_ratio_color = 'red';
  }
  if (invest_to_networth_ratio >= 50) {
    invest_to_networth_ratio_color = 'green';
  }
  userData.push({ invest_to_networth_ratio });
  userData.push({ invest_to_networth_ratio_color });
  const net_worth = Number(totalAssetValue) - Number(liabTotal);
  const solvency_ratio = net_worth / totalAssetValue;
  let solvency_ratio_color = '';
  if (solvency_ratio < 50) {
    solvency_ratio_color = 'red';
  }
  if (solvency_ratio >= 50) {
    solvency_ratio_color = 'green';
  }
  userData.push({ solvency_ratio });
  userData.push({ solvency_ratio_color });

  //Investment and Retirement planning strategy
  //calculate year ending balance for calculating L13 from retirement sheet
  //NOW
  let current_age = user.age;
  let annual_income = user.annual_income_after_tax;
  let inflation_rate = 6.5;
  let annual_income_increase = 8.15;
  let annual_saving_increase = Number(annual_income_increase) - Number(inflation_rate);
  let current_assets_retirement = current_assets;
  let annual_saving = monthly_savings * 12;
  let investment_returns_now = 8.6;
  let user_gender = user.gender;
  let savings_ratio = annual_saving / annual_income;

  //AT RETIREMENT
  let investment_returns_at_retirement = 6;

  //Calculation is pending but setting up a value for now
  let year_ending_balance = 4000000;

  userData.push({ bequest_min: 0 }, { bequest_max: year_ending_balance });
  userData.push(
    { listofgoals: arr_goal },
    { years_to_retire: years_to_retire },
    { monthly_surplus: monthly_salary }
  );

  res.status(200).json({ success: true, data: userData });
});

exports.userLogin = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, msg: 'You are logged in' });
});
