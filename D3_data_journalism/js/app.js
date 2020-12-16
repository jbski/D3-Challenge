// @TODO: YOUR CODE HERE!
let svgWidth = 850;
let svgHeight = 600;


let margin = {
    top: 60,
    right: 30,
    bottom: 60,
    left: 80
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
d3.csv("data/data.csv").then(function (censusData) {
    console.log(censusData)

    // convert strings to integers
    censusData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    })

    // create scales
    let xScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty), d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

    // create axes
    let xAxis = d3.axisBottom(xScale).ticks(12);
    let yAxis = d3.axisLeft(yScale).ticks(12);

    let radius = "17"

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(${d3.min(censusData, d => d.poverty) - radius * 2}, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr("transform", `translate(${d3.min(censusData, d => d.poverty) - radius * 2}, 0)`)
        .call(yAxis);


    // append circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", radius)
        .classed("stateCircle", true)


    let text = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .text(d => d.abbr)
        .classed("stateText", true)

    chartGroup.append("text")
        .attr("transform", `translate(${(width / 2) - 60}, ${height + margin.top - 15})`)
        // .attr("class", "axisText")
        .text("In Poverty (%)")
        .classed("Atext", true)

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", `${0 - 60}`)
        .attr("x", `${0 - 300}`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

})
