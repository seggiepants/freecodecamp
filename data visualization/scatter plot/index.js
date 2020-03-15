const w = 800;
const h = 600;
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const url = "data/cyclist-data.json";

function createScatterPlot(data) {
    // console.log(data);

    const title = "Doping in Bicycle racing against Time";

    d3.select("body")
        .append("p")
        .attr("id", "title")
        .text(title)
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
        .attr("visibility", "hidden")
        .text("")
        ;

    const countAccusations = data.reduce((acc, d) => acc + (d.Doping.length > 0 ? 1 : 0), 0);
    const countNoAccusations = data.length - countAccusations;
    d3.select("body")
        .append("div")
        .attr("id", "legend")
        .text(`Doping accusations: Accusation - ${countAccusations}, No Accusation - ${countNoAccusations}, Total - ${data.length}`)
        ;

    const dateTimePrefix = "01-01-1970 00:";
    const minYear = d3.min(data, (d) => d.Year);
    const maxYear = d3.max(data, (d) => d.Year);
    // const minTime = Math.min(new Date(dateTimePrefix + "00:00"), d3.min(data, (d) => new Date(dateTimePrefix + d.Time)));
    const minTime = d3.min(data, (d) => new Date(dateTimePrefix + d.Time));
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
        
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
    ;
    // xAxis.tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S"))
        ;

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
    
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(d.Year))
        .attr("cy", (d, i) => yScale(new Date(dateTimePrefix + d.Time)))
            //console.log(`cx: ${xScale(d.Year) + padding}, cy: ${yScale(new Date(dateTimePrefix + d.Time)) + padding}`);
        .attr("r", 5)
        .attr("class", "dot")
        .attr("data-xvalue", (d, i) => d.Year)
        .attr("data-yvalue", (d, i) => new Date(dateTimePrefix + d.Time))
        .attr("fill", (d, i) => {
            if (d.Doping.length > 0) {
                return "purple";
            } else {
                return "lightgreen";
            }
        })
        //.attr("fill", "black")
        .on("mouseover", (d, i) => {
            tooltip
                .text(`Year: ${d.Year}
Time: ${d.Time}
Allegation: ${d.Doping.length === 0 ? "None" : d.Doping}`)
                .style("visibility", "visible")
                .attr("style", "left:" + xScale(d.Year) + "px; top:" + yScale(new Date(dateTimePrefix + d.Time)) + "px;")
                .attr("data-year", d.Year)
        })
        .on("mouseout", (d, i) => { 
            tooltip.style("visibility", "hidden")
        })

        ;

}

fetch(url)
    .then(response => response.json())
    .then(data => {
        createScatterPlot(data);
    });
