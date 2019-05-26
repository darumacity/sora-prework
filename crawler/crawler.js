'use strict';

const client = require('cheerio-httpcli');

module.exports.crawl = () => {
    const hotels = getHotels();
    const hotelPrices = hotels.map(hotel => {
        const prices = getPrices(hotel.id);
        return {
            name: hotel.name,
            prices: prices,
        }
    });

    return hotelPrices;
}

function getHotels() {
    const response = client.fetchSync('https://github.com/darumacity');

    if (response.error || !response.response || response.response.statusCode !== 200) {
        throw response.error;
    }

    var items = response.$('.pinned-items-list .pinned-item-list-item');

    return [
        { name: 'ニューオータニ', id: 1 },
    ]
}

function getPrices(id) {
    const response = client.fetchSync('https://github.com/darumacity');

    if (response.error || !response.response || response.response.statusCode !== 200) {
        throw response.error;
    }

    var items = response.$('.pinned-items-list .pinned-item-list-item');

    return {
        28: 1,
        29: 1500,
        30: 2001,
    };
}
