const height = parseInt(d3.select('#scatterPlot').style('height'))
const width = parseInt(d3.select('#scatterPlot').style('width'))

const margin = {top: 10, right: 130, bottom: 78, left: 80};

const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

// Add X axis
var x = d3.scaleLinear()
            .rangeRound([0, width/1.2]);

// Add Y axis
var y = d3.scaleLinear()
            .range([height / 1.2, 0]);

svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("opacity", "0");

svg.append("g")
    .attr("class", "myYaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("opacity", "0");

var xLabel = svg.append("text")             
                .attr("transform",
                    `translate(${width / 2 - 100},${height - margin.top - 10})`)
                .style("text-anchor", "middle");

var yLabel = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 10 - margin.left)
                .attr("x",0 - (height / 2 - 30))
                .attr("dy", "1em")
                .style("text-anchor", "middle");

var scatterData = [];

var xData, yData;

function scatterPlot(data) {

    data.forEach(function(d) {

        var ictCost = d.ICT / d.Cost;

        scatterData.push({ictCost: ictCost, totalPoints: d["Total Points"], position: d.Position, name: d.Name});
    });


    x.domain([0, d3.max(scatterData, function(d)  {
            return d.ictCost; 
        })])
        .nice();

    y.domain([0, d3.max(scatterData, function(d) {
            return d.totalPoints;
        })])
        .nice();

    svg.append("g")
        .attr("class","colorLegend")
        .attr("transform",`translate(${width - margin.right},${margin.bottom - 40})`)

    svg.select(".myXaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));

    // text label for the x axis
    // https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e

    xLabel.text("ICT per Cost");

    svg.select(".myYaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisLeft(y));

      // text label for the y axis

    yLabel.text("Total Points");  

    dots(scatterData)

    var colorLegend = d3.legendColor()
                        .labelOffset(5)
                        .scale(colorScale)
                        .shape('circle')  
                        .labels(["GK", "MID", "FWD", "DEF"]);

    svg.select(".colorLegend")
        .call(colorLegend)            
            
}

// Add dots
// Have to create a variable so that the transition and mouse events are separated
// https://stackoverflow.com/questions/22645162/d3-when-i-add-a-transition-my-mouseover-stops-working-why
function dots(data) {

    var xKey = Object.keys(data[0])[0]
    var yKey = Object.keys(data[0])[1]

    var dots = svg.selectAll("dot")
                    .data(data)
                    .join(
                        function(enter) {
                            return enter
                                .append('circle')
                                .attr("id", function (d) { return d.name})
                                .attr("cx", function (d) { return x(d[xKey]); } )
                                .attr("cy", function (d) { return y(d[yKey]); } )
                                .style("fill", function (d) { return colorScale(d.position)})
                                .style('opacity', 0);
                        },
                        function(update) {
                            return update;
                        },
                        function(exit) {
                            return exit
                                .transition()
                                .duration(1000)
                                .attr('cy', 500)
                                .remove();
                        }
                    )
                    .transition()
                    .delay(function(d,i) {
                        return(i*3)
                    })
                    .duration(2000)
                    // .attr('cx', function(d) {
                    //     return d;
                    // })
                    .attr("r", 2.5)
                    .style('opacity', 0.75);
    
    //dots.exit().remove();

    // dots.enter()
    //     .append("circle")
    //     .attr("id", function (d) { return d.name})
    //     .attr("cx", function (d) { return x(d[xKey]); } )
    //     .attr("cy", function (d) { return y(d[yKey]); } )
    //     .style("fill", function (d) { return colorScale(d.position)})
    //     .merge(dots)
    //     .transition()
    //     .delay(function(d,i) {
    //                 return(i*3)
    //             })
    //     .duration(2000)
    //     .attr("r", 2.5)
    //     .style("opacity", 0.8);

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#scatterPlot")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    // // https://bl.ocks.org/d3noob/97e51c5be17291f79a27705cef827da2
    // dots.on("mouseover", function(event,d) {
    //         tooltip.transition()
    //           .duration(200)
    //           .style("opacity", .8)

    //         tooltip.html("Player: " + d.name + "<br>"  + "Total Points: " + d.totalPoints + "<br>" + "ICT per cost: " + d.ictCost.toFixed(2))
    //           .style("left", (event.x) + "px")
    //           .style("top", (event.y -50) + "px")
    //           .style("background", colorScale(d.position));
    //         })
    //         .on("mouseout", function(d) {
    //             tooltip.transition()
    //               .duration(500)
    //               .style("opacity", 0);
    //             })
    //         .on('click', function(event, d) {
    //             statTable(d);
    //             hoverDotSelection(d)
    //         });
}

function setXAxis(selection){
    xData = selection;

    if (xData != undefined && yData !=undefined) {
        populateAxis();
    }
}

function setYAxis(selection){
    yData = selection;

    if (xData != undefined && yData !=undefined) {
        populateAxis();
    }
}

function populateAxis() {

    scatterData = []

    fplData.forEach(function(d) {
        scatterData.push({[xData]: d[xData], [yData]: d[yData], position: d.Position, name: d.Name});
    });

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
    
    xLabel.text(Object.keys(scatterData[0])[0])
    yLabel.text(Object.keys(scatterData[0])[1])

    dots(scatterData);

}


// https://observablehq.com/@bumbeishvili/pulse
function hoverDotSelection (event) {

    var player;
    
    if (event.length != undefined) {
        player = event[1].fname + " " + event[1].lname
    } else {
        player = event.fname + " " + event.lname
    }
    
    var element = document.getElementById(player);
    var circle = d3.select(element);
    
    pulse(circle);

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
