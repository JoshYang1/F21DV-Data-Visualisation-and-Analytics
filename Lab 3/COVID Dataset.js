
    // importing the csv file
    let dataset = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

    var margin = {top: 20, right: 10, bottom: 40, left: 100},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // Have to use a SVG rather than a canvas as the latter does not support event handling
    var svg = d3.select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
    
    var projection = d3.geoNaturalEarth1()
                        .scale(width / 1.5 / Math.PI)
                        .translate([width / 2, height / 1.4])
                        
    var domain = [0, 500000000]
    var labels = ["< 100 M", "100 M - 500 M", "> 500 M"]
    var range = ["#F8CAEE","#BF76AF","#852170"]
    var colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(range);

    // https://www.d3-graph-gallery.com/graph/backgroundmap_basic.html
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(data.features)
                .join('path')
                .attr("fill", "#69b3a2")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .style("stroke", "#fff")
    });

    // reading the csv file
    d3.csv(dataset).then(function(data) {

        // https://observablehq.com/@d3/d3-group-d3-hierarchy
        // https://observablehq.com/@d3/d3-hierarchy
        var entries = d3.group(data, d => d.continent, d => d.location, d => d.date)

        var root = d3.hierarchy(entries)

        // Hierarchy height is 4 so to access lowest level data will need 4 children (children[0].children[0].children[0].children[0])
        // if date = latest date then store the results or whack it straight into d3
        root.each((d[0]) => console.log(d.children[0]));



    


        

    // const apples = [5345, 2879, 1997, 2437, 4045],
    //     oranges = [1234, 912, 923, 8123, 3479];

    // var width = 460,
    //     height = 300,
    //     radius = Math.min(width, height) / 2;

    // var color = d3.scaleOrdinal()
    //                 .range(d3.schemeSet3);

    // var arc = d3.arc()
    //             .innerRadius(radius - 100)
    //             .outerRadius(radius - 50);

    // var svg = d3.select("#container")
    //             .append("svg")
    //             .attr("width", width)
    //             .attr("height", height)
    //             .append("g")
    //             .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // // A function that create / update the plot for a given dataset
    // const pieChart = data => {

    //     var pie = d3.pie()
    //             .value(function(d) {return d; })
    //             .sort(function(a, b) {
    //                 return d3.ascending(a, b);
    //                 } ) // This make sure that group order remains the same in the pie chart
  
    //     var data_ready = pie(data)

    //     var update = svg.selectAll("path")
    //                         .data(data_ready); 

    //     update.enter()
    //             .append("path")
    //             .merge(update)
    //             .transition()
    //             .duration(5000)
    //             .attr("d", arc)
    //             .attr("fill", function(d, i) { 
    //                 return color(i); 
    //             });

    //     update.exit()
    //             .remove()
    // };
});
