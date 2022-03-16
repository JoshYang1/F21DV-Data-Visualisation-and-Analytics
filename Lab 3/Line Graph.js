// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

function loadLineGraph(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return new Date(d[0]); }))
    .range([ 0, width/1.2 ]);
  svg.append("g")
    .attr("transform", `translate(0, 220)`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");


  // var selection = document.getElementById("globeTitle").textContent;
  // if (selection.includes("Deaths")) {



  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d[1]['total_deaths']; })])
    .range([ height/2, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(10))
    .attr("transform", `translate(0, 0)`);

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(data)
      .join("path")
        .attr("fill", "none")
        //.attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(+d[1]['total_deaths']); })
            (d[1])
        })
            // // Draw the map
            // svg.append("g")
            //     .selectAll("path")
            //     .data(lineData)
            //     .join('path')
            //     .attr("fill", "#69b3a2")
            //     .attr("d", d3.geoPath()
            //     .projection(projection)
            //     )
            //     .attr("fill", function (d) {
            //         d.total = deaths.get(d.properties.name) || 0;
            //         console.log(colorScale(d.total))
            //         return colorScale(d.total);
            //         })
            //     .style("opacity", .7)
            //     .style("stroke", "#fff")

                  }
          