var transferPickData = {};

transferPicks.then(function(data) {
    transferPickData = data;
    const top4 = getTopValues(filterData(data),10)
    barChart(top4);
});

function positionPick(position) {

    var positionData = transferPickData.filter(function(e) {
        return e.Position === position
    })

    const top4 = getTopValues(filterData(positionData),10)
    barChart(top4);
}

function filterData(data) {
    var barData = [];

    data.forEach(function(d) {

        var FDIndex = parseFloat(d["FD Index"]) || 0;
        var lname = d["Last Name"]
        var fname = d["Name"]

        barData.push({fname: fname, lname: lname, FDIndex: FDIndex});
    })
    return barData;
}

//https://stackoverflow.com/questions/60105631/top-highest-values-in-an-object-more-if-there-are-more-max-values-and-they-are
function getTopValues(obj, topN) {

    var sortedEntries = Object.entries(obj).sort(function(a,b){
        return b[1]['FDIndex'] - a[1]['FDIndex']
    });

    // Find nth maximum value
    var maxN = parseInt(sortedEntries[topN - 1][0]);

    var result = sortedEntries.filter(function(entry){
        return entry[0] <= maxN;
    });
    return result;
}

function barChart(data) {

    const div = d3.select('#BarChart')
    
    //https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    div.select("svg").remove();

    const bheight = parseInt(d3.select('#BarChart').style('height'))
    const bwidth = parseInt(d3.select('#BarChart').style('width'))
    
    const bsvg = div.append("svg")
                    .attr("width", bwidth)
                    .attr("height", bheight)

    var x = d3.scaleLinear()
                .range([0, bwidth])
                .domain([0, d3.max(data, function (d) {
                    return d[1]['FDIndex'];
                })]);

    var y = d3.scaleBand()
                .rangeRound([0, bheight - 10])
                .domain(data.map(function (d) {
                    return d[1].fname + " " + d[1].lname;
                }))
                .padding(0.1);


    // append the rectangles for the bar chart
    const bars = bsvg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")

    bars.attr("y", function(d) { return y(d[1].fname + " " + d[1].lname) + 10; })
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
            
                hoverDotSelection(d);
                statTable(d);
        });
    
    // https://riptutorial.com/d3-js/example/17339/correctly-appending-an-svg-element
    const labels = bsvg.selectAll(".myTexts")
                    .data(data)
                    .enter()
                    .append("text");   

    labels.attr("x", function(d) { return x(d[1]['FDIndex']) - 5; })
            .attr("y", function(d) {return y(d[1].fname + " " + d[1].lname) + 27;})
            .text(function(d) {return d[1].fname + " " + d[1].lname + " " + d[1]['FDIndex']})
            .attr("fill", "white")
            .attr("text-anchor","end")
            .attr("font-size", 11);

    // // text label for the y axis
    // bsvg.append("text")
    //     .attr("y", -4)
    //     .attr("x",0)
    //     .attr("dy", "1em")
    //     .text(position);  
}