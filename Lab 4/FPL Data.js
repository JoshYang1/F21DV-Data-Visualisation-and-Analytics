const googleAPI = "https://opensheet.elk.sh/"
const spreadsheet = "1_rkHKgIPt3i_2uKr8kh5u4WZaYOLccNiiTx1xAaAo_Y";

var fplData = fetchData("Data");
var transferPicks = fetchData("Transfer Pick - GK")

// https://dmitripavlutin.com/javascript-fetch-async-await/
// https://benborgers.com/posts/google-sheets-json
async function fetchData(tab){
    const endpoint = `${googleAPI}${spreadsheet}/${tab}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
};


// function to retrieve an element and add an event listener
// const btn = document.querySelector('button');
// btn.addEventListener('click', getData)
