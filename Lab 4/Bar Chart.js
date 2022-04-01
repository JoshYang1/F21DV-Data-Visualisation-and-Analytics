const bheight = parseInt(d3.select('#GKBar').style('height'))
const bwidth = parseInt(d3.select('#GKBar').style('width'))

const bmargin = {top: 10, right: 130, bottom: 78, left: 80};

const bsvg = d3.select("#GKBar")
                .append("svg")
                .attr("width", bwidth)
                .attr("height", bheight)
                .append("g")
                .attr("transform", `translate(${0},${0})`);

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
                .rangeRound([bheight, 0])
                .domain(top4.map(function (d) {
                    return d[1].fName + " " + d[1].lName;
                }))
                .padding(0.1);

    console.log(x.domain())
    console.log(top4)
    
    // append the rectangles for the bar chart
    bsvg.selectAll(".bar")
            .data(top4)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", function(d) { return y(d[1].fName + " " + d[1].lName); })
            .attr("height", y.bandwidth())
            .attr("x", function(d) {return x(d[1]['FDIndex']); })
            .attr("width", function(d) { return width - d[1]['FDIndex']; });

    // add the x Axis
    bsvg.append("g")
        .attr("transform", "translate(0," + bheight + ")")
        .call(d3.axisBottom(x));

// add the y Axis
    bsvg.append("g")
        .call(d3.axisLeft(y));
        // //make y axis to show bar names
        // var yAxis = d3.svg.axis()
        //     .scale(y)
        //     //no tick marks
        //     .tickSize(0)
        //     .orient("left");



        // //add a value label to the right of each bar
        // bars.append("text")
        //     .attr("class", "label")
        //     //y position of the label is halfway down the bar
        //     .attr("y", function (d) {
        //         return y(d.name) + y.rangeBand() / 2 + 4;
        //     })
        //     //x position is 3 pixels to the right of the bar
        //     .attr("x", function (d) {
        //         return x(d.value) + 3;
        //     })
        //     .text(function (d) {
        //         return d.value;
        //     });
});