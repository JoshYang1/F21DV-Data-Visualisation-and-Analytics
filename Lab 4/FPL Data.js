const googleAPI = "https://opensheet.elk.sh/"
const spreadsheet = "1_rkHKgIPt3i_2uKr8kh5u4WZaYOLccNiiTx1xAaAo_Y";
const tab = 'Data';
const endpoint1 = `${googleAPI}${spreadsheet}/${tab}`;

var fplData = fetchData(endpoint1);

// https://dmitripavlutin.com/javascript-fetch-async-await/
// https://benborgers.com/posts/google-sheets-json
async function fetchData(endpoint){
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
};


// function to retrieve an element and add an event listener
// const btn = document.querySelector('button');
// btn.addEventListener('click', getData)
