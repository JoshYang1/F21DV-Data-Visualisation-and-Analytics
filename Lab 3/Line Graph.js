// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

function loadLineGraph(data) {

  var parseTime = d3.timeParse("%Y-%m-%d");
  // formatDate = d3.timeFormat("%Y-%m-%d"),
  // bisectDate = d3.bisector(d => d.date).left,
  // formatValue = d3.format(",.0f");

  data.forEach(function(d) {
		d.date = parseTime(d.date);
    d['total_deaths'] = parseInt(d['total_deaths']) || 0
    return d;
	})




    // Add X axis --> it is a date format
  const x = d3.scaleTime()
              .rangeRound([0, width/1.2])
              .domain(d3.extent(data, function(d) {
                return d[1].date; 
              }))

    // Add Y axis
  const y = d3.scaleLinear()
              .rangeRound([ height/2, 0 ]);


  svg.append("g")
    .attr("transform", `translate(0, 220)`)
    .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%Y-%m")))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(0, 0)`);

  var focus = svg.append("g")
		.attr("class", "focus")
		.style("display", "none");

  focus.append("line")
    .attr("class", "lineHover")
		.style("stroke", "#999")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
		.style("opacity", 0.5)
		.attr("y1", -height)
		.attr("y2",0);

  focus.append("text").attr("class", "lineHoverDate")
		.attr("text-anchor", "middle")
		.attr("font-size", 12);

  // var overlay = svg.append("rect")
	// 	.attr("class", "overlay")
	// 	.attr("x", margin.left)
	// 	.attr("width", width - margin.right - margin.left)
	// 	.attr("height", height)


  // for (let key of data.keys()) {
  //   if (data.get(key)['total_deaths'] == NaN) {
      
  //   console.log(data.get(key)['total_deaths'])}
  //   }

  var line = d3.line()
  .curve(d3.curveCardinal)
  .x(d => x(d.date))
  .y(d => y(d["total_deaths"])
  );

  

  var country = svg.selectAll(".country")
                    .data(data);

  y.domain([0, d3.max(data, function(d) { 
    return d[1]['total_deaths']; 
  })])
      
                    
  country.enter().insert("g", ".focus").append("path")
  .attr("class", "line country")
  .style("stroke", "red")
  .merge(country)
  .transition().duration(1000)
  .attr("d", d => line(d));

		//country.exit().remove();

  if (selection === "deaths") {


  } else if (selection === "cases") {
    y.domain([0, d3.max(data, function(d) { 
                return d[1]['total_cases']; 
              })])
    .nice();
  }

  svg.selectAll(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left))



		//tooltip(copy);


  // var selection = document.getElementById("globeTitle").textContent;
  // if (selection.includes("Deaths")) {


  // color palette
  const color = d3.scaleOrdinal()
                  .range(d3.schemeCategory10)

  // // Draw the line
  // svg.selectAll(".line")
  //     .data(data)
  //     .join("path")
  //       .attr("fill", "none")
  //       .attr("stroke", "red")
  //       .attr("stroke-width", 1.5)
  //       .attr("d", function(d){
  //         return d3.line()
  //           .x(function(d) { return x(new Date(d[0])); })
  //           .y(function(d) { return y(+d[1]['total_deaths']); })
  //           (d[1])
  //       })
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
          