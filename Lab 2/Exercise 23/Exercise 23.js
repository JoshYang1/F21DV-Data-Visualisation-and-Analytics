    const numPoints = 100;
    const sine = [];
    const cosine = [];

    // Creating datasets
    for (let i = 0; i < numPoints; i++) { sine.push( {x: i/100, y: Math.sin( 6.2 * i/100 ) } ); }
    for (let i = 0; i < numPoints; i++) { cosine.push( {x: i/100, y: Math.cos( 6.2 * i/100 ) } ); }

    // Append svg element to the Page
    const svg = d3.select("#container")
                    .append("svg")

    // Setting margins
    var margin = {top: 20, right: 70, bottom: 50, left: 20};

    // Requesting the dimensions of the container div element
    const xSize = d3.select('#container').node().getBoundingClientRect().width; 
    const ySize = d3.select('#container').node().getBoundingClientRect().width - 200;

    // Setting the the dimensions of the svg to fit the container
    svg.attr("width", xSize + margin.left + margin.right)
        .attr("height", ySize + margin.top + margin.bottom)
        .style('background-color', 'green')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // A function that create / update the plot for a given dataset
    const graph = data => {

        // Removing all the elements from the svg 
        // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
        svg.selectAll("*").remove();

        // Get the 'limits' of the data - the full extent (mins and max)
        // so the plotted data fits perfectly
        const xExtent = d3.extent( data, d=>{ return d.x } );
        const yExtent = d3.extent( data, d=>{ return d.y } );

        // Setting the scales
        const x = d3.scaleLinear()
                    .domain([ xExtent[0], xExtent[1] ])
                    .range([0, xSize]);

        var y = d3.scaleLinear()
            .domain([ yExtent[0], yExtent[1]])
            .range([ySize, 0]);

        // Appending top axis
        svg.append("g")
        .attr("transform", "translate(" + margin.bottom + ","+ (margin.top) + ")")
        .call(d3.axisTop(x));

        // Appending bottom axis
        svg.append("g")
        .attr("transform", "translate(" + margin.bottom + ","+ (ySize + margin.left) + ")")
        .call(d3.axisBottom(x));

        // Appending left axis
        svg.append("g")
        .attr("class", "myYaxis")
        .attr("transform", "translate(" + margin.bottom + ","+ margin.left +")")
        .call(d3.axisLeft(y));

        // Appending right axis
        svg.append("g")
        .attr("class", "myYaxis")
        .attr("transform", "translate(" + (ySize + 250) + ","+ margin.left +")")
        .call(d3.axisRight(y));

        // Selecting the first path
        var u = svg.select("path")
                    .datum(data)

        // Appending the line
        u.enter()
            .append("path")
            .merge(u)
            .transition()
            .duration(2000)
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("fill", "none")
            .attr("d", d3.line()
                            .x(function(d) { 
                                return x(d.x) 
                            })
                            .y(function(d) { 
                                return y(d.y) 
                            }));


        };
        
    // Initialize the plot with the first dataset
    graph(sine);
