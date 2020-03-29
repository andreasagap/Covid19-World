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