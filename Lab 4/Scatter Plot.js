const height = parseInt(d3.select('#scatterPlot').style('height'))
const width = parseInt(d3.select('#scatterPlot').style('width'))

const margin = {top: 10, right: 130, bottom: 78, left: 80};

const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

fplData.then(function(data) {

    const scatterData = [];

    data.forEach(function(d) {
        var cost = (parseInt(d["Cost Today"]) / 10) || 0;
        var ict = parseFloat(d["ICT Index"]) || 0;
        var ictCost = ict / cost;

        var totalPoints = parseInt(d["Total Points"]) || 0;

        var position = parseInt(d["Position"])

        var name = d["Last Name"]

        scatterData.push({totalPoints: totalPoints, ictCost: ictCost, position: position, name: name});
    })

    // Add X axis
    var x = d3.scaleLinear()
                .rangeRound([0, width/1.2])
                .domain([0, d3.max(scatterData, function(d)  {
                    return d.ictCost; 
                })])
                .nice();

    // Add Y axis
    var y = d3.scaleLinear()
                .domain([0, d3.max(scatterData, function(d) {
                    return d.totalPoints;
                })])
                .range([height / 1.2, 0])
                .nice();

    //https://stackoverflow.com/questions/30018106/set-domain-on-ordinal-scale-from-tsv-data
    const colorScale = d3.scaleOrdinal()
                            .domain(scatterData.map(function(d){
                                return d.position;
                            }))
                            .range(d3.schemeCategory10);

    svg.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("opacity", "0")

    svg.append("g")
        .attr("class", "myYaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("opacity", "0")

    svg.append("g")
        .attr("class","colorLegend")
        .attr("transform",`translate(${width - margin.right},${margin.bottom - 40})`)

    var colorLegend = d3.legendColor()
                            .labelOffset(5)
                            .scale(colorScale)
                            .shape('circle')  .labels(["GK", "MID", "FWD", "DEF"]);

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#scatterPlot")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    svg.select(".myXaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));

    // text label for the x axis
    // https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    svg.append("text")             
        .attr("transform",
            `translate(${width / 2 - 100},${height - margin.top - 10})`)
        .style("text-anchor", "middle")
        .text("ICT per Cost");

    svg.select(".myYaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisLeft(y));

      // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10 - margin.left)
        .attr("x",0 - (height / 2 - 30))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Points");  

    svg.select(".colorLegend")
        .call(colorLegend)

    // Add dots
    // Have to create a variable so that the transition and mouse events are separated
    // https://stackoverflow.com/questions/22645162/d3-when-i-add-a-transition-my-mouseover-stops-working-why
    var dots = svg.selectAll("dot")
        .data(scatterData)
        .enter()
        .append("circle")
        
        .attr("cx", function (d) { return x(d.ictCost); } )
        .attr("cy", function (d) { return y(d.totalPoints); } )
        .attr("r", 2.5)
        .style("opacity", 0)
        .style("fill", function (d) { return colorScale(d.position)})


    dots.transition()
        .delay(function(d,i) {
                return(i*3)
            })
        .duration(2000)
        .style("opacity", 0.8);
    
    // https://bl.ocks.org/d3noob/97e51c5be17291f79a27705cef827da2
    dots.on("mouseover", function(event,d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .8)

            tooltip.html("Player: " + d.name + "<br>"  + "Total Points: " + d.totalPoints + "<br>" + "ICT per cost: " + d.ictCost.toFixed(2))
              .style("left", (event.x) + "px")
              .style("top", (event.y -50) + "px")
              .style("background", colorScale(d.position));
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
                });


})
