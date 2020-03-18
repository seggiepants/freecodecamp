const w = 800;
const h = 600;
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const url = "data/global-temperature.json";

function createHeatMap(data) {
    const title = "Surface Temperature over Time";

    d3.select("body")
        .append("p")
        .attr("id", "title")
        .text(title)
        ;

    d3.select("body")
        .append("p")
        .attr("id", "description")
        .text("")
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

    const baseTemp = data.baseTemperature + 0.0;
    /*
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
    */
    const minYear = d3.min(data.monthlyVariance, (d) => d.year);
    const maxYear = d3.max(data.monthlyVariance, (d) => d.year);
    const minMonth = d3.min(data.monthlyVariance, (d) => d.month + 0) - 1;
    const maxMonth= d3.max(data.monthlyVariance, (d) => d.month + 0) - 1;
    const minVariance = d3.min(data.monthlyVariance, (d) => d.variance);
    const maxVariance = d3.max(data.monthlyVariance, (d) => d.variance);
    const description = `${minYear} - ${maxYear}: base temperature ${baseTemp}&deg;C`;
    document.getElementById("description").innerHTML = description;


    const padding = 60;
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, w - padding])
        ;

    const yScale = d3.scaleTime()
        .domain([new Date(minYear, maxMonth, 31), new Date(minYear, minMonth, 1)])
        .range([padding, h - padding])
        ;

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
    ;

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%B"))
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
    
    const cellW = xScale(minYear + 1) - xScale(minYear);
    const cellH = yScale(new Date(minYear, minMonth, 1)) - yScale(new Date(minYear, minMonth + 1, 1));
console.log(`w = ${cellW}, h = ${cellH}`);
    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(d.year))
        .attr("y", (d, i) => yScale(new Date(minYear, d.month, 1)))
        .attr("width", cellW + "px")
        .attr("height", cellH + "px")
        .attr("class", "cell")
        .attr("data-month", (d, i) => d.month)
        .attr("data-year", (d, i) => d.year)
        .attr("data-temp", (d, i) => baseTemp + d.variance)
        .attr("fill", (d, i) => {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            let rgb = `rgb(${r},${g},${b})`;
            return rgb;
        })
        .on("mouseover", (d, i) => {
            let keys = ["year", "month", "variance"];
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
            tooltip.attr("style", `left: ${xScale(d.Year)}px; top: ${yScale(d.Month)}px;`);
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
        createHeatMap(data);
    });
