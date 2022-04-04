const googleAPI = "https://opensheet.elk.sh/";
const spreadsheet = "1_rkHKgIPt3i_2uKr8kh5u4WZaYOLccNiiTx1xAaAo_Y";

var fplData = fetchData("Data");
var transferPicks = fetchData("Transfer Pick - GK");
var managers = fetchData("Top 100 Managers");
var transfersIN = fetchData("Transfers-IN");
var transfersOut = fetchData("Transfers-OUT");

// https://dmitripavlutin.com/javascript-fetch-async-await/
// https://benborgers.com/posts/google-sheets-json
async function fetchData(tab){
    const endpoint = `${googleAPI}${spreadsheet}/${tab}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
};

//https://stackoverflow.com/questions/30018106/set-domain-on-ordinal-scale-from-tsv-data
const colorScale = d3.scaleOrdinal()
                        .domain(["GK", "MID", "FWD", "DEF"])
                        .range(d3.schemeCategory10);

// function to retrieve an element and add an event listener
// const btn = document.querySelector('button');
// btn.addEventListener('click', getData)
