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
