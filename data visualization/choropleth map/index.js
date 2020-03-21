const w = 800;
const h = 600;

let files = {
    counties: {
        url: "data/counties.json", 
        // url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
        data: {},
        ready: false,
    },
    education: {
        url: "data/for_user_education.json", 
        // url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
        data: {},
        ready: false,
    },
};

function createChoroplethMap(data) {
    const title = "United States Higher Education by County";
    const description = "Percentage of Adults with a Bachelors Degree or Higher"

    d3.select("body")
        .append("p")
        .attr("id", "title")
        .text(title)
        ;
    d3.select("body")
        .append("p")
        .attr("id", "description")
        .text(description)
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

    d3.select("body")
        .append("div")
        .attr("id", "legend")
        ;
    /*
    const dateTimePrefix = "01-01-1970 00:";
    const minYear = d3.min(data, (d) => d.Year);
    const maxYear = d3.max(data, (d) => d.Year);
    // const minTime = Math.min(new Date(dateTimePrefix + "00:00"), d3.min(data, (d) => new Date(dateTimePrefix + d.Time)));
    const minTime = d3.min(data, (d) => new Date(dateTimePrefix + d.Time));
    const maxTime = d3.max(data, (d) => new Date(dateTimePrefix + d.Time));

    */
    const padding = 60;
    const xScale = d3.scaleLinear()
        .domain([data.counties.data.bbox[0], data.counties.data.bbox[2]])
        .range([padding, w - padding])
        ;

    const yScale = d3.scaleLinear()
    .domain([data.counties.data.bbox[1], data.counties.data.bbox[3]])
        .range([padding, h - padding])
        ;
    
    /*
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
    */
    svg.selectAll("polygon")
        .data(data.counties.data.objects.counties.geometries)
        .enter()
        .append("polygon")
        .attr("points", (d, i) => {
            let points = "";
            if (d.type == "Polygon") {                
                for(let i = 0; i < d.arcs.length; i++) {
                    for(let j = 0; j <data.counties.data.arcs[i].length; j++ ) {
                        points += `${xScale(data.counties.data.arcs[i][j][0])},${yScale(data.counties.data.arcs[i][j][1])} `;
                    }
                }
            }
            console.log(points);
            return points;
        })
        .attr("fill", "blue")
        .attr("class", "county")
        ;
    /*
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
    */
   console.log("Create called");
}


keys = Object.keys(files);
console.log(keys);
for(let i = 0; i < keys.length; i++ ) {
    let key = keys[i];
    console.log(`begin key ${key}`);
    fetch(files[key].url)
        .then(response => response.json())
        .then(data => {
            files[key].data = data;
            files[key].ready = true;
            console.log(`key: ${key}`);
            let isReady = Object.keys(files).reduce((acc, curr) => acc && files[curr].ready, true);
            if (isReady) {
                createChoroplethMap(files);
            }
        });
}
