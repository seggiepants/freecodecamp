const w = 800;
const h = 600;
const padding = 60;

// const folder_prefix = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/";
const folder_prefix = "data/";

const urls = {
    kickstarter: {
        url: folder_prefix + "kickstarter-funding-data.json",
        title: "Kickstarter Pledges",
        description: "Top pledged kickstarters grouped by category",
    },
    movie: {
        url: folder_prefix + "movie-data.json",        
        title: "Movie Sales",
        description: "Top grossing movies grouped by genre",
    },
    videogame: {
        url: folder_prefix + "video-game-sales-data.json",
        title: "Video Game Sales",
        description: "Top selling video games grouped by platform",
    }
};

function getTileSum(node) {
    if (node.hasOwnProperty("value")) {
        console.log(`${node.name} - ${node.category} = ${node.value}`);
        return node.value;
    } else if (node.hasOwnProperty("children")) {
        let runningTotal = 0.0;
        for(let i = 0; i < node.children.length; i++) {
            runningTotal += getTileSum(node.children[i]);
        }
        return runningTotal;
    } else {
        return 0;
    }
}

function createTreeMap(data, title, description) {
    
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
        .attr("id", "graph")
        ;

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .text("Tooltip")
        ;

    let elem = document.getElementById("tooltip");
    elem.style.visibility = "hidden";

    // Begin copy/paste from: https://www.d3-graph-gallery.com/graph/treemap_json.html

    // Give the data to this cluster layout:
    let root = d3.hierarchy(data).sum(d => getTileSum(d));
    console.log(data);
    console.log(root);
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
   .size([w, h])
   // .padding(padding)
   (root);

    // use this information to add rectangles:
    console.log(root.leaves());
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
            .append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("data-name", (d, i) => d.data.name)
            .attr("data-category", (d, i) => d.data.category)
            .attr("data-value", (d, i) => d.data.value)
            .style("stroke", "black")
            .style("fill", (d, i) => {
                r = Math.floor(Math.random() * 256);
                g = Math.floor(Math.random() * 256);
                b = Math.floor(Math.random() * 256);
                return `rgb(${r},${g},${b})`;
            })
            .attr("class", "tile")

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
            .append("text")
            .attr("x", d => (d.x0 + 5) + "px")    // +10 to adjust position (more right)
            .attr("y", d => (d.y0 + 20) + "px")    // +20 to adjust position (lower)
            .attr("width", d=>(d.x1 - d.x0) + "px")
            .attr("height", d=>(d.y1 - d.y0) + "px")
            .text(d => d.data.name)
            //.attr("font-size", "15px")
            //.attr("fill", "black")
        ;
    /*
    const padding = 60;
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, w - padding])
        ;

    const yScale = d3.scaleTime()
        .domain([new Date(minYear, maxMonth - 1, 28), new Date(minYear, minMonth - 1, 1 )])
        .range([padding, h - padding])
        ;

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
    ;

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%B"))
        ;

    const cellW = xScale(minYear + 1) - xScale(minYear);
    const cellH = yScale(new Date(minYear, minMonth - 1, 1)) - yScale(new Date(minYear, minMonth, 1));

    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis)
        ;

    svg.append("g")
        // -cellH/2 so that the test thinks the ticks are aligned correctly.
        // yeah it is a hack, but I think the test is flawed.
        .attr("transform", "translate(" + padding + ", " + -cellH/2 + ")")
        .attr("id", "y-axis")
        .call(yAxis)
        ;
        
    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(d.year))
        .attr("y", (d, i) => yScale(new Date(minYear, d.month - 1, 1)) - cellH)
        .attr("width", cellW + "px")
        .attr("height", cellH + "px")
        .attr("class", "cell")
        .attr("data-month", (d, i) => d.month - 1)
        .attr("data-year", (d, i) => d.year)
        .attr("data-temp", (d, i) => baseTemp + d.variance)
        .attr("fill", (d, i) => {
            let cellColor = colorMap[Math.floor((d.variance - minVariance)/(maxVariance - minVariance) * numColors)];
            return `rgb(${r(cellColor)},${g(cellColor)},${b(cellColor)})`;
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
            tooltip.attr("style", `left: ${xScale(d.year)}px; top: ${(padding - 4) + yScale(new Date(minYear, d.month, 1))}px;`);
            tooltip.attr("data-year", d.year);
        })
        .on("mouseout", (d, i) => { 
            let elem = document.getElementById("tooltip");
            elem.style.visibility = "hidden";
        })
        ;

        let legendW = 16 * (numColors + 1);
        let colorScale = d3.scaleLinear()
            .domain([minVariance, maxVariance])
            .range([0, legendW]);

        const colorAxis = d3.axisBottom(colorScale);
        const legend = d3.selectAll("body")
            .append("svg")
            .attr("id", "legend")
            .attr("width", legendW + 8 + "px")
            .attr("height", "64px")
            ;
        legend
            .append("g")
            .attr("transform", "translate(0, 20)")
            .attr("id", "color-axis")
            .call(colorAxis)
            ;
        legend
            .append("text")
            .attr("x", legendW / 2)
            .attr("y", 56)
            .style("text-anchor", "middle")
            .html("Variance in &deg;C")
            ;

console.log(`${minVariance}, ${maxVariance}`);
        legend
            .selectAll("rect")
            .data(colorMap)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 16 + "px")
            .attr("y", "0px")
            .attr("width", "16px")
            .attr("height", "16px")
            .attr("fill", (d, i) => {
                return `rgb(${r(d)},${g(d)},${b(d)})`;            
            })

        .attr("class", "legend_cell")
        .style("background-color", (d, i) => {
            return `rgb(${r(d)},${g(d)},${b(d)})`;            
        })
            ;

*/
}

function cleanUp() {
    const elementIds = ["title", "description", "svg", "tooltip", "legend"];
    let elem;    
    for (let i = 0; i < elementIds.length; i++) {
        elem = document.getElementById(elementIds[i]);
        if ((elem !== undefined) && (elem !== null)) {
            elem.parentElement.removeChild(elem);
        }
    }
}

function loadFile(url) {
    cleanUp();
    fetch(url.url)
    .then(response => response.json())
    .then(data => {
        createTreeMap(data, url.title, url.description);
    });
}

loadFile(urls.videogame);