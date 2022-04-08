// Filter the data based on the dropdown selection
function positionPick(position) {

    var positionData = transferPickData.filter(function(e) {
        return e.Position === position
    });

    // Get the top 10 values
    const top = getTopValues(positionData,10);
    // Populate the bar Chart
    barChart(top);
};

// Create bar chart visual 
function barChart(data) {

    // Select div element
    const div = d3.select('#BarChart');
    
    // Remove the current SVG so new SVG can be entered
    //https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    div.select("svg").remove();

    // Height and width taken from the div element
    const bheight = parseInt(d3.select('#BarChart').style('height'));
    const bwidth = parseInt(d3.select('#BarChart').style('width'));
    
    // Appending svg 
    const bsvg = div.append("svg")
                    .attr("width", bwidth)
                    .attr("height", bheight);

    // Setting x axis
    var x = d3.scaleLinear()
                .range([0, bwidth])
                .domain([0, d3.max(data, function (d) {
                    return d[1]['FDIndex'];
                })]);
    
    // Setting y axis
    var y = d3.scaleBand()
                .rangeRound([0, bheight - 10])
                .domain(data.map(function (d) {
                    return d[1].Name;
                }))
                .padding(0.1);

    // append the rectangles for the bar chart
    const bars = bsvg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect");

    // Setting the attributes and mouse events of the bars
    bars.attr("y", function(d) { return y(d[1].Name) + 10; })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function(d) { return x(d[1]['FDIndex']); })
        .attr("fill", "red")
        .on('mouseover', function() {
            d3.select(this)
                .attr('fill', 'orange');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "red");
        })
        .on('click', function(event, d) {
            d3.select(this)
                .attr("fill", "purple");
                // Hover the selection in the scatter graph
                hoverDotSelection(d[1].Name);
                // Display the player selected's stats
                statTable(d[1].Name);
        });

    // Adding labels to the bars
    // https://riptutorial.com/d3-js/example/17339/correctly-appending-an-svg-element
    const labels = bsvg.selectAll(".myTexts")
                    .data(data)
                    .enter()
                    .append("text");   

    labels.attr("x", function(d) { return x(d[1]['FDIndex']) - 5; })
            .attr("y", function(d) {return y(d[1].Name) + 27;})
            .text(function(d) {return d[1].Name + " " + d[1]['FDIndex']})
            .attr("fill", "white")
            .attr("text-anchor","end")
            .attr("font-size", 11);
}