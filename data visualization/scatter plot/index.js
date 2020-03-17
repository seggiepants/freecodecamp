const w = 800;
const h = 600;
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const url = "data/cyclist-data.json";

function createScatterPlot(data) {
    const title = "Doping in Bicycle racing against Time";
    const color_doping = "purple";
    const color_no_doping = "lightgreen";

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
        .text("Tooltip")
        ;

    let elem = document.getElementById("tooltip");
    elem.style.visibility = "hidden";

    const countAccusations = data.reduce((acc, d) => acc + (d.Doping.length > 0 ? 1 : 0), 0);
    const countNoAccusations = data.length - countAccusations;
    let html = `
    <div><strong>Legend:</strong></div>
    <div><span class="square" style="background-color: ${color_doping}">&nbsp;</span>&nbsp;Accusations:&nbsp${countAccusations}</div>
    <div><span class="square" style="background-color: ${color_no_doping}">&nbsp;</span>&nbsp;Uncontested:&nbsp${countNoAccusations}</div>`;
    d3.select("body")
        .append("div")
        .attr("id", "legend")
        ;
    document.getElementById("legend").innerHTML = html;

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
        .attr("r", 6)
        .attr("class", "dot")
        .attr("data-xvalue", (d, i) => d.Year)
        .attr("data-yvalue", (d, i) => new Date(dateTimePrefix + d.Time))
        .attr("fill", (d, i) => {
            if (d.Doping.length > 0) {
                return color_doping;
            } else {
                return color_no_doping;
            }
        })
        .on("mouseover", (d, i) => {
            let keys = ["Name", "Year", "Time", "Place", "Doping"];
            let html = keys.reduce((prev, curr) => {
if (d[curr].length == 0) {
    return prev;
} else if (curr == "URL") {
    return prev + `<div><strong>${curr}:</strong>&nbsp<a href="${d[curr]}">${d[curr]}</a></div>`;
} else 
    return prev + `<div><strong>${curr}:</strong>&nbsp${d[curr]}</div>`;
}, "");
            let elem = document.getElementById("tooltip");
            elem.innerHTML = html;
            elem.style.visibility = "visible";
            tooltip.attr("style", "left:" + xScale(d.Year) + "px; top:" + yScale(new Date(dateTimePrefix + d.Time)) + "px;");
            tooltip.attr("data-year", d.Year);


        })
        .on("mouseout", (d, i) => { 
            let elem = document.getElementById("tooltip");
            elem.style.visibility = "hidden";
        })

        ;

}

fetch(url)
    .then(response => response.json())
    .then(data => {
        createScatterPlot(data);
    });
