const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Assets = require("../models/Assets");
const Assumption = require("../models/Assumptions");
const Token = require("../models/Token");
const LiabilityData = require("../models/LiabilityData");
const Insurance = require("../models/Insurance");
const Dependents = require("../models/Dependents");
const Goals = require("../models/Goals");

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
    userAssets.savings + userAssets.fixedDeposit - 6 * user.monthly_expenses;

  const current_invested_assets = userAssets.investments;
  const lump_sum_investiable_amount =
    userAssets.savings + userAssets.fixedDeposit - 6 * user.monthly_expenses;

  //calculate current assets
  const current_assets = current_invested_assets + lump_sum_investiable_amount;
  //calculate yearly savings
  const yearly_savings = current_assets * 12;
  const monthly_invest = yearly_savings / 12;

  userData.push({ yearly_savings });
  userData.push({ monthly_invest });

  //Financial risk management
  //get ideal (li_a)value (10*annual income + libilities)
  //get sum of libilities using aggregate function  
  const liabilities = await LiabilityData.findOne({ userID: userID });
  const arr = liabilities.libilities;
  let liabTotal = 0;
  arr.forEach((element) => {
    liabTotal += element.outstanding;
  });
  

  //get insurance data
  const insurancedata = await Insurance.findOne({ userID: userID });

  //get dependents data
  const dependentdata = await Dependents.findOne({ userID: userID });
  let spouseSupport = 0;
  let kidsSupport = 0;
  let parentsSupport = 0;
  if (dependentdata.spouse) {
    spouseSupport = Math.min(user.age, 85 - dependentdata.spouse);
  }
  if (dependentdata.kids < 1) {
    kidsSupport = 0;
  } else {
    kidsSupport = 22 - dependentdata.kids;
  }
  if (dependentdata.parents < 1) {
    kidsSupport = 0;
  } else {
    parentsSupport = Math.min(user.age, 85 - dependentdata.parents);
  }

  
  //TERM INSURANCE
  const years_to_retire = retirement_age - user.age;
  const li_a = 10 * user.annual_income_after_tax + liabTotal;  
  const annual_e = user.monthly_expenses * 12;
  const li_b =
    Math.max(spouseSupport, kidsSupport, parentsSupport) * annual_e + liabTotal;  
  const ideal = Math.max(li_a, li_b);
  

  //CALCULATE SHORTFALL
  const life_insurance = ideal - insurancedata.life_coverage;
  userData.push({ life_insurance });
  userData.push({ years_to_retire });
 

  //CRITICAL ILLNESS
  if (years_to_retire > 5) {
    const cr_ill_ideal = 5 * user.annual_income_after_tax;
    const cr_ill_shortfall = cr_ill_ideal - insurancedata.ci_coverage;

    let cr_in_color ='';
    if(cr_ill_shortfall>=cr_ill_ideal){
      cr_in_color = 'green';
    }else{
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

  let hi_in_color ='';
    if(health_shortfall>=totalCoverage){
      hi_in_color = 'green';
    }else{
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
  console.log(totalTime);
  if (totalTime < 2) {
    let goal_prediction = true;
    userData.push({ goal_prediction });
  } else {
    let goal_prediction = false;
    userData.push({ goal_prediction });
  }

  //Current status calculations
  //INVESTMENTS
  const emergency_fund = userAssets.savings + userAssets.fixedDeposit;
  const monthly_salary = user.annual_income_after_tax / 12;
  const monthly_savings = user.monthly_savings;
  const monthly_expense = monthly_salary - monthly_savings;

  const emergency_fund_ratio = emergency_fund - monthly_expense;
  let investment_color = "";

  if (emergency_fund_ratio < 3) {
    investment_color = "red";
  }
  if (emergency_fund_ratio > 3 && emergency_fund_ratio < 6) {
    investment_color = "green";
  }
  if (emergency_fund_ratio > 6) {
    investment_color = "blue";
  }
  userData.push({ investment_color });

 


  res.status(200).json({ success: true, data: userData });
});
