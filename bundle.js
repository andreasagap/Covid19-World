(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const countries = require('iso-3166-1-codes');
const byAlpha2 = countries.byAlpha2();
var total_countries = 0;
var global_confirmed = 0;
var global_deaths = 0;
var confirmedData1, deathsData = [];
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getRangeDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        var dd = String(currentDate.getDate()).padStart(2, '0');
        var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = currentDate.getFullYear();

        var day = yyyy + '-' + mm + '-' + dd;
        dateArray.push(day);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
$(document).ready(function () {
    $(function () {

        confirmedData1 = Array.from(confirmedData);
        deathsData = Array.from(confirmedData);
        getGlobal();
    }); // End - (function(---))
}) // End - $(document).ready...
var d = new Date();
d.setDate(d.getDate() - 1);
var dd = String(d.getDate()).padStart(2, '0');
var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = d.getFullYear();

yesterday = yyyy + '-' + mm + '-' + dd;

function getResults() {
    var wrld = {
        map: 'world_mill',
        normalizeFunction: 'polynomial',
        regionStyle: regionStyling,
        backgroundColor: '#22313F',
        series: {
            regions: [{
                values: confirmedData,
                attribute: 'fill',
                scale: ['#fbfbfb', '#ff0000']
            }]
        },
        onRegionTipShow: function (e, el, code) {
            el.html('In ' + el.html() + ': <ul>' + getDataPerCountry(confirmedData1[code], deathsData[code]) + '</ul>  Click to know more');
            $(".lbl-hover").html('Hovered country value: ' + confirmedData[code]);
        },
        onRegionClick: function (event, code) {
            getChart(code);
        },

    };

    /* Setting up of the map */
    if ($('#world-map').length > 0) {
        $('#world-map').vectorMap(wrld);
    }
}

async function getDataChartPerCountry(code, dates_array) {
    var confirmed = []
    var deaths = []

    fetch("https://covidapi.info/api/v1/country/" + byAlpha2.get(code)["alpha3"])
        .then(response => response.json())
        .then(data => {
            for (var d of dates_array) {
                console.log(data["result"][d]["confirmed"])
                console.log(data["result"][d]["deaths"])
                confirmed.push({
                    x: d,
                    y: data["result"][d]["confirmed"]
                })
                deaths.push({
                    x: d,
                    y: data["result"][d]["deaths"]
                })
                // confirmed.push(data["result"][d]["confirmed"])
                // deaths.push(data["result"][d]["deaths"])
            }
            createChart(code, dates_array, confirmed, deaths)
        })
        .catch(function (error) {
            console.log(error)
            createChart(code, dates_array, confirmed, deaths)
        })


}

function createChart(code, dates_array, confirmed, deaths) {
    if (confirmed.length != 0) {
        console.log(confirmed)
        console.log(deaths)
        $('#myModal').modal('show');
        var optionsLine = {
            series: [{
                name: "Confirmed",
                data: confirmed
            }],
            title: {
                text: byAlpha2.get(code)["name"],
                align: 'left'
            },
            colors: ['#ff0000'],
            chart: {
                height: 250,
                zoom: {
                    enabled: false
                },
                id: 'line-1',
                group: 'social',
                type: 'line',
            },
            xaxis: {
                type: "datetime"
            },
            yaxis: {
                labels: {
                    minWidth: 40
                }
            }
        };
        var chart = new ApexCharts(document.querySelector("#chart-line"), optionsLine)
        chart.render()

        var optionsArea = {
            series: [{
                name: "Deaths",
                data: deaths
            }],
            colors: ['#000000'],
            chart: {
                height: 250,
                zoom: {
                    enabled: false
                },
                id: 'line-2',
                group: 'social',
                type: 'line'
            },
            xaxis: {
                type: "datetime"
            },
            yaxis: {
                labels: {
                    minWidth: 40
                }
            }
        };
        var chart = new ApexCharts(document.querySelector("#chart-line2"), optionsArea)
        chart.render()
        $('#myModal').on('hidden.bs.modal', function () {
            chart.destroy();
        });
        
    }
}

function getChart(code) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    dd = String(d.getDate()).padStart(2, '0');
    mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = d.getFullYear();

    yesterday = yyyy + '-' + mm + '-' + dd;
    var dates_array = getRangeDates(new Date("2020-01-22"), d)
    console.log("dates")
    console.log(dates_array)
    getDataChartPerCountry(code, dates_array);
}
async function getData(alpha3, alpha2) {
    //   console.log("Total: " + alpha3["alpha3"])
    //  console.log(alpha3);
    fetch("https://covidapi.info/api/v1/country/" + alpha3["alpha3"] + "/" + yesterday)
        .then(response => response.json())
        .then(data => {
            if (data["result"].length != 0) {
                confirmedData[alpha2] = data["result"][yesterday]["confirmed"]; // - data["result"][yesterday]["deaths"];

                confirmedData1[alpha2] = data["result"][yesterday]["confirmed"];
                deathsData[alpha2] = data["result"][yesterday]["deaths"];
            } else {
                confirmedData[alpha2] = 0;
            }
            total_countries += 1;
            console.log(total_countries);
            if (total_countries == 232) {
                getResults();
            }
        })
        .catch(function (error) {
            confirmedData[alpha2] = 0;
            total_countries += 1;
            if (total_countries == 232) {
                getResults();
            }
        })
}



function getGlobal() {
    var result = [];


    fetch("https://covidapi.info/api/v1/global")
        .then(response => response.json())
        .then(data => {

            //  console.log(data["result"]);
            global_confirmed = data["result"]["confirmed"];
            global_deaths = data["result"]["deaths"];
            var app = new Vue({
                el: '#global_confirmed',
                data: {
                    message: global_confirmed
                }
            })
            var app = new Vue({
                el: '#global_deaths',
                data: {
                    message: global_deaths
                }
            })

            for (var i in confirmedData) {
                //  console.log("TESTG", i);
                getData(byAlpha2.get(i), i);
                // wait(100);
            }
            //     result.push([i, confirmedData[i]]);
            // for (var key of Object.keys(result)) {
            //     getData(byAlpha2.get(key), key);

            // }


        })

}

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    }
    while (d2 - d < ms);
}
/* Function for showing products name*/
function getDataPerCountry(confirmed, deaths) {
    var ret = "";
    ret += "<li>Confirmed: " + confirmed + "</li>";
    ret += "<li>Deaths: " + deaths + "</li>";
    return ret;
}


/* Basic styling for the map */
var regionStyling = {
    initial: {
        fill: '#5c6366'
    },
    hover: {
        fill: '#000000'
    },
    selected: {
        fill: '#000000'
    }
};
/* Data that is passed to the map */
var confirmedData = {
    "AF": 0.0,
    "AL": 0.0,
    "DZ": 0.0,
    "AS": 0.0,
    "AD": 0.0,
    "AO": 0.0,
    "AI": 0.0,
    "AQ": 0.0,
    "AG": 0.0,
    "AR": 0.0,
    "AM": 0.0,
    "AW": 0.0,
    "AU": 0.0,
    "AT": 0.0,
    "AZ": 0.0,
    "BS": 0.0,
    "BH": 0.0,
    "BD": 0.0,
    "BB": 0.0,
    "BY": 0.0,
    "BE": 0.0,
    "BZ": 0.0,
    "BJ": 0.0,
    "BM": 0.0,
    "BT": 0.0,
    "BO": 0.0,
    "BA": 0.0,
    "BW": 0.0,
    "BR": 0.0,
    "IO": 0.0,
    "VG": 0.0,
    "BN": 0.0,
    "BG": 0.0,
    "BF": 0.0,
    "MM": 0.0,
    "BI": 0.0,
    "KH": 0.0,
    "CM": 0.0,
    "CA": 0.0,
    "CV": 0.0,
    "KY": 0.0,
    "CF": 0.0,
    "TD": 0.0,
    "CL": 0.0,
    "CN": 0.0,
    "CX": 0.0,
    "CC": 0.0,
    "CO": 0.0,
    "KM": 0.0,
    "CK": 0.0,
    "CR": 0.0,
    "HR": 0.0,
    "CU": 0.0,
    "CY": 0.0,
    "CZ": 0.0,
    "CD": 0.0,
    "DK": 0.0,
    "DJ": 0.0,
    "DM": 0.0,
    "DO": 0.0,
    "EC": 0.0,
    "EG": 0.0,
    "SV": 0.0,
    "GQ": 0.0,
    "ER": 0.0,
    "EE": 0.0,
    "ET": 0.0,
    "FK": 0.0,
    "FO": 0.0,
    "FJ": 0.0,
    "FI": 0.0,
    "FR": 0.0,
    "PF": 0.0,
    "GA": 0.0,
    "GM": 0.0,
    "GE": 0.0,
    "DE": 0.0,
    "GH": 0.0,
    "GI": 0.0,
    "GR": 0.0,
    "GL": 0.0,
    "GD": 0.0,
    "GU": 0.0,
    "GT": 0.0,
    "GN": 0.0,
    "GW": 0.0,
    "GY": 0.0,
    "HT": 0.0,
    "VA": 0.0,
    "HN": 0.0,
    "HK": 0.0,
    "HU": 0.0,
    "IS": 0.0,
    "IS": 0.0,
    "IN": 0.0,
    "ID": 0.0,
    "IR": 0.0,
    "IQ": 0.0,
    "IE": 0.0,
    "IM": 0.0,
    "IL": 0.0,
    "IT": 0.0,
    "CI": 0.0,
    "JM": 0.0,
    "JP": 0.0,
    "JE": 0.0,
    "JO": 0.0,
    "KZ": 0.0,
    "KE": 0.0,
    "KI": 0.0,
    "KW": 0.0,
    "KG": 0.0,
    "LA": 0.0,
    "LV": 0.0,
    "LB": 0.0,
    "LS": 0.0,
    "LR": 0.0,
    "LY": 0.0,
    "LI": 0.0,
    "LT": 0.0,
    "LU": 0.0,
    "MO": 0.0,
    "MK": 0.0,
    "MG": 0.0,
    "MW": 0.0,
    "MY": 0.0,
    "MV": 0.0,
    "ML": 0.0,
    "MT": 0.0,
    "MH": 0.0,
    "MR": 0.0,
    "MU": 0.0,
    "YT": 0.0,
    "MX": 0.0,
    "FM": 0.0,
    "MD": 0.0,
    "MC": 0.0,
    "MN": 0.0,
    "ME": 0.0,
    "MS": 0.0,
    "MA": 0.0,
    "MZ": 0.0,
    "NA": 0.0,
    "NR": 0.0,
    "NP": 0.0,
    "NL": 0.0,
    "AN": 0.0,
    "NC": 0.0,
    "NZ": 0.0,
    "NI": 0.0,
    "NE": 0.0,
    "NG": 0.0,
    "NU": 0.0,
    "KP": 0.0,
    "MP": 0.0,
    "NO": 0.0,
    "OM": 0.0,
    "PK": 0.0,
    "PW": 0.0,
    "PA": 0.0,
    "PG": 0.0,
    "PY": 0.0,
    "PE": 0.0,
    "PH": 0.0,
    "PN": 0.0,
    "PL": 0.0,
    "PT": 0.0,
    "PR": 0.0,
    "QA": 0.0,
    "CG": 0.0,
    "RO": 0.0,
    "RU": 0.0,
    "RW": 0.0,
    "BL": 0.0,
    "SH": 0.0,
    "KN": 0.0,
    "LC": 0.0,
    "MF": 0.0,
    "PM": 0.0,
    "VC": 0.0,
    "WS": 0.0,
    "SM": 0.0,
    "ST": 0.0,
    "SA": 0.0,
    "SN": 0.0,
    "RS": 0.0,
    "SC": 0.0,
    "SL": 0.0,
    "SG": 0.0,
    "SK": 0.0,
    "SI": 0.0,
    "SB": 0.0,
    "SO": 0.0,
    "ZA": 0.0,
    "KR": 0.0,
    "ES": 0.0,
    "LK": 0.0,
    "SD": 0.0,
    "SR": 0.0,
    "SJ": 0.0,
    "SZ": 0.0,
    "SE": 0.0,
    "CH": 0.0,
    "SY": 0.0,
    "TW": 0.0,
    "TJ": 0.0,
    "TZ": 0.0,
    "TH": 0.0,
    "TL": 0.0,
    "TG": 0.0,
    "TK": 0.0,
    "TO": 0.0,
    "TT": 0.0,
    "TN": 0.0,
    "TR": 0.0,
    "TM": 0.0,
    "TC": 0.0,
    "TV": 0.0,
    "UG": 0.0,
    "UA": 0.0,
    "AE": 0.0,
    "GB": 0.0,
    "UY": 0.0,
    "US": 0.0,
    "VI": 0.0,
    "UZ": 0.0,
    "VU": 0.0,
    "VE": 0.0,
    "VN": 0.0,
    "WF": 0.0,
    "EH": 0.0,
    "YE": 0.0,
    "ZM": 0.0,
    "ZW": 0.0

};
},{"iso-3166-1-codes":3}],2:[function(require,module,exports){
module.exports=[
	{"numeric":"004","alpha2":"AF","alpha3":"AFG","name":"Afghanistan"},
	{"numeric":"248","alpha2":"AX","alpha3":"ALA","name":"Åland Islands"},
	{"numeric":"008","alpha2":"AL","alpha3":"ALB","name":"Albania"},
	{"numeric":"012","alpha2":"DZ","alpha3":"DZA","name":"Algeria"},
	{"numeric":"016","alpha2":"AS","alpha3":"ASM","name":"American Samoa"},
	{"numeric":"020","alpha2":"AD","alpha3":"AND","name":"Andorra"},
	{"numeric":"024","alpha2":"AO","alpha3":"AGO","name":"Angola"},
	{"numeric":"660","alpha2":"AI","alpha3":"AIA","name":"Anguilla"},
	{"numeric":"010","alpha2":"AQ","alpha3":"ATA","name":"Antarctica"},
	{"numeric":"028","alpha2":"AG","alpha3":"ATG","name":"Antigua and Barbuda"},
	{"numeric":"032","alpha2":"AR","alpha3":"ARG","name":"Argentina"},
	{"numeric":"051","alpha2":"AM","alpha3":"ARM","name":"Armenia"},
	{"numeric":"533","alpha2":"AW","alpha3":"ABW","name":"Aruba"},
	{"numeric":"036","alpha2":"AU","alpha3":"AUS","name":"Australia"},
	{"numeric":"040","alpha2":"AT","alpha3":"AUT","name":"Austria"},
	{"numeric":"031","alpha2":"AZ","alpha3":"AZE","name":"Azerbaijan"},
	{"numeric":"044","alpha2":"BS","alpha3":"BHS","name":"Bahamas"},
	{"numeric":"048","alpha2":"BH","alpha3":"BHR","name":"Bahrain"},
	{"numeric":"050","alpha2":"BD","alpha3":"BGD","name":"Bangladesh"},
	{"numeric":"052","alpha2":"BB","alpha3":"BRB","name":"Barbados"},
	{"numeric":"112","alpha2":"BY","alpha3":"BLR","name":"Belarus"},
	{"numeric":"056","alpha2":"BE","alpha3":"BEL","name":"Belgium"},
	{"numeric":"084","alpha2":"BZ","alpha3":"BLZ","name":"Belize"},
	{"numeric":"204","alpha2":"BJ","alpha3":"BEN","name":"Benin"},
	{"numeric":"060","alpha2":"BM","alpha3":"BMU","name":"Bermuda"},
	{"numeric":"064","alpha2":"BT","alpha3":"BTN","name":"Bhutan"},
	{"numeric":"068","alpha2":"BO","alpha3":"BOL","name":"Bolivia (Plurinational State of)"},
	{"numeric":"535","alpha2":"BQ","alpha3":"BES","name":"Bonaire, Sint Eustatius and Saba"},
	{"numeric":"070","alpha2":"BA","alpha3":"BIH","name":"Bosnia and Herzegovina"},
	{"numeric":"072","alpha2":"BW","alpha3":"BWA","name":"Botswana"},
	{"numeric":"074","alpha2":"BV","alpha3":"BVT","name":"Bouvet Island"},
	{"numeric":"076","alpha2":"BR","alpha3":"BRA","name":"Brazil"},
	{"numeric":"086","alpha2":"IO","alpha3":"IOT","name":"British Indian Ocean Territory"},
	{"numeric":"096","alpha2":"BN","alpha3":"BRN","name":"Brunei Darussalam"},
	{"numeric":"100","alpha2":"BG","alpha3":"BGR","name":"Bulgaria"},
	{"numeric":"854","alpha2":"BF","alpha3":"BFA","name":"Burkina Faso"},
	{"numeric":"108","alpha2":"BI","alpha3":"BDI","name":"Burundi"},
	{"numeric":"132","alpha2":"CV","alpha3":"CPV","name":"Cabo Verde"},
	{"numeric":"116","alpha2":"KH","alpha3":"KHM","name":"Cambodia"},
	{"numeric":"120","alpha2":"CM","alpha3":"CMR","name":"Cameroon"},
	{"numeric":"124","alpha2":"CA","alpha3":"CAN","name":"Canada"},
	{"numeric":"136","alpha2":"KY","alpha3":"CYM","name":"Cayman Islands"},
	{"numeric":"140","alpha2":"CF","alpha3":"CAF","name":"Central African Republic"},
	{"numeric":"148","alpha2":"TD","alpha3":"TCD","name":"Chad"},
	{"numeric":"152","alpha2":"CL","alpha3":"CHL","name":"Chile"},
	{"numeric":"156","alpha2":"CN","alpha3":"CHN","name":"China"},
	{"numeric":"162","alpha2":"CX","alpha3":"CXR","name":"Christmas Island"},
	{"numeric":"166","alpha2":"CC","alpha3":"CCK","name":"Cocos (Keeling) Islands"},
	{"numeric":"170","alpha2":"CO","alpha3":"COL","name":"Colombia"},
	{"numeric":"174","alpha2":"KM","alpha3":"COM","name":"Comoros"},
	{"numeric":"178","alpha2":"CG","alpha3":"COG","name":"Congo"},
	{"numeric":"180","alpha2":"CD","alpha3":"COD","name":"Congo (Democratic Republic of the)"},
	{"numeric":"184","alpha2":"CK","alpha3":"COK","name":"Cook Islands"},
	{"numeric":"188","alpha2":"CR","alpha3":"CRI","name":"Costa Rica"},
	{"numeric":"384","alpha2":"CI","alpha3":"CIV","name":"Côte d'Ivoire"},
	{"numeric":"191","alpha2":"HR","alpha3":"HRV","name":"Croatia"},
	{"numeric":"192","alpha2":"CU","alpha3":"CUB","name":"Cuba"},
	{"numeric":"531","alpha2":"CW","alpha3":"CUW","name":"Curaçao"},
	{"numeric":"196","alpha2":"CY","alpha3":"CYP","name":"Cyprus"},
	{"numeric":"203","alpha2":"CZ","alpha3":"CZE","name":"Czechia"},
	{"numeric":"208","alpha2":"DK","alpha3":"DNK","name":"Denmark"},
	{"numeric":"262","alpha2":"DJ","alpha3":"DJI","name":"Djibouti"},
	{"numeric":"212","alpha2":"DM","alpha3":"DMA","name":"Dominica"},
	{"numeric":"214","alpha2":"DO","alpha3":"DOM","name":"Dominican Republic"},
	{"numeric":"218","alpha2":"EC","alpha3":"ECU","name":"Ecuador"},
	{"numeric":"818","alpha2":"EG","alpha3":"EGY","name":"Egypt"},
	{"numeric":"222","alpha2":"SV","alpha3":"SLV","name":"El Salvador"},
	{"numeric":"226","alpha2":"GQ","alpha3":"GNQ","name":"Equatorial Guinea"},
	{"numeric":"232","alpha2":"ER","alpha3":"ERI","name":"Eritrea"},
	{"numeric":"233","alpha2":"EE","alpha3":"EST","name":"Estonia"},
	{"numeric":"231","alpha2":"ET","alpha3":"ETH","name":"Ethiopia"},
	{"numeric":"238","alpha2":"FK","alpha3":"FLK","name":"Falkland Islands (Malvinas)"},
	{"numeric":"234","alpha2":"FO","alpha3":"FRO","name":"Faroe Islands"},
	{"numeric":"242","alpha2":"FJ","alpha3":"FJI","name":"Fiji"},
	{"numeric":"246","alpha2":"FI","alpha3":"FIN","name":"Finland"},
	{"numeric":"250","alpha2":"FR","alpha3":"FRA","name":"France"},
	{"numeric":"254","alpha2":"GF","alpha3":"GUF","name":"French Guiana"},
	{"numeric":"258","alpha2":"PF","alpha3":"PYF","name":"French Polynesia"},
	{"numeric":"260","alpha2":"TF","alpha3":"ATF","name":"French Southern Territories"},
	{"numeric":"266","alpha2":"GA","alpha3":"GAB","name":"Gabon"},
	{"numeric":"270","alpha2":"GM","alpha3":"GMB","name":"Gambia"},
	{"numeric":"268","alpha2":"GE","alpha3":"GEO","name":"Georgia"},
	{"numeric":"276","alpha2":"DE","alpha3":"DEU","name":"Germany"},
	{"numeric":"288","alpha2":"GH","alpha3":"GHA","name":"Ghana"},
	{"numeric":"292","alpha2":"GI","alpha3":"GIB","name":"Gibraltar"},
	{"numeric":"300","alpha2":"GR","alpha3":"GRC","name":"Greece"},
	{"numeric":"304","alpha2":"GL","alpha3":"GRL","name":"Greenland"},
	{"numeric":"308","alpha2":"GD","alpha3":"GRD","name":"Grenada"},
	{"numeric":"312","alpha2":"GP","alpha3":"GLP","name":"Guadeloupe"},
	{"numeric":"316","alpha2":"GU","alpha3":"GUM","name":"Guam"},
	{"numeric":"320","alpha2":"GT","alpha3":"GTM","name":"Guatemala"},
	{"numeric":"831","alpha2":"GG","alpha3":"GGY","name":"Guernsey"},
	{"numeric":"324","alpha2":"GN","alpha3":"GIN","name":"Guinea"},
	{"numeric":"624","alpha2":"GW","alpha3":"GNB","name":"Guinea-Bissau"},
	{"numeric":"328","alpha2":"GY","alpha3":"GUY","name":"Guyana"},
	{"numeric":"332","alpha2":"HT","alpha3":"HTI","name":"Haiti"},
	{"numeric":"334","alpha2":"HM","alpha3":"HMD","name":"Heard Island and McDonald Islands"},
	{"numeric":"336","alpha2":"VA","alpha3":"VAT","name":"Holy See"},
	{"numeric":"340","alpha2":"HN","alpha3":"HND","name":"Honduras"},
	{"numeric":"344","alpha2":"HK","alpha3":"HKG","name":"Hong Kong"},
	{"numeric":"348","alpha2":"HU","alpha3":"HUN","name":"Hungary"},
	{"numeric":"352","alpha2":"IS","alpha3":"ISL","name":"Iceland"},
	{"numeric":"356","alpha2":"IN","alpha3":"IND","name":"India"},
	{"numeric":"360","alpha2":"ID","alpha3":"IDN","name":"Indonesia"},
	{"numeric":"364","alpha2":"IR","alpha3":"IRN","name":"Iran (Islamic Republic of)"},
	{"numeric":"368","alpha2":"IQ","alpha3":"IRQ","name":"Iraq"},
	{"numeric":"372","alpha2":"IE","alpha3":"IRL","name":"Ireland"},
	{"numeric":"833","alpha2":"IM","alpha3":"IMN","name":"Isle of Man"},
	{"numeric":"376","alpha2":"IL","alpha3":"ISR","name":"Israel"},
	{"numeric":"380","alpha2":"IT","alpha3":"ITA","name":"Italy"},
	{"numeric":"388","alpha2":"JM","alpha3":"JAM","name":"Jamaica"},
	{"numeric":"392","alpha2":"JP","alpha3":"JPN","name":"Japan"},
	{"numeric":"832","alpha2":"JE","alpha3":"JEY","name":"Jersey"},
	{"numeric":"400","alpha2":"JO","alpha3":"JOR","name":"Jordan"},
	{"numeric":"398","alpha2":"KZ","alpha3":"KAZ","name":"Kazakhstan"},
	{"numeric":"404","alpha2":"KE","alpha3":"KEN","name":"Kenya"},
	{"numeric":"296","alpha2":"KI","alpha3":"KIR","name":"Kiribati"},
	{"numeric":"408","alpha2":"KP","alpha3":"PRK","name":"Korea (Democratic People's Republic of)"},
	{"numeric":"410","alpha2":"KR","alpha3":"KOR","name":"Korea (Republic of)"},
	{"numeric":"414","alpha2":"KW","alpha3":"KWT","name":"Kuwait"},
	{"numeric":"417","alpha2":"KG","alpha3":"KGZ","name":"Kyrgyzstan"},
	{"numeric":"418","alpha2":"LA","alpha3":"LAO","name":"Lao People's Democratic Republic"},
	{"numeric":"428","alpha2":"LV","alpha3":"LVA","name":"Latvia"},
	{"numeric":"422","alpha2":"LB","alpha3":"LBN","name":"Lebanon"},
	{"numeric":"426","alpha2":"LS","alpha3":"LSO","name":"Lesotho"},
	{"numeric":"430","alpha2":"LR","alpha3":"LBR","name":"Liberia"},
	{"numeric":"434","alpha2":"LY","alpha3":"LBY","name":"Libya"},
	{"numeric":"438","alpha2":"LI","alpha3":"LIE","name":"Liechtenstein"},
	{"numeric":"440","alpha2":"LT","alpha3":"LTU","name":"Lithuania"},
	{"numeric":"442","alpha2":"LU","alpha3":"LUX","name":"Luxembourg"},
	{"numeric":"446","alpha2":"MO","alpha3":"MAC","name":"Macao"},
	{"numeric":"807","alpha2":"MK","alpha3":"MKD","name":"Macedonia (the former Yugoslav Republic of)"},
	{"numeric":"450","alpha2":"MG","alpha3":"MDG","name":"Madagascar"},
	{"numeric":"454","alpha2":"MW","alpha3":"MWI","name":"Malawi"},
	{"numeric":"458","alpha2":"MY","alpha3":"MYS","name":"Malaysia"},
	{"numeric":"462","alpha2":"MV","alpha3":"MDV","name":"Maldives"},
	{"numeric":"466","alpha2":"ML","alpha3":"MLI","name":"Mali"},
	{"numeric":"470","alpha2":"MT","alpha3":"MLT","name":"Malta"},
	{"numeric":"584","alpha2":"MH","alpha3":"MHL","name":"Marshall Islands"},
	{"numeric":"474","alpha2":"MQ","alpha3":"MTQ","name":"Martinique"},
	{"numeric":"478","alpha2":"MR","alpha3":"MRT","name":"Mauritania"},
	{"numeric":"480","alpha2":"MU","alpha3":"MUS","name":"Mauritius"},
	{"numeric":"175","alpha2":"YT","alpha3":"MYT","name":"Mayotte"},
	{"numeric":"484","alpha2":"MX","alpha3":"MEX","name":"Mexico"},
	{"numeric":"583","alpha2":"FM","alpha3":"FSM","name":"Micronesia (Federated States of)"},
	{"numeric":"498","alpha2":"MD","alpha3":"MDA","name":"Moldova (Republic of)"},
	{"numeric":"492","alpha2":"MC","alpha3":"MCO","name":"Monaco"},
	{"numeric":"496","alpha2":"MN","alpha3":"MNG","name":"Mongolia"},
	{"numeric":"499","alpha2":"ME","alpha3":"MNE","name":"Montenegro"},
	{"numeric":"500","alpha2":"MS","alpha3":"MSR","name":"Montserrat"},
	{"numeric":"504","alpha2":"MA","alpha3":"MAR","name":"Morocco"},
	{"numeric":"508","alpha2":"MZ","alpha3":"MOZ","name":"Mozambique"},
	{"numeric":"104","alpha2":"MM","alpha3":"MMR","name":"Myanmar"},
	{"numeric":"516","alpha2":"NA","alpha3":"NAM","name":"Namibia"},
	{"numeric":"520","alpha2":"NR","alpha3":"NRU","name":"Nauru"},
	{"numeric":"524","alpha2":"NP","alpha3":"NPL","name":"Nepal"},
	{"numeric":"528","alpha2":"NL","alpha3":"NLD","name":"Netherlands"},
	{"numeric":"540","alpha2":"NC","alpha3":"NCL","name":"New Caledonia"},
	{"numeric":"554","alpha2":"NZ","alpha3":"NZL","name":"New Zealand"},
	{"numeric":"558","alpha2":"NI","alpha3":"NIC","name":"Nicaragua"},
	{"numeric":"562","alpha2":"NE","alpha3":"NER","name":"Niger"},
	{"numeric":"566","alpha2":"NG","alpha3":"NGA","name":"Nigeria"},
	{"numeric":"570","alpha2":"NU","alpha3":"NIU","name":"Niue"},
	{"numeric":"574","alpha2":"NF","alpha3":"NFK","name":"Norfolk Island"},
	{"numeric":"580","alpha2":"MP","alpha3":"MNP","name":"Northern Mariana Islands"},
	{"numeric":"578","alpha2":"NO","alpha3":"NOR","name":"Norway"},
	{"numeric":"512","alpha2":"OM","alpha3":"OMN","name":"Oman"},
	{"numeric":"586","alpha2":"PK","alpha3":"PAK","name":"Pakistan"},
	{"numeric":"585","alpha2":"PW","alpha3":"PLW","name":"Palau"},
	{"numeric":"275","alpha2":"PS","alpha3":"PSE","name":"Palestine, State of"},
	{"numeric":"591","alpha2":"PA","alpha3":"PAN","name":"Panama"},
	{"numeric":"598","alpha2":"PG","alpha3":"PNG","name":"Papua New Guinea"},
	{"numeric":"600","alpha2":"PY","alpha3":"PRY","name":"Paraguay"},
	{"numeric":"604","alpha2":"PE","alpha3":"PER","name":"Peru"},
	{"numeric":"608","alpha2":"PH","alpha3":"PHL","name":"Philippines"},
	{"numeric":"612","alpha2":"PN","alpha3":"PCN","name":"Pitcairn"},
	{"numeric":"616","alpha2":"PL","alpha3":"POL","name":"Poland"},
	{"numeric":"620","alpha2":"PT","alpha3":"PRT","name":"Portugal"},
	{"numeric":"630","alpha2":"PR","alpha3":"PRI","name":"Puerto Rico"},
	{"numeric":"634","alpha2":"QA","alpha3":"QAT","name":"Qatar"},
	{"numeric":"638","alpha2":"RE","alpha3":"REU","name":"Réunion"},
	{"numeric":"642","alpha2":"RO","alpha3":"ROU","name":"Romania"},
	{"numeric":"643","alpha2":"RU","alpha3":"RUS","name":"Russian Federation"},
	{"numeric":"646","alpha2":"RW","alpha3":"RWA","name":"Rwanda"},
	{"numeric":"652","alpha2":"BL","alpha3":"BLM","name":"Saint Barthélemy"},
	{"numeric":"654","alpha2":"SH","alpha3":"SHN","name":"Saint Helena, Ascension and Tristan da Cunha"},
	{"numeric":"659","alpha2":"KN","alpha3":"KNA","name":"Saint Kitts and Nevis"},
	{"numeric":"662","alpha2":"LC","alpha3":"LCA","name":"Saint Lucia"},
	{"numeric":"663","alpha2":"MF","alpha3":"MAF","name":"Saint Martin (French part)"},
	{"numeric":"666","alpha2":"PM","alpha3":"SPM","name":"Saint Pierre and Miquelon"},
	{"numeric":"670","alpha2":"VC","alpha3":"VCT","name":"Saint Vincent and the Grenadines"},
	{"numeric":"882","alpha2":"WS","alpha3":"WSM","name":"Samoa"},
	{"numeric":"674","alpha2":"SM","alpha3":"SMR","name":"San Marino"},
	{"numeric":"678","alpha2":"ST","alpha3":"STP","name":"Sao Tome and Principe"},
	{"numeric":"682","alpha2":"SA","alpha3":"SAU","name":"Saudi Arabia"},
	{"numeric":"686","alpha2":"SN","alpha3":"SEN","name":"Senegal"},
	{"numeric":"688","alpha2":"RS","alpha3":"SRB","name":"Serbia"},
	{"numeric":"690","alpha2":"SC","alpha3":"SYC","name":"Seychelles"},
	{"numeric":"694","alpha2":"SL","alpha3":"SLE","name":"Sierra Leone"},
	{"numeric":"702","alpha2":"SG","alpha3":"SGP","name":"Singapore"},
	{"numeric":"534","alpha2":"SX","alpha3":"SXM","name":"Sint Maarten (Dutch part)"},
	{"numeric":"703","alpha2":"SK","alpha3":"SVK","name":"Slovakia"},
	{"numeric":"705","alpha2":"SI","alpha3":"SVN","name":"Slovenia"},
	{"numeric":"090","alpha2":"SB","alpha3":"SLB","name":"Solomon Islands"},
	{"numeric":"706","alpha2":"SO","alpha3":"SOM","name":"Somalia"},
	{"numeric":"710","alpha2":"ZA","alpha3":"ZAF","name":"South Africa"},
	{"numeric":"239","alpha2":"GS","alpha3":"SGS","name":"South Georgia and the South Sandwich Islands"},
	{"numeric":"728","alpha2":"SS","alpha3":"SSD","name":"South Sudan"},
	{"numeric":"724","alpha2":"ES","alpha3":"ESP","name":"Spain"},
	{"numeric":"144","alpha2":"LK","alpha3":"LKA","name":"Sri Lanka"},
	{"numeric":"729","alpha2":"SD","alpha3":"SDN","name":"Sudan"},
	{"numeric":"740","alpha2":"SR","alpha3":"SUR","name":"Suriname"},
	{"numeric":"744","alpha2":"SJ","alpha3":"SJM","name":"Svalbard and Jan Mayen"},
	{"numeric":"748","alpha2":"SZ","alpha3":"SWZ","name":"Eswatini"},
	{"numeric":"752","alpha2":"SE","alpha3":"SWE","name":"Sweden"},
	{"numeric":"756","alpha2":"CH","alpha3":"CHE","name":"Switzerland"},
	{"numeric":"760","alpha2":"SY","alpha3":"SYR","name":"Syrian Arab Republic"},
	{"numeric":"158","alpha2":"TW","alpha3":"TWN","name":"Taiwan, Province of China[a]"},
	{"numeric":"762","alpha2":"TJ","alpha3":"TJK","name":"Tajikistan"},
	{"numeric":"834","alpha2":"TZ","alpha3":"TZA","name":"Tanzania, United Republic of"},
	{"numeric":"764","alpha2":"TH","alpha3":"THA","name":"Thailand"},
	{"numeric":"626","alpha2":"TL","alpha3":"TLS","name":"Timor-Leste"},
	{"numeric":"768","alpha2":"TG","alpha3":"TGO","name":"Togo"},
	{"numeric":"772","alpha2":"TK","alpha3":"TKL","name":"Tokelau"},
	{"numeric":"776","alpha2":"TO","alpha3":"TON","name":"Tonga"},
	{"numeric":"780","alpha2":"TT","alpha3":"TTO","name":"Trinidad and Tobago"},
	{"numeric":"788","alpha2":"TN","alpha3":"TUN","name":"Tunisia"},
	{"numeric":"792","alpha2":"TR","alpha3":"TUR","name":"Turkey"},
	{"numeric":"795","alpha2":"TM","alpha3":"TKM","name":"Turkmenistan"},
	{"numeric":"796","alpha2":"TC","alpha3":"TCA","name":"Turks and Caicos Islands"},
	{"numeric":"798","alpha2":"TV","alpha3":"TUV","name":"Tuvalu"},
	{"numeric":"800","alpha2":"UG","alpha3":"UGA","name":"Uganda"},
	{"numeric":"804","alpha2":"UA","alpha3":"UKR","name":"Ukraine"},
	{"numeric":"784","alpha2":"AE","alpha3":"ARE","name":"United Arab Emirates"},
	{"numeric":"826","alpha2":"GB","alpha3":"GBR","name":"United Kingdom of Great Britain and Northern Ireland"},
	{"numeric":"840","alpha2":"US","alpha3":"USA","name":"United States of America"},
	{"numeric":"581","alpha2":"UM","alpha3":"UMI","name":"United States Minor Outlying Islands"},
	{"numeric":"858","alpha2":"UY","alpha3":"URY","name":"Uruguay"},
	{"numeric":"860","alpha2":"UZ","alpha3":"UZB","name":"Uzbekistan"},
	{"numeric":"548","alpha2":"VU","alpha3":"VUT","name":"Vanuatu"},
	{"numeric":"862","alpha2":"VE","alpha3":"VEN","name":"Venezuela (Bolivarian Republic of)"},
	{"numeric":"704","alpha2":"VN","alpha3":"VNM","name":"Viet Nam"},
	{"numeric":"092","alpha2":"VG","alpha3":"VGB","name":"Virgin Islands (British)"},
	{"numeric":"850","alpha2":"VI","alpha3":"VIR","name":"Virgin Islands (U.S.)"},
	{"numeric":"876","alpha2":"WF","alpha3":"WLF","name":"Wallis and Futuna"},
	{"numeric":"732","alpha2":"EH","alpha3":"ESH","name":"Western Sahara"},
	{"numeric":"887","alpha2":"YE","alpha3":"YEM","name":"Yemen"},
	{"numeric":"894","alpha2":"ZM","alpha3":"ZMB","name":"Zambia"},
	{"numeric":"716","alpha2":"ZW","alpha3":"ZWE","name":"Zimbabwe"}
]

},{}],3:[function(require,module,exports){
'use strict';

var countries = require('./data.json');

countries.byNumeric = byNumeric;
countries.byAlpha2 = byAlpha2;
countries.byAlpha3 = byAlpha3;

module.exports = countries;

var numericMap;
var alpha2Map;
var alpha3Map;

function byNumeric( code ){
	if (numericMap === undefined)
		numericMap = new Map(countries.map(function( country ){
			return [ country.numeric, country ];
		}));

	return numericMap;
}

function byAlpha2( code ){
	if (alpha2Map === undefined)
		alpha2Map = new Map(countries.map(function( country ){
			return [ country.alpha2, country ];
		}));

	return alpha2Map;
}

function byAlpha3( code ){
	if (alpha3Map === undefined)
		alpha3Map = new Map(countries.map(function( country ){
			return [ country.alpha3, country ];
		}));

	return alpha3Map;
}

},{"./data.json":2}]},{},[1]);
