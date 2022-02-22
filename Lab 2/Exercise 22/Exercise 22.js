    
    const colours = ["black", "blue", "yellow"];

    // create 3 data_set
    const data1 = [
    {group: "A", value: 5},
    {group: "B", value: 20},
    {group: "C", value: 9}
    ];

    const data2 = [
    {group: "A", value: 10},
    {group: "B", value: 2},
    {group: "C", value: 22},
    {group: "D", value: 22}
    ];

    const data3 = [
    {group: "A", value: 12},
    {group: "B", value: 9},
    {group: "C", value: 17},
    {group: "D", value: 3},
    {group: "E", value: 10}
    ];

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
    function update(data, colour) {

        // Removing all the elements from the svg 
        // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
        svg.selectAll("*").remove();

        // Setting scales
        var x = d3.scaleBand()
        .range([0, xSize])
        .domain(data.map(function(d) {
            return d.group
        }))
        .padding(0.4);

        var y = d3.scaleLinear()
            .domain([0,26])
            .range([ySize, 0]);

        // Appending bottom axis
        svg.append("g")
        .attr("transform", "translate(" + margin.bottom + ","+ (ySize + margin.left) + ")")
        .call(d3.axisBottom(x));

        // Appending left axis
        svg.append("g")
        .attr("class", "myYaxis")
        .attr("transform", "translate(" + margin.bottom + ","+ margin.left +")")
        .call(d3.axisLeft(y));

        // Appending top axis
        svg.append("g")
        .attr("transform", "translate(" + margin.bottom + ","+ margin.top + ")")
        .call(d3.axisTop(x));

        // Appending right axis
        svg.append("g")
        .attr("class", "myYaxis")
        .attr("transform", "translate(" + (ySize + 250) + ","+ margin.left +")")
        .call(d3.axisRight(y));

        var u = svg.selectAll("rect")
                    .data(data)

        u.enter()
            .append("rect")
            // https://stackoverflow.com/questions/34179006/d3-text-on-mouseover
            .on("mouseover", function(d, i){
                d3.select(this.parentNode)
                    .append("text")
                    .attr('text-anchor', 'middle')
                    .classed('bar-title', true)
                    .attr("x", d => x(i.group) + x.bandwidth()/2)
                    .attr("y", d => y(i.value) - 15)
                    .text(d => `${i.value}`)
            })
            .on("mouseout", function(){
                // Remove the text label 
                d3.selectAll('.bar-title')
                    .remove()
            })
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function(d) { 
                return x(d.group) + margin.bottom; 
                })
            .attr("y", function(d) { 
                return y(d.value) + margin.left; 
                })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { 
                return ySize - y(d.value); 
                })
            .attr("fill", colour);

        };
        
    // Initialize the plot with the first dataset
    update(data1, "red");
