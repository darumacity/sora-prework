'use strict';

module.exports.averagePrices = (req, res) => {
  var fs = require('fs', 'utf-8');
  var hotelPrices = JSON.parse(fs.readFileSync('../data/201907.json'));

  var response = hotelPrices.map(hotelPrice => {
    const prices = hotelPrice.prices;
    const totalPrice = Object.keys(prices).reduce((prev, current) => prev + prices[current], 0);
    const average = (totalPrice / Object.keys(prices).length);

    return {
      hotelName: hotelPrice.name,
      average: average
    };
  });

  res.json(response);
};
