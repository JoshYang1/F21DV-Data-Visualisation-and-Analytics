function statTable (player) {

    var result = fplData.filter(function(entry){
        return entry.Name === player
    });

    // select viz and append table
    const divTable = d3.select("#playerTable")
    
    divTable.select("table").remove()
    
    const table = divTable.append("table");

    const tablebody = table.append("tbody");

    const rows = tablebody.selectAll('tr')
                            .data(Object.entries(result[0]))
                            .enter()
                            .append('tr')

    const cells = rows.selectAll("td")
                        .data(d => d)
                        .enter()
                        .append("td")
                        .text(d => d)
}