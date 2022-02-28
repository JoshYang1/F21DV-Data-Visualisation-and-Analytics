
    // importing the csv file
    // Need to add the specific .csv file to download
    // May need to create several variables for the different datasets
    let covid = 'https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations';

    // reading the csv file
    d3.csv(heartfailurecsv).then(function(data) {

    const apples = [5345, 2879, 1997, 2437, 4045],
        oranges = [1234, 912, 923, 8123, 3479];

    var width = 460,
        height = 300,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
                    .range(d3.schemeSet3);

    var arc = d3.arc()
                .innerRadius(radius - 100)
                .outerRadius(radius - 50);

    var svg = d3.select("#container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // A function that create / update the plot for a given dataset
    const pieChart = data => {

        var pie = d3.pie()
                .value(function(d) {return d; })
                .sort(function(a, b) {
                    return d3.ascending(a, b);
                    } ) // This make sure that group order remains the same in the pie chart
  
        var data_ready = pie(data)

        var update = svg.selectAll("path")
                            .data(data_ready); 

        update.enter()
                .append("path")
                .merge(update)
                .transition()
                .duration(5000)
                .attr("d", arc)
                .attr("fill", function(d, i) { 
                    return color(i); 
                });

        update.exit()
                .remove()
    };
});
