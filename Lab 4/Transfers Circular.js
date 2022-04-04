var topTransferData = {};

transfersIN.then(function(data) {
    topTransferData = data;
    circular(transferFilter(data, "Transfers In"))
});

function transferPick(selection) {

}

function transferFilter(data, column) {

    var circleData = [];

    data.forEach(function(d) {

        var count = parseInt(d[column]) || 0;

        var position = d.Position

        var fname = d["Name"]
        var lname = d["Last Name"]

        circleData.push({count: count, position: position, fname: fname, lname: lname});
    })

    return circleData;
}

function circular(data) {

    const div = d3.select('#transfersCircular')
    
    //https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    div.select("svg").remove();

    const theight = parseInt(d3.select('#transfersCircular').style('height'));
    const twidth = parseInt(d3.select('#transfersCircular').style('width'));

    // append the svg object
    const svg = div.append("svg")
                    .attr("width", twidth)
                    .attr("height", theight - parseInt(d3.select('#buttonContainer').style('height')))

  // Size scale for countries
  const size = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) {
                        return d.count;
                    })])
                    .range([3,50])  // circle will be between 7 and 55 px wide

    const Tooltip = d3.select("#transfersCircular")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
        Tooltip
        .style("opacity", 1)
    }
    const mousemove = function(event, d) {
        Tooltip
        .html('<u>' + d.fname + " " + d.lname + '</u>' + "<br>" + d.count + " transfers")
        .style("left", (event.x/2-100) + "px")
        .style("top", (event.y/2-30) + "px")
    }
    var mouseleave = function(event, d) {
        Tooltip
        .style("opacity", 0)
    }

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
                .selectAll("circle")
                .data(data)
                .join("circle")
                    .attr("class", "node")
                    .attr("r", d => size(d.count))
                    .attr("cx", twidth / 2)
                    .attr("cy", theight / 2)
                    .style("fill", d => colorScale(d.position))
                    .style("fill-opacity", 0.8)
                    .attr("stroke", "black")
                    .style("stroke-width", 1)
                    .on("mouseover", mouseover) // What to do when hovered
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
                    .call(d3.drag() // call specific function when circle is dragged
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

    // Features of the forces applied to the nodes:
  const simulation = d3.forceSimulation()
                        .force("center", d3.forceCenter()
                                            .x(twidth / 2)
                                            .y(theight / 2)) // Attraction to the center of the svg area
                        .force("charge", d3.forceManyBody()
                                            .strength(.1)) // Nodes are attracted one each other of value is > 0
                        .force("collide", d3.forceCollide()
                                            .strength(.2)
                                            .radius(function(d){ 
                                                return (size(d.count)+3) })
                                            .iterations(1)) // Force that avoids circle overlapping
                
     // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation.nodes(data)
            .on("tick", function(d){
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
        }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
        }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
        }

}

