function statTable (event) {
    var player;

    if (event.length != undefined) {
        player = event[1]
    } else {
        player = event
    }
    
    fplData.then(function(data) {

        var result = data.filter(function(entry){
            return entry["Name"] + entry["Last Name"] === player.fname + player.lname
        });

        var stats = [];

        result.forEach(function(d) {

            var fixtures = []

            for(var i = 1; i <= 5; i++) {
                var key = i.toString();
                fixtures.push(d[key]);
            }

            var assists = parseInt(d["Assists"]) || 0;
            var cop = parseInt(d["Chance Of Playing Next"]) || 0;
            var cs = parseInt(d["Clean Sheets"]) || 0;
            var form = parseFloat(d["Form"]) || 0;
            var GWpoints = parseInt(d["GW Points"]) || 0;
            var goals = parseInt(d["Goals"]) || 0;
            var ict = parseFloat(d["ICT Index"]) || 0;
            var name = d["Name"] + " " + d["Last Name"];
            var pointsPerGame = parseFloat(d["Points/Game"]) || 0;
            var red = parseInt(d["RC"]) || 0;
            var yellow = parseInt(d["YC"]) || 0;
            var saves = parseInt(d["Saves"]) || 0;
            var selection = parseFloat(d["Selection %"]) || 0;
            var totalPoints = parseInt(d["Total Points"]) || 0;

            var team = parseInt(d["Team"]) || 0;

            switch(team) {
                case 3:
                    team = "Arsenal"
                    break;
                case 7:
                    team = "Aston Villa"
                    break;
                case 36:
                    team = "Brighton"
                    break;
                case 90:
                    team = "Burnley"
                    break;
                case 8:
                    team = "Chelsea"
                    break;
                case 31:
                    team = "Crystal Palace"
                    break;
                case 11:
                    team = "Everton"
                    break;
                case 94:
                    team = "Brentford"
                    break;
                case 13:
                    team = "Leicester"
                    break;
                case 2:
                    team = "Leeds"
                    break;
                case 14:
                    team = "Liverpool"
                    break;
                case 43:
                    team = "Man City"
                    break;
                case 1:
                    team = "Man Utd"
                    break;
                case 4:
                    team = "Newcastle"
                    break;
                case 45:
                    team = "Norwich"
                    break;
                case 20:
                    team = "Southampton"
                    break;
                case 6:
                    team = "Spurs"
                    break;
                case 57:
                    team = "Watford"
                    break;
                case 21:
                    team = "West Ham"
                    break;
                case 39:
                    team = "Wolves"
                    break;
            }

            var position = parseInt(d["Position"])

            switch(position) {
                case 1:
                    position = "GK"
                    break;
                case 2:
                    position = "DEF"
                    break;
                case 3:
                    position = "MID"
                    break;
                case 4:
                    position = "FWD"
                    break;
            }

            stats.push({Name: name, Team: team, Position: position, Fixtures: fixtures, Goals: goals, Assists: assists, "Clean Sheets": cs,  Saves: saves, "Yellow Cards": yellow, "Red Cards": red, ICT: ict, "Chance of Playing": cop,  Form: form, "GW Points": GWpoints,   "Points per Game": pointsPerGame, "Total Points": totalPoints, "Selection (%)": selection});
        })
        
        // select viz and append table
        const divTable = d3.select("#playerTable")
        
        divTable.select("table").remove()
        
        const table = divTable.append("table");

        const tablebody = table.append("tbody");

        const rows = tablebody.selectAll('tr')
                                .data(Object.entries(stats[0]))
                                .enter()
                                .append('tr')

        // // append rows with rowTemplate
        const cells = rows.selectAll("td")
                            .data(d => d)
                            .enter()
                            .append("td")
                            .text(d => d)
    })
}