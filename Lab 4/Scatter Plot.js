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
    
    
    data.forEach(function(d) {
        var cost = (parseInt(d["Cost Today"]) / 10) || 0;
        var ict = parseFloat(d["ICT Index"]) || 0;
        scatterData.push({cost: cost, ict: ict});
    })

    console.log(scatterData)

    // Add X axis
    var x = d3.scaleLinear()
                .rangeRound([0, width/1.2])
                .domain(d3.extent(scatterData, function(d) {
                return d.ict; 
                }))

                .domain([0, 0])
                .range([ 0, width]);

    svg.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", "translate(0,0)")
        .call(d3.axisBottom(x))
        .attr("opacity", "0")

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 500000])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data([scatterData])
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.ict); } )
        .attr("cy", function (d) { return y(d.cost); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")

    // new X axis
    x.domain([0, 4000])
    svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

    svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr("cx", function (d) { return x(d.ict); } )
    .attr("cy", function (d) { return y(d.cost); } )
})