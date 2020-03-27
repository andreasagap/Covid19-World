const countries = require('iso-3166-1-codes');
const byAlpha2 = countries.byAlpha2();
var total_countries = 0;
$(document).ready(function () {
    $(function () {



        for (var i = 0, keys = Object.keys(confirmedData), ii = keys.length; i < ii; i++) {
            console.log('key : ' + keys[i] + ' val : ' + confirmedData[keys[i]]);
            getData(byAlpha2.get(keys[i]), keys[i]);
        }




    }); // End - (function(---))
}) // End - $(document).ready...
var d = new Date();
d.setDate(d.getDate() - 1);
var dd = String(d.getDate()).padStart(2, '0');
var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = d.getFullYear();

yesterday = yyyy + '-' + mm + '-' + dd;

function getData(alpha3, alpha2) {
    console.log(alpha3);

    fetch("https://covidapi.info/api/v1/country/" + alpha3["alpha3"] + "/" + yesterday)
        .then(response => response.json())
        .then(data => {

            console.log(data["result"][yesterday]);

            confirmedData[alpha2] = data["result"][yesterday]["confirmed"] - data["result"][yesterday]["recovered"] - data["result"][yesterday]["deaths"];
            console.log(confirmedData[alpha2])
            total_countries += 1;
            console.log(total_countries)
            if (total_countries === 108) {

                /* map parameters */
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
                        el.html('In ' + el.html() + ': <ul>' + getDataPerCountry(confirmedData[code]) + '</ul>  Click to know more');
                        $(".lbl-hover").html('Hovered country value: ' + confirmedData[code]);
                    }
                };

                /* Setting up of the map */
                if ($('#world-map').length > 0) {
                    $('#world-map').vectorMap(wrld);
                }
            }
        })
}
/* Function for showing products name*/
function getDataPerCountry(value) {
    var ret = "";
    ret += "<li>Confirmed</li>";
    ret += "<li>Recovered</li>";
    ret += "<li>Deaths</li>";


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
    "AF": 1.0,
    "AL": 2.0,
    "DZ": 3.0,
    "AS": 4.0,
    "AD": 5.0,
    "AO": 1.0,
    "AI": 2.0,
    "AQ": 3.0,
    "AG": 4.0,
    "AR": 5.0,
    "AM": 1.0,
    "AW": 2.0,
    "AU": 3.0,
    "AT": 4.0,
    "AZ": 5.0,
    "BS": 1.0,
    "BH": 2.0,
    "BD": 3.0,
    "BB": 4.0,
    "BY": 5.0,
    "BE": 1.0,
    "BZ": 2.0,
    "BJ": 3.0,
    "BM": 4.0,
    "BT": 5.0,
    "BO": 1.0,
    "BA": 2.0,
    "BW": 3.0,
    "BR": 4.0,
    "IO": 5.0,
    "VG": 1.0,
    "BN": 2.0,
    "BG": 3.0,
    "BF": 4.0,
    "MM": 5.0,
    "BI": 1.0,
    "KH": 2.0,
    "CM": 3.0,
    "CA": 4.0,
    "CV": 5.0,
    "KY": 1.0,
    "CF": 2.0,
    "TD": 3.0,
    "CL": 4.0,
    "CN": 5.0,
    "CX": 1.0,
    "CC": 2.0,
    "CO": 3.0,
    "KM": 4.0,
    "CK": 5.0,
    "CR": 1.0,
    "HR": 2.0,
    "CU": 3.0,
    "CY": 4.0,
    "CZ": 5.0,
    "CD": 1.0,
    "DK": 2.0,
    "DJ": 3.0,
    "DM": 4.0,
    "DO": 5.0,
    "EC": 1.0,
    "EG": 2.0,
    "SV": 3.0,
    "GQ": 4.0,
    "ER": 5.0,
    "EE": 1.0,
    "ET": 2.0,
    "FK": 3.0,
    "FO": 4.0,
    "FJ": 5.0,
    "FI": 1.0,
    "FR": 2.0,
    "PF": 3.0,
    "GA": 4.0,
    "GM": 5.0,
    "GE": 1.0,
    "DE": 2.0,
    "GH": 3.0,
    "GI": 4.0,
    "GR": 5.0,
    "GL": 1.0,
    "GD": 2.0,
    "GU": 3.0,
    "GT": 4.0,
    "GN": 5.0,
    "GW": 1.0,
    "GY": 2.0,
    "HT": 3.0,
    "VA": 4.0,
    "HN": 5.0,
    "HK": 1.0,
    "HU": 2.0,
    "IS": 3.0,
    "IS": 4.0,
    "IN": 5.0,
    "ID": 1.0,
    "IR": 2.0,
    "IQ": 3.0,
    "IE": 4.0,
    "IM": 5.0,
    "IL": 1.0,
    "IT": 2.0,
    "CI": 3.0,
    "JM": 4.0,
    "JP": 5.0,
    "JE": 1.0,
    "JO": 2.0,
    "KZ": 3.0,
    "KE": 4.0,
    "KI": 5.0,
    "KW": 1.0,
    "KG": 2.0,
    "LA": 3.0,
    "LV": 4.0,
    "LB": 5.0,
    "LS": 1.0,
    "LR": 2.0,
    "LY": 3.0,
    "LI": 4.0,
    "LT": 5.0,
    "LU": 1.0,
    "MO": 2.0,
    "MK": 3.0,
    "MG": 4.0,
    "MW": 5.0,
    "MY": 1.0,
    "MV": 2.0,
    "ML": 3.0,
    "MT": 4.0,
    "MH": 5.0,
    "MR": 1.0,
    "MU": 2.0,
    "YT": 3.0,
    "MX": 4.0,
    "FM": 5.0,
    "MD": 1.0,
    "MC": 2.0,
    "MN": 3.0,
    "ME": 4.0,
    "MS": 5.0,
    "MA": 1.0,
    "MZ": 2.0,
    "NA": 3.0,
    "NR": 4.0,
    "NP": 5.0,
    "NL": 1.0,
    "AN": 2.0,
    "NC": 3.0,
    "NZ": 4.0,
    "NI": 5.0,
    "NE": 1.0,
    "NG": 2.0,
    "NU": 3.0,
    "KP": 4.0,
    "MP": 5.0,
    "NO": 1.0,
    "OM": 2.0,
    "PK": 3.0,
    "PW": 4.0,
    "PA": 5.0,
    "PG": 1.0,
    "PY": 2.0,
    "PE": 3.0,
    "PH": 4.0,
    "PN": 5.0,
    "PL": 1.0,
    "PT": 2.0,
    "PR": 3.0,
    "QA": 4.0,
    "CG": 5.0,
    "RO": 1.0,
    "RU": 2.0,
    "RW": 3.0,
    "BL": 4.0,
    "SH": 5.0,
    "KN": 1.0,
    "LC": 2.0,
    "MF": 3.0,
    "PM": 4.0,
    "VC": 5.0,
    "WS": 1.0,
    "SM": 2.0,
    "ST": 3.0,
    "SA": 4.0,
    "SN": 5.0,
    "RS": 1.0,
    "SC": 2.0,
    "SL": 3.0,
    "SG": 4.0,
    "SK": 5.0,
    "SI": 1.0,
    "SB": 2.0,
    "SO": 3.0,
    "ZA": 4.0,
    "KR": 5.0,
    "ES": 1.0,
    "LK": 2.0,
    "SD": 3.0,
    "SR": 4.0,
    "SJ": 5.0,
    "SZ": 1.0,
    "SE": 2.0,
    "CH": 3.0,
    "SY": 4.0,
    "TW": 5.0,
    "TJ": 1.0,
    "TZ": 2.0,
    "TH": 3.0,
    "TL": 4.0,
    "TG": 5.0,
    "TK": 1.0,
    "TO": 2.0,
    "TT": 3.0,
    "TN": 4.0,
    "TR": 5.0,
    "TM": 1.0,
    "TC": 2.0,
    "TV": 3.0,
    "UG": 4.0,
    "UA": 5.0,
    "AE": 1.0,
    "GB": 2.0,
    "US": 3.0,
    "UY": 4.0,
    "US": 5.0,
    "VI": 1.0,
    "UZ": 2.0,
    "VU": 3.0,
    "VE": 4.0,
    "VN": 5.0,
    "WF": 1.0,
    "EH": 2.0,
    "YE": 3.0,
    "ZM": 4.0,
    "ZW": 5.0

};