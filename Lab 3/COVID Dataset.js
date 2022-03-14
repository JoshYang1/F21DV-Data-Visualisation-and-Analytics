// importing the csv file
let dataset = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

var deaths = new Map(),
domain = [],
colorScale;

var entries;

// reading the csv file
d3.csv(dataset).then(function(data) {

    // group the data
    // https://observablehq.com/@d3/d3-group-d3-hierarchy
    // https://observablehq.com/@d3/d3-hierarchy
    entries = d3.group(data, d => d.continent, d => d.location, d => d.date)

    iterator(entries);
    startGlobe();
});

var q = new Date();
const yesterday = new Date(q)
yesterday.setDate(yesterday.getDate() - 1);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function iterator (map) {
  Array.from(map, ([key1, value]) => { 
      if(key1 != "") {
          Array.from(value, ([key2, kk]) => {
                  Array.from(kk, ([key3, poo]) => {
                      if(key3 == String(yesterday.toISOString().split('T')[0])) {
                          // console.log(poo[0]['total_deaths'])
                          // console.log(key2)
                          deaths.set(key2, parseInt(poo[0]['total_deaths']) )
                                      }
                              })
                          }
                  )
              }
          })

      //https://stackoverflow.com/questions/48707227/how-to-filter-a-javascript-map
      const max = new Map([...deaths].filter(([k,v]) => !isNaN(v) ));

      domain = [0,(Math.max(...max.values()))]

      colorScale = d3.scaleLinear().domain(domain).range(["green", "red"])
      };

function setLineData(country) {
  if (country != undefined) {
    entries.find
    // country = countries.features.find(o => o.id === ID)
    // var result = entries.get("Asia").get("Hong Kong").get(String(yesterday.toISOString().split('T')[0]))
  }
}