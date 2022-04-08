// Button interaction will feed data into graph
function transferPick(selection) {
    if (selection.includes("In")) {
        transferCircle(transfersIN)
    } else if (selection.includes("Out")) {
        transferCircle(transfersOut)
    }
};

// Create transfer circle graph
function transferCircle(data) {

    // Select div element
    const div = d3.select('#transfersCircular');
    
    // Remove current SVG
    //https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    div.select("svg").remove();

    // Height and width of the div element
    const theight = parseInt(d3.select('#transfersCircular').style('height'));
    const twidth = parseInt(d3.select('#transfersCircular').style('width'));

    // Append the svg object
    const svg = div.append("svg")
                    .attr("width", twidth)
                    .attr("height", theight - parseInt(d3.select('#buttonContainer').style('height'))); // Leave space for the buttons

    // Size scale for the count of transfers
    const size = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) {
                        return d.Count;
                    })])
                    .range([5,60])  // circle will be between 5 and 60 px wide
    
    // Create tooltip
    const Tooltip = d3.select("#transfersCircular")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px");

    // Four functions that change the tooltip when user hover / move / leave / click a cell
    const mouseover = function(event, d) {
        Tooltip
        .style("opacity", 1)
    }
    const mousemove = function(event, d) {
        Tooltip
        .html('<u>' + d.Name + '</u>' + "<br>" + d.Count + " transfers")
        .style("left", (event.x/2-100) + "px")
        .style("top", (event.y/2-30) + "px")
    }
    var mouseleave = function(event, d) {
        Tooltip
        .style("opacity", 0)
    }
    var mouseClick = function(event, d) {
        // Display stats table
        statTable(d.Name)
        // Hover the selected dot in scatter graph
        hoverDotSelection(d.Name)
    }

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
                .selectAll("circle")
                .data(data)
                .join("circle")
                    .attr("class", "node")
                    .attr("r", d => size(d.Count))
                    .attr("cx", twidth / 2)
                    .attr("cy", theight / 2)
                    .style("fill", d => colorScale(d.Position))
                    .style("fill-opacity", 0.8)
                    .attr("stroke", "black")
                    .style("stroke-width", 1)
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
                    .on("click", mouseClick)
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
                                                return (size(d.Count)+3) })
                                            .iterations(1)) // Force that avoids circle overlapping
                        .force("forceX", d3.forceX().strength(.15).x(twidth * 2))
                        .force("forceY", d3.forceY().strength(.15).y(theight * 2));
                
     // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation.nodes(data)
            .on("tick", function(d){
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });

    // What happens when a circle is dragged
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

