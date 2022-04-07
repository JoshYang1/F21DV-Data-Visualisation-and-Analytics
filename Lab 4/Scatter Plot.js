// Height and width of div element
const height = parseInt(d3.select('#scatterPlot').style('height'));
const width = parseInt(d3.select('#scatterPlot').style('width'));

const margin = {top: 10, right: 130, bottom: 78, left: 80};

// Selecting div element and appending svg and g elements
const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

// Add X axis and define range
var x = d3.scaleLinear()
            .rangeRound([0, width/1.2]);

// Add Y axis and define range
var y = d3.scaleLinear()
            .range([height / 1.2, 0]);

// Appending g element to svg for the X axis
svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("opacity", "0");

// Appending g element to svg for the Y axis
svg.append("g")
    .attr("class", "myYaxis")   // Note that here we give a class to the Y axis, to be able to call it later and modify it
    .attr("opacity", "0");

// Creating X axis label
// https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
var xLabel = svg.append("text")             
                .attr("transform",
                    `translate(${width / 2 - 100},${height - margin.top - 10})`)
                .style("text-anchor", "middle");

// Creating Y axis label
var yLabel = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10 - margin.left)
                .attr("x",0 - (height / 2 - 30))
                .attr("dy", "1em")
                .style("text-anchor", "middle");

// Add a tooltip div.
// Its opacity is set to 0: we don't see it by default.
const tooltip = d3.select("#scatterPlot")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)

// Creating empty array for the data to be contained in
var scatterData = [];

// Creating variables for the x and y axis data keys
var xData, yData, xKey, yKey, dots;

// Creating the initial scatter plot with the data provided
function scatterPlot(data) {

    // Iterate through the data to filter the data for the required and push to array
    data.forEach(function(d) {

        var ictCost = d.ICT / d.Cost;

        scatterData.push({"ICT per cost": ictCost, "Total Points": d["Total Points"], position: d.Position, name: d.Name});
    });
    
    // Setting the keys of the dataset to be used by the tooltip div
    xKey = Object.keys(scatterData[0])[0];
    yKey = Object.keys(scatterData[0])[1];

    // Setting the domain of the X axis
    x.domain([0, d3.max(scatterData, function(d)  {
            return d["ICT per cost"]; 
        })])
        .nice();
    
    // Setting the domain of the Y axis
    y.domain([0, d3.max(scatterData, function(d) {
            return d["Total Points"];
        })])
        .nice();

    // Creating a legend
    svg.append("g")
        .attr("class","colorLegend")
        .attr("transform",`translate(${width - margin.right},${margin.bottom - 40})`);
    
    // Calling the X axis
    svg.select(".myXaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));

    // Setting the text of the X axis label
    xLabel.text("ICT per Cost");
    
    // Calling the Y axis
    svg.select(".myYaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisLeft(y));

    // Setting the text of the Y axis label
    yLabel.text("Total Points");  

    // Have to create a variable so that the transition and mouse events are separated
    // https://stackoverflow.com/questions/22645162/d3-when-i-add-a-transition-my-mouseover-stops-working-why
    dots = svg.selectAll("dot")
                    .data(scatterData)
                    .enter()
                    .append("circle")
                    .attr("id", function (d) { return d.name}) // Setting ID of each circle to the player's name so it can referenced later
                    .attr("cx", function (d) { return x(d["ICT per cost"]); } )
                    .attr("cy", function (d) { return y(d["Total Points"]); } )
                    .style("fill", function (d) { return colorScale(d.position)})
    
    // Displaying the data points    
    dots.transition()
        .delay(function(d,i) {
                    return(i*3)
                })
        .duration(2000)
        .attr("r", 2.5)
        .style("opacity", 0.8);
    
    // Calling the dot events function
    dotEvents();

    // Creating the legend
    var colorLegend = d3.legendColor()
                        .labelOffset(5)
                        .scale(colorScale)
                        .shape('ellipse')  
                        .labels(["GK", "MID", "FWD", "DEF"]);
    
    // Calling the legend to the SVG
    svg.select(".colorLegend")
        .call(colorLegend)            
}

// Function called when dropdown selection made
function setXAxis(selection){
    // Set global variable
    xData = selection;

    // If both axis selections have been made then change the data of the chart
    if (xData != undefined && yData !=undefined) {
        populateAxis();
    }
}

function setYAxis(selection){
    // Set global variable
    yData = selection;

    // If both axis selections have been made then change the data of the chart
    if (xData != undefined && yData !=undefined) {
        populateAxis();
    }
}

// Function to change the data of the graph
function populateAxis() {

    // Empty the global variable
    scatterData = []

    // Filter the data based on the requested fields
    fplData.forEach(function(d) {
        scatterData.push({[xData]: d[xData], [yData]: d[yData], position: d.Position, name: d.Name});
    });

    // Setting the variables based on the new keys
    xKey = Object.keys(scatterData[0])[0];
    yKey = Object.keys(scatterData[0])[1];

    // Changing the axis domains and calling 
    x.domain([0, d3.max(scatterData, function(d)  {
            return d[xData]; 
        })])
        .nice();

    y.domain([0, d3.max(scatterData, function(d) {
            return d[yData];
        })])
        .nice();

    svg.selectAll(".myXaxis")
        .transition()
        .duration(2000)
        .call(d3.axisBottom(x));

    svg.selectAll(".myYaxis")
        .transition()
        .duration(2000)
        .call(d3.axisLeft(y));
    
    // Setting the axis labels based on the new fields
    xLabel.text(xKey)
    yLabel.text(yKey)

    // http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
    svg.selectAll("circle")
        .data(scatterData)  // Update with new data
        .transition()  // Transition from old to new
        .duration(1000)  // Length of animation
        .delay(function(d, i) {
            return i;  // Dynamic delay (i.e. each item delays a little longer)
        })
        .attr("cx", function (d) { return x(d[xData]); } )
        .attr("cy", function (d) { return y(d[yData]); } )
}

// Various events for interaction with the data points
function dotEvents() {

    // Setting the event action for each data point
    // https://bl.ocks.org/d3noob/97e51c5be17291f79a27705cef827da2
    dots.on("mouseover", function(event,d) {
        tooltip.transition()
                .duration(200)
                .style("opacity", .8)
        // Display information on the hovered data point
        tooltip.html("Player: " + d.name + "<br>"  + yKey + ": " + d[yKey] + "<br>" + xKey +": " + d[xKey] )
                .style("left", (event.x) + "px")
                .style("top", (event.y) + "px")
                .style("background", colorScale(d.position));
        })
        .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
            })
        // If a user wishes to select a player to investigate it will display the stats table viz
        .on('click', function(event, d) {
            statTable(d.name);
            hoverDotSelection(d.name)
        });
}

// Data point will pulse on click
// https://observablehq.com/@bumbeishvili/pulse
function hoverDotSelection (player) {

    // Getting the circle ID with the player's name
    var element = document.getElementById(player);
    var circle = d3.select(element);
    
    pulse(circle);

    // Pulse function will repeat
    function pulse(circle) {
          (function repeat() {
             circle
              .transition()
              .duration(500)
              .attr("r", 10)
              .transition()
              .duration(500)
              .attr("r", 5)
              .transition()
              .duration(1000)
              .ease(d3.easeSin)
              .on("end", repeat);
          })();
    }
}
