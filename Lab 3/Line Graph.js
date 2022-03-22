// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

function loadLineGraph(data) {

  var parseTime = d3.timeParse("%Y-%m-%d");
  formatDate = d3.timeFormat("%Y-%m-%d"),
  bisectDate = d3.bisector(d => d.date).left,
  formatValue = d3.format(",.0f");

  const lineData = [];

  if (selection === "deaths") {
    data.forEach(function(d) {
      var dt = parseTime(d.date);
      var v = parseInt(d['total_deaths']) || 0
      lineData.push({date: dt, value: v});
    })
  } else if (selection === "cases") {
    data.forEach(function(d) {
      var dt = parseTime(d.date);
      var v = parseInt(d['total_cases']) || 0
      lineData.push({date: dt, value: v});
    })
  }

    // Add X axis --> it is a date format
  const x = d3.scaleTime()
              .rangeRound([0, width/1.2])
              .domain(d3.extent(lineData, function(d) {
                return d.date; 
              }))

    // Add Y axis
  const y = d3.scaleLinear()
              .rangeRound([ height/2, 0 ])
              .domain([0, d3.max(lineData, function(d) { 
                return d.value; 
              })])
              .nice();

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, 220)`)

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(0, 0)`);
    
  var line = d3.line()
    .curve(d3.curveCardinal)
    .x(d => x(d.date))
    .y(d => y(d.value));

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

  var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr("x", margin.left)
		.attr("width", width - margin.right - margin.left)
		.attr("height", height)

  svg.selectAll(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

  svg.selectAll(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left))

  var country = svg.selectAll(".country")
                    .data([lineData]);

	country.exit().remove();

  country.enter().insert("g", ".focus").append("path")
          .attr("class", "line country")
          .style("stroke", "red")
          .merge(country)
          .transition().duration(1000)
          .attr("d", d=> line(d));

//	tooltip(lineData);

// function tooltip (data) {

//   var labels = focus.selectAll(".lineHoverText")
//                     .data([data])

//   labels.enter().append("text")
//     .attr("class", "lineHoverText")
//     // .style("fill", "black")
//     .attr("text-anchor", "start")
//     .attr("font-size",12)
//     .attr("dy", (_, i) => 1 + i * 2 + "em")
//     .merge(labels);

//   var circles = focus.selectAll(".hoverCircle")
//     .data([data])

//   circles.enter().append("circle")
//     .attr("class", "hoverCircle")
//     // .style("fill", d => z(d))
//     .attr("r", 2.5)
//     .merge(circles);

//   svg.selectAll(".overlay")
//     .on("mouseover", function() { focus.style("display", null); })
//     .on("mouseout", function() { focus.style("display", "none"); })
//     .on("mousemove", e => lineMouseMove(d3.pointer(e)));
// }

// function lineMouseMove(event) {

//   console.log(d3.pointer(this))
//   const mouseover = (event, d) => {
//     tooltip.style("opacity", 1);
//   };

//   var x0 = x.invert(d3.pointer(this)[0]),
//     i = bisectDate(data, x0, 1),
//     d0 = data[i - 1],
//     d1 = data[i],
//     d = x0 - d0.date > d1.date - x0 ? d1 : d0;

//   focus.select(".lineHover")
//     .attr("transform", "translate(" + x(d.date) + "," + height + ")");

//   focus.select(".lineHoverDate")
//     .attr("transform", 
//       "translate(" + x(d.date) + "," + (height + margin.bottom) + ")")
//     .text(formatDate(d.date));

//   focus.selectAll(".hoverCircle")
//     .attr("cy", e => y(d[e]))
//     .attr("cx", x(d.date));

//   focus.selectAll(".lineHoverText")
//     .attr("transform", 
//       "translate(" + (x(d.date)) + "," + height / 2.5 + ")")
//     .text(e => e + " " + "º" + formatValue(d[e]));

//   x(d.date) > (width - width / 4) 
//     ? focus.selectAll("text.lineHoverText")
//       .attr("text-anchor", "end")
//       .attr("dx", -10)
//     : focus.selectAll("text.lineHoverText")
//       .attr("text-anchor", "start")
//       .attr("dx", 10)
// }
}
          