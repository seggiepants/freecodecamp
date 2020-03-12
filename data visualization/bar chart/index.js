const w = 800;
const h = 600;
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

function createBarChart(data) {
    console.log(data);
    const minDate = d3.min(data.data, (d) => Date.parse(d[0]));
    const maxDate = d3.max(data.data, (d) => Date.parse(d[0]));
    
    const minValue = d3.min(data.data, (d) => d[1]);
    const maxValue = d3.max(data.data, (d) => d[1]);

    console.log(minDate);
    console.log(maxDate);
    console.log(minValue);
    console.log(maxValue);
    d3.select("body")
        .append("p")
        .attr("id", "title")
        .text(data.name);
    const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        ;

    const padding = 60;
    const xScale = d3.scaleLinear()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([maxValue, minValue])
        .range([padding, h - padding]);
        
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis);
}

fetch(url)
    .then(response => response.json())
    .then(data => {
        createBarChart(data);
    });


    