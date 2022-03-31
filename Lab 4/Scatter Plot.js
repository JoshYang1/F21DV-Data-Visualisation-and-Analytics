const height = parseInt(d3.select('#scatterPlot').style('height'))
const width = parseInt(d3.select('#scatterPlot').style('width'))

const margin = {top: 10, right: 10, bottom: 40, left: 50};

const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

fplData.then(function(data) {

    const scatterData = [];

    console.log(data)
    
    data.forEach(function(d) {
        var cost = (parseInt(d["Cost Today"]) / 10) || 0;
        var ict = parseFloat(d["ICT Index"]) || 0;
        var ictCost = ict / cost;

        var totalPoints = parseInt(d["Total Points"]) || 0;

        var position = parseInt(d["Position"])

        scatterData.push({totalPoints: totalPoints, ictCost: ictCost, position: position});
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
                .range([height / 1.1, 0])
                .nice();

    svg.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("opacity", "0")

    svg.append("g")
        .attr("class", "myYaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("opacity", "0")

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(scatterData)
        .enter()
        .append("circle")
        .transition()
        .delay(function(d,i) {
                return(i*3)
            })
        .duration(2000)
        .attr("cx", function (d) { return x(d.ictCost); } )
        .attr("cy", function (d) { return y(d.totalPoints); } )
        .attr("r", 2.5)
        .style("fill", function (d) {
            if (d.position === 1) {
                return "blue"
            } else if (d.position === 2) {
                return "red"
            } else if (d.position === 3) {
                return "green"
            } else if (d.position === 4) {
                return "#FF6EC7"
            }
        });

    svg.select(".myXaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));
    
    svg.select(".myYaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1")
        .call(d3.axisLeft(y));
})