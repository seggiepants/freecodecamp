const w = 800;
const h = 600;
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const url = "data/cyclist-data.json";

function createScatterPlot(data) {
    // console.log(data);

    d3.select("body")
    .append("p")
    .attr("id", "title")
    .text("This is my title")
    ;

    const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    ;
    const dateTimePrefix = "01-01-1970 00:";
    const minYear = d3.min(data, (d) => d.Year);
    const maxYear = d3.max(data, (d) => d.Year);
    const minTime = Math.min(new Date(dateTimePrefix + "00:00"), d3.min(data, (d) => new Date(dateTimePrefix + d.Time)));
    const maxTime = d3.max(data, (d) => new Date(dateTimePrefix + d.Time));


    const padding = 60;
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, w - padding])
        ;

    const yScale = d3.scaleTime()
        .domain([maxTime, minTime])
        .range([padding, h - padding])
        ;
        
    const xAxis = d3.axisBottom(xScale);
    // xAxis.tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis)
        ;

    svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis)
        ;

}

fetch(url)
    .then(response => response.json())
    .then(data => {
        createScatterPlot(data);
    });
