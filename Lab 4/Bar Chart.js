const bheight = parseInt(d3.select('#GKBar').style('height'))
const bwidth = parseInt(d3.select('#GKBar').style('width'))

const bmargin = {top: 10, right: 130, bottom: 78, left: 80};

const bsvg = d3.select("#GKBar")
                .append("svg")
                .attr("width", bwidth)
                .attr("height", bheight)

transferPicks.then(function(data) {

    const barData = [];

    data.forEach(function(d) {

        var FDIndex = parseFloat(d["FD Index"]) || 0;

        // var position = d["Position"]

        var lName = d["Last Name"]
        var fName = d["Name"]

        barData.push({fName: fName, lName: lName, FDIndex: FDIndex});
    })

    const top4 = getTopValues(barData,4)

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

    var x = d3.scaleLinear()
                .range([0, bwidth])
                .domain([0, d3.max(top4, function (d) {
                    return d[1]['FDIndex'];
                })]);

    var y = d3.scaleBand()
                .rangeRound([0, bheight])
                .domain(top4.map(function (d) {
                    return d[1].fName + " " + d[1].lName;
                }))
                .padding(0.1);


    // append the rectangles for the bar chart
    const bars = bsvg.selectAll(".bar")
                    .data(top4)
                    .enter()
                    .append("rect")

    bars.attr("y", function(d) { return y(d[1].fName + " " + d[1].lName); })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function(d) { return x(d[1]['FDIndex']); })
        .attr("fill", "red")
    
    // https://riptutorial.com/d3-js/example/17339/correctly-appending-an-svg-element
    const labels = bsvg.selectAll(".myTexts")
                    .data(top4)
                    .enter()
                    .append("text");   

    labels.attr("x", function(d) { return x(d[1]['FDIndex']) - 5; })
            .attr("y", function(d) {return y(d[1].fName + " " + d[1].lName) + 18;})
            .text(function(d) {return d[1].fName + " " + d[1].lName + " " + d[1]['FDIndex']})
            .attr("fill", "white");

});