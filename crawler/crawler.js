'use strict';

const client = require('cheerio-httpcli');

module.exports.crawl = () => {
    return getHotels().map(hotel => {
        return {
            hotelName: hotel.name,
            plans: getPlans(hotel.yadNo).map(plan => {
                return {
                    planName: plan.name,
                    prices: getPrices(plan.url),
                };
            }),
        };
    });
}

function getHotels() {
    // const response = client.fetchSync('https://github.com/darumacity');

    // if (response.error || !response.response || response.response.statusCode !== 200) {
    //     throw response.error;
    // }

    // var items = response.$('.pinned-items-list .pinned-item-list-item');

    return [
        { name: '亀島川温泉　新川の湯　ドーミーイン東京八丁堀', yadNo: '312600' },
    ]
}

function getPlans(yadNo) {
    const response = client.fetchSync(`https://www.jalan.net/yad312600/plan/?screenId=UWW1402&distCd=01&rootCd=04&stayYear=&stayMonth=&stayDay=&stayCount=1&roomCount=1&dateUndecided=1&adultNum=1&roomSingle=1&roomCrack=100000&smlCd=136205&pageListNumYad=110_1_2&yadNo=${yadNo}&callbackHistFlg=1`);

    if (response.error || !response.response || response.response.statusCode !== 200) {
        throw response.error;
    }

    var plans = [];

    response.$('div.detail-cassette').each(function () {
        var planName = response.$(this).find('div.detail-header h2').text().trim();

        response.$(this).find('a.detailPlanName').each(function () {
            var $this = response.$(this);
            plans.push({ 
                name: planName,
                detail: $this.text().trim(),
                url: $this.attr('href'),
            });
        })
    })

    return plans;
}

function getPrices(url) {
    const response = client.fetchSync(`https://www.jalan.net${url}&calYear=2019&calMonth=07`);

    if (response.error || !response.response || response.response.statusCode !== 200) {
        throw response.error;
    }

    var prices = {};

    var items = response.$('table.cal td.day, table.cal td.day_no');
    items.each(function () {
        var day = response.$(this).find('b.jlnpc-resv-cal__day').text().trim();
        var price = response.$(this).find('div.cal_p_block div.cal_p_all b').text().trim();

        if (day && price) {
            prices[day] = parseInt(price.replace('￥', '').replace(',', ''));
        }
    })

    return prices;
}
