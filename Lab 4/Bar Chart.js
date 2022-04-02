transferPicks.then(function(data) {
    
    //https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
    const unique = [...new Set(data.map(item => item.Position))];

    // const colorScale = d3.scaleOrdinal()
    //                         .domain(unique.map(function(d){
    //                             return d;
    //                         }))
    //                         .range(d3.schemeCategory10);

    unique.forEach(function(d) {
        var positionData = data.filter(function(e) {
            return e.Position === d
        })


        const top4 = getTopValues(filterData(positionData),4)
        barChart(top4, d);
    })
});

function filterData(data) {
    var barData = [];

    data.forEach(function(d) {

        var FDIndex = parseFloat(d["FD Index"]) || 0;

        // var position = d["Position"]

        var lName = d["Last Name"]
        var fName = d["Name"]

        barData.push({fName: fName, lName: lName, FDIndex: FDIndex});
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

function barChart(data, position) {

    const bheight = parseInt(d3.select('#BarChart').style('height'))
    const bwidth = parseInt(d3.select('#BarChart').style('width'))
    
    const bsvg = d3.select("#BarChart")
                .append("svg")
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
                    return d[1].fName + " " + d[1].lName;
                }))
                .padding(0.1);


    // append the rectangles for the bar chart
    const bars = bsvg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")

    bars.attr("y", function(d) { return y(d[1].fName + " " + d[1].lName) + 10; })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function(d) { return x(d[1]['FDIndex']); })
        .attr("fill", "red")
    
    // https://riptutorial.com/d3-js/example/17339/correctly-appending-an-svg-element
    const labels = bsvg.selectAll(".myTexts")
                    .data(data)
                    .enter()
                    .append("text");   

    labels.attr("x", function(d) { return x(d[1]['FDIndex']) - 5; })
            .attr("y", function(d) {return y(d[1].fName + " " + d[1].lName) + 27;})
            .text(function(d) {return d[1].fName + " " + d[1].lName + " " + d[1]['FDIndex']})
            .attr("fill", "white")
            .attr("text-anchor","end")
            .attr("font-size", 11);

    // text label for the y axis
    bsvg.append("text")
        .attr("y", -4)
        .attr("x",0)
        .attr("dy", "1em")
        .text(position);  
}

