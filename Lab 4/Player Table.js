// Stats table using the HTML table element
function statTable (player) {

    // Filter data for the player given
    var result = fplData.filter(function(entry){
        return entry.Name === player
    });

    // Select viz and append table
    const divTable = d3.select("#playerTable")
    
    // Remove current table
    divTable.select("table").remove()
    
    // Append new table
    const table = divTable.append("table");

    // Append body to table
    const tablebody = table.append("tbody");

    // Append rows based on data
    const rows = tablebody.selectAll('tr')
                            .data(Object.entries(result[0]))
                            .enter()
                            .append('tr')
    
    // Populate rows with data
    const cells = rows.selectAll("td")
                        .data(d => d)
                        .enter()
                        .append("td")
                        .text(d => d)
}