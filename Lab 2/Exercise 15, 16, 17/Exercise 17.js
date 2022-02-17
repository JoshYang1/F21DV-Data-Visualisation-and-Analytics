    // Definining the filepath
    let dataFile = './Data.csv';

    // Append div element to the Page
    const svg = d3.select("#container")
                    .append("svg");

    // Requesting the dimensions of the container div element
    const xSize = d3.select('#container').node().getBoundingClientRect().width ; 
    const ySize = d3.select('#container').node().getBoundingClientRect().width ;

    // Setting margin
    var margin = 200;

    // Setting the the dimensions of the svg to fit the container
    svg.style("height", ySize)
                .style("width", xSize)
                .style('background-color', 'green');

    // Appending graph title to SVG
    svg.append("text")
        .attr("transform", "translate(10,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Stock Price");
    
    // Settiing scales
    var x = d3.scaleBand().range([0, ySize - margin]).padding(0.4);
    var y = d3.scaleLinear().range([xSize - margin, 0]);


    // Appending g element to SVG
    var g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Reading data
    d3.csv(dataFile).then(function(data) {

        // Colour scheme
        var myColor = d3.scaleSequential()
                        // Domain set from 0 to max value in the dataset
                        .domain([0,d3.max(data, function(d) { 
                            return d.value;
                            })])
                        .interpolator(d3.interpolatePuRd);

        // setting domain based on the data
        x.domain(data.map(function(d) { 
            return d.year; 
            }) );

        y.domain([0, d3.max(data, function(d) { 
            return d.value; 
            })]);
        
        // Appending X axis
        g.append("g")
            .attr("transform", "translate(0," + (ySize - margin) + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", 50)
            .attr("x", 300)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Year");
        
        // Appending Y axis
        g.append("g")
            .call(d3.axisLeft(y)
                    .tickFormat(function(d){
                        return "$" + d;
                    })
                    .ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",6)
            .attr("x", -270)
            .attr("dy", "-5.1em")
            .attr("stroke", "black")
            .text("Stock Price");
        
        // Creating bars based on the data
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            // Event handlers
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .attr("x", function(d) { 
                return x(d.year); 
                })
            .attr("y", function(d) { 
                return y(d.value); 
                })
            .attr("width", x.bandwidth())           
            .attr("fill",  d => myColor(d.value))
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function (d, i) {
                return i * 50;
                })
            .attr("height", function(d) { 
                return ySize - margin - y(d.value); 
                });
        
        // Function called when mouse hovers over bar
        function onMouseOver(d, i) {

            // Adds animation
            d3.select(this)
                .transition()
                .duration(400)
                .attr('width', x.bandwidth() + 5)
                .attr("y", function(d) { 
                    return y(d.value) - 10; 
                    })
                .attr("height", function(d) { 
                    return ySize - margin - y(d.value) + 10; 
                    });
            
            // https://stackoverflow.com/questions/67480486/d3-js-add-text-above-bar-chart-not-show
            // Appending a text element
            g.selectAll(".bar-title")
                .data(data)
                .enter()
                .append("text")
                .classed('bar-title', true)
                .attr('text-anchor', 'middle')
                .attr("x", d => x(d.year) + x.bandwidth()/2)
                .attr("y", d => y(d.value) - 15)
                .text(d => `$${d.value}`);
                };

        // Museout event handler function
        function onMouseOut(d, i) {
            // Adds animation
            d3.select(this)
                .transition()
                .duration(400)
                .attr('width', x.bandwidth())
                .attr("y", function(d) { 
                    return y(i.value); 
                    })
                .attr("height", function(d) { 
                    return ySize - margin - y(i.value); 
                    });
            
            // Remove the text label 
            d3.selectAll('.bar-title')
                .remove()

            };
    });