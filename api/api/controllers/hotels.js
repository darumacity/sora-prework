'use strict';

module.exports.averagePricesPerPlan = (req, res) => {
  var fs = require('fs', 'utf-8');
  var hotels = JSON.parse(fs.readFileSync('../data/201907.json'));

  var response = hotels.map(hotel => {
    return hotel.plans.map(plan => {
      const prices = plan.prices;
      const totalPrice = Object.keys(prices).reduce((prev, current) => prev + prices[current], 0);
      const average = (totalPrice / Object.keys(prices).length);

      return {
        hotelName: hotel.hotelName,
        planName: plan.planName,
        average: average,
      }
    })
  }).reduce((prev, current) => prev.concat(current), []);

  res.json(response);
};
