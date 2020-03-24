const w = 960;
const h = 600;

let color_map = [
    {r: 0, g: 0, b: 0x33}, // 0
    {r: 0, g: 0x00, b: 0x66}, // 1
    {r: 0, g: 0x00, b: 0x99}, // 2
    {r: 0x0, g: 0x33, b: 0x99}, // 3
    {r: 0x66, g: 0, b: 0x99}, // 4
    {r: 0x66, g: 0, b: 0x66}, // 5
    {r: 0x99, g: 0, b: 0x66}, // 6
    {r: 0xFF, g: 0, b: 0x66}, // 7
    {r: 0xFF, g: 0, b: 0x33}, // 8
    {r: 0xFF, g: 0x33, b: 0}, // 9
    {r: 0xFF, g: 0xCC, b: 0}, // A
    {r: 0xFF, g: 0xFF, b: 0}, // B
    {r: 0xCC, g: 0xFF, b: 0x33}, // C
    {r: 0x66, g: 0xFF, b: 0}, // D
    {r: 0x33, g: 0xCC, b: 0x33}, // E
    {r: 0x00, g: 0xFF, b: 0}, // F
]

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
        .attr("class", "counties");
        ;

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .text("Tooltip")
        ;

    let elem = document.getElementById("tooltip");
    elem.style.visibility = "hidden";
    
    const minEducation = d3.min(data.education.data, (d) => Number.parseFloat(d.bachelorsOrHigher) || 0.0);
    const maxEducation = d3.max(data.education.data, (d) => Number.parseFloat(d.bachelorsOrHigher) || 0.0);

    const path = d3.geoPath(); 
    
    counties = svg
        .append("g")
        .selectAll("path")
        .data(topojson.feature(data.counties.data, data.counties.data.objects.counties).features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("data-fips", (d, i) => d.id)
        .attr("data-education", (d, i) => data.education.data.filter(e => e.fips === d.id)[0].bachelorsOrHigher || 0.0)
        .attr("data-state", (d, i) => data.education.data.filter(e => e.fips === d.id)[0].state || "")
        .attr("data-name", (d, i) => data.education.data.filter(e => e.fips === d.id)[0].area_name || "")
        .attr("fill", (d, i) => {
            let bachelorsOrHigher = parseFloat(data.education.data.filter(e => e.fips === d.id)[0].bachelorsOrHigher || 0.0);
            let targetColor = color_map[Math.max(0, Math.min(color_map.length - 1, Math.floor(((bachelorsOrHigher - minEducation) / (maxEducation - minEducation)) * color_map.length)))];
            return `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
        })
        .on("mouseover", (d, i) => {
            let fips = d.id;
            let edu = data.education.data.filter(e => e.fips === d.id)[0];
            let html = `<div>${edu["area_name"] || "unknown"}, ${edu["state"] || "unknown"}: ${edu["bachelorsOrHigher"] || "error"}%</div>`;
            let elem = document.getElementById("tooltip");
            elem.innerHTML = html;
            elem.style.visibility = "visible";
            tooltip
                .attr("style", `left:${d3.event.pageX + 32}px; top:${d3.event.pageY + 16}px;`);
            tooltip
                .attr("data-education", edu.bachelorsOrHigher || 0.0);
        })
        .on("mouseout", (d, i) => { 
            let elem = document.getElementById("tooltip");
            elem.style.visibility = "hidden";
        })
        .attr("d", path)
        ;
    
    svg
        .datum(topojson.mesh(data.counties.data, data.counties.data.objects.states))
        .append("path")
        .attr("class", "states")
        .attr("d", path);

    let legendW = 16 * color_map.length;
    let colorScale = d3.scaleLinear()
        .domain([minEducation, maxEducation])
        .range([0, legendW]);
    const colorAxis = d3.axisBottom(colorScale);
    const legend = d3.selectAll("body")
        .append("svg")
        .attr("id", "legend")
        .attr("width", legendW + 8 + "px")
        .attr("height", "64px")
        ;
    
    legend
        .append("text")
        .attr("x", legendW / 2)
        .attr("y", 56)
        .style("text-anchor", "middle")
        .text("Bachelors or Higher Education %")
        ;

    legend
        .append("g")
        .attr("transform", "translate(0, 20)")
        .attr("id", "color-axis")
        .call(colorAxis)
        ;

   legend
        .selectAll("rect")
        .data(color_map)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 16 + "px")
        .attr("y", "0px")
        .attr("width", "16px")
        .attr("height", "16px")        
        .attr("fill", (d, i) => {
            return `rgb(${d.r},${d.g},${d.b})`;            
        })
        .attr("class", "legend_cell")
        .style("background-color", (d, i) => {
            return `rgb(${d.r},${d.g},${d.b})`;            
        })
        ;

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
