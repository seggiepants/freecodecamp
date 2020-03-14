const w = 800;
const h = 600;
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const url = "data/GDP-data.json";

function createBarChart(data) {
    const minDate = d3.min(data.data, (d) => d[0]);
    const maxDate = d3.max(data.data, (d) => d[0]);
    
    let minValue = d3.min(data.data, (d) => d[1]);
    const maxValue = d3.max(data.data, (d) => d[1]);

    d3.select("body")
        .append("p")
        .attr("id", "title")
        .text(data.name)
        ;
    const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        ;

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .text("Hello World")
        ;


    const padding = 60;
    const xScale = d3.scaleTime()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([padding, w - padding])
        ;

    if (minValue > 0) {
        minValue = 0;
    }

    const yScale = d3.scaleLinear()
        .domain([maxValue, minValue])
        .range([padding, h - padding])
        ;
        
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.timeFormat("%m-%d-%Y"));
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

    const barWidth = (w - (2*padding)) / data.data.length;
    svg.selectAll("rect")
        .data(data.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(new Date(d[0])))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d, i) => yScale(minValue) - yScale(d[1])) 
        .attr("fill", "navy")
        .attr("data-date", (d, i) => d[0])
        .attr("data-gdp", (d, i) => d[1])
        .append("title")
        .text(d => `GDP: ${d[1]}
Date: ${new Date(d[0]).toLocaleDateString()}`)
        .attr("data-date", d => new Date(d[0]))
        .on("mouseover", (d, i) => {
            console.log(`mouseover: ${d}, ${i}`);
/*            tooltip
                .text(`GDP: ${d[1]}
Date: ${new Date(d[0]).toLocaleDateString()}`)
                .style("visible", "true")
                .attr("data-date", d => new Date(d[0]))
        */})
        .on("mouseout", (d, i) => { 
            //console.log(`mouseout: ${d}, ${i}`);
            console.log("mouseout");
            //tooltip.style("visible", "false")
        })
        ;
}

fetch(url)
    .then(response => response.json())
    .then(data => {
        createBarChart(data);
    });


    