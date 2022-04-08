// API to scrape Google sheet into JSON format
const googleAPI = "https://opensheet.elk.sh/";
// Spreadsheet with the FPL data
const spreadsheet = "1_rkHKgIPt3i_2uKr8kh5u4WZaYOLccNiiTx1xAaAo_Y";

// Creating global variables
var fplData, transferPickData, managers;

// Fetching and parsing data tab
fetchData("Data").then(function(d) {
    fplData = dataTabParser(d);
    scatterPlot(fplData);
})

// Fetching, parsing and filtering Transfer Pick tab
fetchData("Transfer Pick - GK").then(function(data) {
    transferPickData = filterData(data);
    const top = getTopValues(transferPickData,10)
    barChart(top);
});

// Fetching, parsing and filtering Top 100 Managers tab
fetchData("Top 100 Managers").then(function(data) {
    managers = parseManager(data);
    managerCircle(managers);
});


var transfersIN = fetchData("Transfers-IN");
var transfersOut = fetchData("Transfers-OUT");

// https://dmitripavlutin.com/javascript-fetch-async-await/
// https://benborgers.com/posts/google-sheets-json
async function fetchData(tab){
    const endpoint = `${googleAPI}${spreadsheet}/${tab}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
};

function dataTabParser(data) {

    var stats = [];

    data.forEach(function(d) {

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
        var cost = (parseInt(d["Cost Today"]) / 10) || 0;

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

        stats.push({Name: name, Team: team, Position: position, Cost: cost, Fixtures: fixtures, Goals: goals, Assists: assists, "Clean Sheets": cs,  Saves: saves, "Yellow Cards": yellow, "Red Cards": red, ICT: ict, "Chance of Playing": cop,  Form: form, "GW Points": GWpoints, "Points per Game": pointsPerGame, "Total Points": totalPoints, "Selection": selection});
    })
    return stats;
}

function filterData(data) {
    var barData = [];

    data.forEach(function(d) {

        var FDIndex = parseFloat(d["FD Index"]) || 0;
        var name = d["Name"] + " " + d["Last Name"];
        var position = d.Position

        barData.push({Name: name, FDIndex: FDIndex, Position: position});
    })
    return barData;
}

//https://stackoverflow.com/questions/60105631/top-highest-values-in-an-object-more-if-there-are-more-max-values-and-they-are
function getTopValues(obj, topN) {

    var sortedEntries = Object.entries(obj).sort(function(a,b){
        return b[1]['FDIndex'] - a[1]['FDIndex']
    });

    // Find nth maximum value
    var maxN = parseInt(sortedEntries[topN - 1][0]);

    var result = sortedEntries.filter(function(entry){
        return entry[0] <= maxN;
    });
    return result;
}

function parseManager(data) {
    const circleData = [];

    data.forEach(function(d) {

        var count = parseInt(d.Count) || 0;

        var position = d.Position

        var name = d["Name"] + " " + d["Last Name"];

        circleData.push({Count: count, Position: position, Name: name});
    })
    
    return circleData;
}

//https://stackoverflow.com/questions/30018106/set-domain-on-ordinal-scale-from-tsv-data
const colorScale = d3.scaleOrdinal()
                        .domain(["GK", "MID", "FWD", "DEF"])
                        .range(d3.schemeCategory10);