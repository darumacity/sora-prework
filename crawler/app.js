'use strict';

const averages = require('./crawler').crawl();
require('./export').writeFile(averages);
