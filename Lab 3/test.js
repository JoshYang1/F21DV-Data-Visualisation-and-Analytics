

    var deaths = new Map();
    var domain = []

    // reading the csv file
    d3.csv(dataset).then(function(data) {

        // https://observablehq.com/@d3/d3-group-d3-hierarchy
        // https://observablehq.com/@d3/d3-hierarchy
        var entries = d3.group(data, d => d.continent, d => d.location, d => d.date)

        //https://flaviocopes.com/how-to-get-yesterday-date-javascript/

 
        //https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
        var result = entries.get("Asia").get("Hong Kong").get(String(yesterday.toISOString().split('T')[0]))

        console.log(result[0]['total_deaths'])


        mapIterator(entries);
        console.log(deaths)
        //https://stackoverflow.com/questions/48707227/how-to-filter-a-javascript-map
        const max = new Map([...deaths].filter(([k,v]) => !isNaN(v) ));

        domain = [0,(Math.max(...max.values()))]
        
        var root = d3.hierarchy(entries)

        console.log(domain)

        // console.log(root.children[0].children[0].children[0].children[0].data["total_cases"]);
        // console.log(root.children[0].children[0].children[0].children[0].data["date"]);
        // console.log(root.children[0].children.length);

        //iterator(root);
    
        // Hierarchy height is 4 so to access lowest level data will need 4 children (children[0].children[0].children[0].children[0])
        // if date = latest date then store the results or whack it straight into d3
        //root.each(d => console.log(d.data[0]));
         // will need to provide a better colour scale
         var colorScale = d3.scaleLinear().domain(domain).range(["green", "red"])


        // https://www.d3-graph-gallery.com/graph/backgroundmap_basic.html
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {


        });

    });

    // function removeUndefined(data, column) {
    //     Object.keys(data).forEach(key => data[key] === undefined ? delete obj[key] : {});
    // }




   


    function iterator (root) {
        for (var i = 0; i < root.children.length; i++) {
            for (var j = 0; j < root.children[i].children.length; j++) {
                for (var k = 0; k < root.children[i].children[j].children.length; k++) {
                    if (root.children[i].children[j].children[k].children[0].data["total_cases"] !== undefined) {
                        console.log(k)
                    }



                    // try {
                    //     ;
                    // } catch (e) {
                    //     console.log("errork")
                    //     continue;
                    // }
            }
        }
    }
}

var q = new Date();
const yesterday = new Date(q)
yesterday.setDate(yesterday.getDate() - 1)

// // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// function mapIterator (map) {
//     Array.from(map, ([key, value]) => { 
//         if(key == "Asia") {
//             Array.from(value, ([key, kk]) => {
//                 if(key == "Hong Kong") {
//                     Array.from(kk, ([key, poo]) => {
//                         if(key == String(yesterday.toISOString().split('T')[0])) {
//                             console.log(poo[0]['total_deaths'])
//                                         }
//                                 })
//                             }
//                             })
//                         }
//                     })
//                 };



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
        };


var result = entries.get("Asia").get("Hong Kong").get(String(yesterday.toISOString().split('T')[0]))

//console.log(result[0]['total_deaths'])
    

    

//     // const apples = [5345, 2879, 1997, 2437, 4045],
//     //     oranges = [1234, 912, 923, 8123, 3479];

//     // var width = 460,
//     //     height = 300,
//     //     radius = Math.min(width, height) / 2;

//     // var color = d3.scaleOrdinal()
//     //                 .range(d3.schemeSet3);

//     // var arc = d3.arc()
//     //             .innerRadius(radius 100)
//     //             .outerRadius(radius - 50);

//     // var svg = d3.select("#container")
//     //             .append("svg")
//     //             .attr("width", width)
//     //             .attr("height", height)
//     //             .append("g")
//     //             .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//     // // A function that create / update the plot for a given dataset
//     // const pieChart = data => {

//     //     var pie = d3.pie()
//     //             .value(function(d) {return d; })
//     //             .sort(function(a, b) {
//     //                 return d3.ascending(a, b);
//     //                 } ) // This make sure that group order remains the same in the pie chart
  
//     //     var data_ready = pie(data)

//     //     var update = svg.selectAll("path")
//     //                         .data(data_ready); 

//     //     update.enter()
//     //             .append("path")
//     //             .merge(update)
//     //             .transition()
//     //             .duration(5000)
//     //             .attr("d", arc)
//     //             .attr("fill", function(d, i) { 
//     //                 return color(i); 
//     //             });

//     //     update.exit()
//     //             .remove()