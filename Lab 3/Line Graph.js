// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
              .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

function loadLineGraph(data) {
  console.log(data)

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(lineData, function(d) { return +d.n; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
      .data(lineData)
      .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d[1])
        })
            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(lineData)
                .join('path')
                .attr("fill", "#69b3a2")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .attr("fill", function (d) {
                    d.total = deaths.get(d.properties.name) || 0;
                    console.log(colorScale(d.total))
                    return colorScale(d.total);
                    })
                .style("opacity", .7)
                .style("stroke", "#fff")

                  }