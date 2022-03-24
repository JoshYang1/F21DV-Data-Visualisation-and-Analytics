const googleAPI = "https://opensheet.elk.sh/"
const spreadsheet = "1_rkHKgIPt3i_2uKr8kh5u4WZaYOLccNiiTx1xAaAo_Y";
const tab = 'Data';
const endpoint1 = `${googleAPI}${spreadsheet}/${tab}`;

var fplData;

//https://benborgers.com/posts/google-sheets-json
fetch(endpoint1)
    .then((res) => res.json())
    .then((data) => {
        fplData = data

      data.forEach((row) => {

      });
    });


// function to retrieve an element and add an event listener
// const btn = document.querySelector('button');
// btn.addEventListener('click', getData)
