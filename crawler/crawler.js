'use strict';

const client = require('cheerio-httpcli');

module.exports.crawl = () => {
    // return getHotels().map(hotel => {
    //     return {
    //         hotelName: hotel.name,
    //         plans: getPlans(hotel.yadNo).map(plan => {
    //             return {
    //                 planName: plan.name,
    //                 planDetail: plan.detail,
    //                 prices: getPrices(plan.url),
    //             };
    //         }),
    //     };
    // });

    return getPlans().map(plan => {
        return {
            hotelName: plan.hotelName,
            planName: plan.planName,
            planDetail: plan.planDetail,
            prices: getPrices(plan.url),
        };
    });
}

// function getHotels() {
//     const response = client.fetchSync('https://www.jalan.net/130000/LRG_136200/?dateUndecided=1&adultNum=1&roomSingle=1&kenCd=130000&lrgCd=136200&screenId=UWW1402');

//     if (response.error || !response.response || response.response.statusCode !== 200) {
//         throw response.error;
//     }

//     var hotels = [];

//     response.$('div.search-result-cassette').each(function () {
//         var name = response.$(this).find('div.result-body div.hotel-detail div.hotel-detail-header a').text().trim();
//         var yadNo = response.$(this).attr('id').replace('yadNo', '').trim();

//         hotels.push({ name, yadNo });
//     })

//     return hotels;
// }

// function getPlans(yadNo) {
//     const response = client.fetchSync(`https://www.jalan.net/yad312600/plan/?screenId=UWW1402&distCd=01&rootCd=04&stayYear=&stayMonth=&stayDay=&stayCount=1&roomCount=1&dateUndecided=1&adultNum=1&roomSingle=1&roomCrack=100000&smlCd=136205&pageListNumYad=110_1_2&yadNo=${yadNo}&callbackHistFlg=1`);

//     if (response.error || !response.response || response.response.statusCode !== 200) {
//         throw response.error;
//     }

//     var plans = [];

//     response.$('div.detail-cassette').slice(0, 1).each(function () {
//         var planName = response.$(this).find('div.detail-header h2').text().trim();

//         response.$(this).find('a.detailPlanName').slice(0, 1).each(function () {
//             var $this = response.$(this);
//             plans.push({
//                 name: planName,
//                 detail: $this.text().trim(),
//                 url: $this.attr('href'),
//             });
//         })
//     })

//     return plans;
// }

function getPlans() {
    const url = 'https://www.jalan.net/130000/LRG_136200/';

    const hotelListPage = client.fetchSync(url);

    if (hotelListPage.error || !hotelListPage.response || hotelListPage.response.statusCode !== 200) {
        throw hotelListPage.error;
    }

    const response = hotelListPage.$('form[name="submitForm"]').attr('action', `${url}?dateUndecided=1&adultNum=1&roomSingle=1&mvTabFlg=2`).submitSync();

    if (response.error || !response.response || response.response.statusCode !== 200) {
        throw response.error;
    }

    var plans = [];

    response.$('div.search-result-cassette').each(function () {
        var $anchorToHotel = response.$(this).find('div.result-header a');
        var $anchorToPlan = response.$(this).find('div.result-body div.plan-detail div.plan-detail-header a');

        plans.push({
            hotelName: $anchorToHotel.text().trim(),
            planName: $anchorToPlan.text().trim(),
            planDetail: '',
            url: $anchorToPlan.attr('href'),
        });
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
