const axios = require('axios');
const moment = require('moment');
require('moment-timezone');

let pickupNextHoliday = async function(timezone, ipaddress) {
  moment.tz.setDefault(timezone);
  let datenow = moment();

  let getNextHolidayCore = async (year) => {
    // Web API , Geo loc
    let axios_result1 = await axios.get('http://free.ipwhois.io/json/'+ ipaddress);
    let geolocinfo = axios_result1.data;

    // Web API , Nager.date
    let axios_result2 = await axios.get('https://date.nager.at/api/v2/publicholidays/'+ 
        year + '/' + geolocinfo.country_code);
    let holidays = axios_result2.data;

    var nextholiday = null;
    for ( var holiday of holidays ) {
      let date = moment( holiday.date );
      if ( date.isAfter(datenow) || 
             ( date.isBefore(datenow) && date.diff(datenow, 'hours') > -24 )) {
        nextholiday = holiday;
        break;
      }
    }
    return nextholiday;
  }

  var target =  getNextHolidayCore( datenow.format('YYYY') );
  if ( target == null ) {
    target =  getNextHolidayCore( String(datenow.year() + 1) );
  }
  return target;
};

exports.handler = async function(event, context, callback) {
  let parameters = event.queryStringParameters; // for GET
  //let parameters = JSON.parse(event.body); // for POST

  console.log( event.headers );
  let target = pickupNextHoliday(parameters.timezonename, parameters.ipaddress);

  target.then( (result) => {
    console.log( event.headers );
    console.log( 'found next holiday : ' + result.date + "  " + result.localName );
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result)
    });
  })
};

