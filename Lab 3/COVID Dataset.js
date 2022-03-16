// importing the csv file
let dataset = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

var covidData,
selection,
entries,
domain = [],
colorScale;

const death_columns = ["continent",	"location",	"date", "total_deaths"];
const cases_columns = ["continent",	"location",	"date", "total_cases"];

// reading the csv file
d3.csv(dataset).then(function(data) {

    // group the data
    // https://observablehq.com/@d3/d3-group-d3-hierarchy
    // https://observablehq.com/@d3/d3-hierarchy
    entries = d3.group(data, d => d.continent, d => d.location, d => d.date)

    startGlobe();
});

var q = new Date();
const yesterday = new Date(q)
yesterday.setDate(yesterday.getDate() - 1);

function filterData (column) {
  covidData = new Map();
  Array.from(entries, ([key1, value]) => { 
    if(key1 != "") {
        Array.from(value, ([key2, kk]) => {
                Array.from(kk, ([key3, poo]) => {
                    if(key3 == String(yesterday.toISOString().split('T')[0])) {
                        covidData.set(key2, parseInt(poo[0][column]) )
                                    }
                            })
                        }
                )
            }
        })

      //https://stackoverflow.com/questions/48707227/how-to-filter-a-javascript-map
      const max = new Map([...covidData].filter(([k,v]) => !isNaN(v) ));

      domain = [0,(Math.max(...max.values()))]

      colorScale = d3.scaleSequential(d3.interpolateViridis).domain(domain)

      legend();
      };

function toggleText(column) {
  var text = document.getElementById("globeTitle");
  selection = column;
  if (column === "deaths") {
    text.textContent = "Total Deaths Per Million"
    text.style.display = "block";
  } else if (column === "cases") {
    text.textContent = "Total Cases Per Million"
    text.style.display = "block";
  }
};

function setLineData(country) {
  if (country != undefined) {
    Array.from(entries, ([keyL1, valueL1]) => { 
      if(keyL1 != "") {
        Array.from(valueL1, ([keyL2, valueL2]) => {
          if(keyL2 === country.name) {
            loadLineGraph(filterCountryData(valueL2));
          }
        })
      }
    })
  }
    // country = countries.features.find(o => o.id === ID)
    // var result = entries.get("Asia").get("Hong Kong").get(String(yesterday.toISOString().split('T')[0]))
};

function filterCountryData(data) {
  var filteredMap = new Map();
  for (let key of data.keys()) {
    var obj = {};
    if (selection === "deaths") {
      death_columns.forEach(i => {
        obj[i] = data.get(key)[0][i]
      })
    } else if (selection === "cases") {
      cases_columns.forEach(i => {
        obj[i] = data.get(key)[0][i]
      })
    }
    
    filteredMap.set(key, obj);
    //console.log(filteredMap)
  }
  return filteredMap;
}


  