'use strict';

module.exports.averagePricesPerPlan = (req, res) => {
  var fs = require('fs', 'utf-8');
  var hotels = JSON.parse(fs.readFileSync('../data/201907.json'));

  var response = hotels.map(hotel => {
    return hotel.plans.map(plan => {
      const prices = plan.prices;
      const totalPrice = Object.keys(prices).reduce((prev, current) => prev + prices[current], 0);
      const average = Object.keys(prices).length > 0 ? (totalPrice / Object.keys(prices).length) : 0;

      return {
        hotelName: hotel.hotelName,
        planName: plan.planName,
        planDetail: plan.planDetail,
        average: average,
      }
    })
  }).reduce((prev, current) => prev.concat(current), []);

  res.json(response);
};
