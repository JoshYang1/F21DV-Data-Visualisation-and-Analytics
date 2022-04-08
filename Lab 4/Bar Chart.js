// Height and width taken from the div element
const bheight = parseInt(d3.select('#BarChart').style('height'));
const bwidth = parseInt(d3.select('#BarChart').style('width'));

// Select div element
const div = d3.select('#BarChart');

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

    // Remove current SVG
    div.select("svg").remove();

    // Appending svg 
    const bsvg = div.append("svg")
                    .attr("width", bwidth)
                    .attr("height", bheight);

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
    const bars = bsvg.selectAll(".bar")
                    .data(data)
                    .join("rect")
                    .attr("y", function(d) { return by(d[1].Name) + 10; })
                    .attr("height", by.bandwidth())
                    .attr("fill", "red")
                    .attr("x", d => bwidth - bx(0))
                    .attr("width", d => bx(0))

    // Select rectangles in SVG
    bsvg.selectAll("rect")
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x",0)
        .attr("width", function(d) { return bwidth - bx(d[1]['FDIndex']); })
    
    // Events on bar interaction
    bars.on('mouseover', function() {
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

    labels.attr("x", function(d) { return bwidth - bx(d[1]['FDIndex']) - 10; })
            .attr("y", function(d) {return by(d[1].Name) + 29;})
            .text(function(d) {return d[1].Name + " " + d[1]['FDIndex']})
            .attr("fill", "white")
            .attr("text-anchor","end")
            .attr("font-size", 11);
}