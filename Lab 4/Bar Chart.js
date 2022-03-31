const bheight = parseInt(d3.select('#GKBar').style('height'))
const bwidth = parseInt(d3.select('#GKBar').style('width'))

const bmargin = {top: 10, right: 130, bottom: 78, left: 80};

const bsvg = d3.select("#GKBar")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

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


    console.log(top4)

    var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scaleOrdinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });
});