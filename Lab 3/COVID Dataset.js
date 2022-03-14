// importing the csv file
let dataset = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

var margin = {top: 20, right: 10, bottom: 40, left: 100},
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var current = d3.select('#current');

var canvas = d3.select('#globe')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

var context = canvas.node()
                    .getContext('2d');

let projection = d3.geoOrthographic()
                    .scale(width / Math.PI);

let geoGenerator = d3.geoPath()
                    .projection(projection)
                    .pointRadius(4)
                    .context(context);
                    
let graticule = d3.geoGraticule10();

var degPerMs = 6 / 1000;
var rotationDelay = 3000;

var v0; // Mouse position in Cartesian coordinates at start of drag gesture.
var r0; // Projection rotation as Euler angles at start.
var q0; // Projection rotation as versor at start.

var land, countries, currentCountry;

var autorotate, now, diff, rotation;

var lastTime = d3.now();

function update() {

  context.clearRect(0, 0, 800, 600);
    fill({type: 'Sphere'}, '#00BFFF')
    stroke(graticule, '#ccc')
    fill(land, '#111')
  
  attachData();

  if (currentCountry) {
    fill(currentCountry, '#a00')
  }
}

function fill(obj, color) {
    context.beginPath()
    geoGenerator(obj)
    context.fillStyle = color
    context.fill()
  }

  function stroke(obj, color) {
    context.beginPath()
    geoGenerator(obj)
    context.strokeStyle = color
    context.stroke()
  }

  function loadData(cb) {
    d3.json('https://unpkg.com/world-atlas@1/world/110m.json').then(function(world) {
      d3.tsv('https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv').then(function(countries) {
        cb(world, countries)
      })
    })
  }



var deaths = new Map(),
domain = [],
colorScale;

// reading the csv file
d3.csv(dataset).then(function(data) {

    // https://observablehq.com/@d3/d3-group-d3-hierarchy
    // https://observablehq.com/@d3/d3-hierarchy
    var entries = d3.group(data, d => d.continent, d => d.location, d => d.date)

    mapIterator(entries);
});

var q = new Date();
const yesterday = new Date(q)
yesterday.setDate(yesterday.getDate() - 1);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function mapIterator (map) {
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

function enter(country) {
    var country = countryList.find(function(c) {
        return parseInt(c.id, 10) === parseInt(country.id, 10)
    })
    current.text(country && country.name || '')
    };
    
function leave(country) {
    current.text('')
    };

function rotate(elapsed) {
    now = d3.now()
    diff = now - lastTime
    if (diff < elapsed) {
        rotation = projection.rotate()
        rotation[0] += diff * degPerMs
        projection.rotate(rotation)
        update()
    }
    lastTime = now
    }

function startRotation(delay) {
    autorotate.restart(rotate, delay || 0)
}

function stopRotation() {
    autorotate.stop()
}
      

function dragstarted(event) {
    v0 = versor.cartesian(projection.invert(event))
    r0 = projection.rotate()
    q0 = versor(r0)
    stopRotation()
    };
    
function dragged(event) {
    var v1 = versor.cartesian(projection.rotate(r0).invert(event))
    var q1 = versor.multiply(q0, versor.delta(v0, v1))
    var r1 = versor.rotation(q1)
    projection.rotate(r1)
    update()
    }
    
function dragended() {
    startRotation(rotationDelay)
    };

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
    var n = polygon.length
    var p = polygon[n - 1]
    var x = point[0], y = point[1]
    var x0 = p[0], y0 = p[1]
    var x1, y1
    var inside = false
    for (var i = 0; i < n; ++i) {
      p = polygon[i], x1 = p[0], y1 = p[1]
      if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
      x0 = x1, y0 = y1
    }
    return inside
  }
 
function mousemove(event) {
    var c = getCountry(event)
    if (!c) {
      if (currentCountry) {
        leave(currentCountry)
        currentCountry = undefined
        update()
      }
      return
    }
    if (c === currentCountry) {
      return
    }
    currentCountry = c
    update()
    enter(c)
  }

  function getCountry(event) {
    // Mouse coordinates inverted
    var pos = projection.invert(event)

    
    return countries.features.find(function(f) {
      return f.geometry.coordinates.find(function(c1) {
        return polygonContains(c1, pos) || c1.find(function(c2) {
          return polygonContains(c2, pos)
        })
      })
    })
  }

  function attachData() {
    var ID
    var total
    var country
    
    // https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object
    for (let key in countryList) {
        total = deaths.get(countryList[key].name) || 0;
        if (parseInt(countryList[key].id) < 0) {
          ID = countryList[key].id.replace('-','-00');
        } else if (parseInt(countryList[key].id) > 0 && parseInt(countryList[key].id) < 10) {
          ID = "00" + countryList[key].id;
        } else if (parseInt(countryList[key].id) >= 10 && parseInt(countryList[key].id) < 100) {
          ID = "0" + countryList[key].id;
        } else {
          ID = countryList[key].id
        }

        country = countries.features.find(o => o.id === ID)

        if (country != undefined) {          
          fill(country, colorScale(total))
        }
      }
    };
          
canvas.call(d3.drag()
    .on('start',  e => dragstarted(d3.pointer(e)) )
    .on('drag', e => dragged(d3.pointer(e)))
    .on('end', dragended)
   )
  .on('mousemove', e => mousemove(d3.pointer(e)) )
  .data(deaths)

loadData(function(world, cList) {

    land = topojson.feature(world, world.objects.land)
    countries = topojson.feature(world, world.objects.countries)
    countryList = cList

    window.setInterval(update, 50);
    autorotate = d3.timer(rotate)
    })
