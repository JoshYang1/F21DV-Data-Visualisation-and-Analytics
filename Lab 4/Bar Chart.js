// Height and width taken from the div element
const bheight = parseInt(d3.select('#BarChart').style('height'));
const bwidth = parseInt(d3.select('#BarChart').style('width'));

// Select div element
const bsvg = d3.select('#BarChart')
                .append("svg")
                .attr("width", bwidth)
                .attr("height", bheight)
                .append("g")
                .attr("transform", `translate(${0},${0})`);;

// Setting x axis
var bx = d3.scaleLinear()
            .range([bwidth, 0]);
            
// Setting y axis
var by = d3.scaleBand()
            .rangeRound([0, bheight - 10]);

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

    // Set x domain
    bx.domain([0, d3.max(data, function (d) {
        return d[1]['FDIndex'];
    })]);

    // Set y domain
    by.domain(data.map(function (d) {
        return d[1].Name;
    }))
    .padding(0.1);

    // append the rectangles for the bar chart
    const bars = bsvg.selectAll("rect")
                    .data(data);

    bars.join(
        enter => enter.append("rect")
                        .transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .attr("y", function(d) { return by(d[1].Name) + 10; })
                        .attr("height", by.bandwidth())
                        .attr("fill", "red")
                        .attr("x", 0)
                        .attr("width", d => bwidth - bx(d[1]['FDIndex'])),
        update => update
                        .transition()
                        .duration(1000)
                        .attr("fill", "blue")
                        .attr("x", 0)
                        .attr("width", d => bwidth - bx(d[1]['FDIndex'])),  
        exit => exit.remove()
    ).on('mouseover', function() {
        d3.select(this)
            .attr('fill', 'orange')
            .attr("width", d => bwidth - bx(d[1]['FDIndex']));
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

    // Removing the labels
    bsvg.selectAll("text").remove()

    // Adding labels to the bars
    // https://riptutorial.com/d3-js/example/17339/correctly-appending-an-svg-element
    const labels = bsvg.selectAll(".myTexts")
                    .data(data)
                    .enter()
                    .append("text");   

    labels.transition()
            .delay(1500)
            .attr("x", function(d) { return bwidth - bx(d[1]['FDIndex']) - 15; })
            .attr("y", function(d) {return by(d[1].Name) + 29;})
            .text(function(d) {return d[1].Name + " " + d[1]['FDIndex']})
            .attr("fill", "white")
            .attr("text-anchor","end")
            .attr("font-size", 11);
}