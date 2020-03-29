// Constants and data.
const w = 800;
const h = 600;
const legend_cols = 2;
const padding = 60;

let color_map = [
    {r: 0xCC, g: 0xFF, b: 0}, // 0
    {r: 0xCC, g: 0x66, b: 0xFF}, // 1
    {r: 0xFF, g: 0xFF, b: 0x66}, // 2
    {r: 0x66, g: 0xFF, b: 0x99}, // 3
    {r: 0xFF, g: 0x66, b: 0xCC}, // 4
    {r: 0x66, g: 0xCC, b: 0xFF}, // 5
    {r: 0xFF, g: 0x99, b: 0x66}, // 6
    {r: 0xFF, g: 0xCC, b: 0xFF}, // 7
    {r: 0x66, g: 0x66, b: 0}, // 8
    {r: 0, g: 0x66, b: 0xCC}, // 9
    {r: 0x33, g: 0x99, b: 0}, // A
    {r: 0xFF, g: 0, b: 0x66 }, // B
    {r: 0xFF, g: 0xFF, b: 0xFF}, // C
    {r: 0xCC, g: 0xCC, b: 0x99}, // D
    {r: 0xCC, g: 0x66, b: 0x33}, // E
    {r: 0xFF, g: 0x66, b: 0xFF}, // F
]

// const folder_prefix = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/";
const folder_prefix = "data/";

// The urls we have access to.
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

// Globals
let category_colors = {};
let color_idx = 0;

// Functions
// -----------

// Get the sum of values for a given tile/sub-tree.
function getTileSum(node) {
    if (node.hasOwnProperty("value")) {
        return parseFloat(node.value);
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

// Main function of the page. Draw a treemap with the given data, title, and description
// using the D3 library.
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

    buildGradients(svg);

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
    
    // Then d3.treemap computes the position of each element of the hierarchy
    d3
        .treemap()
        .size([w, h])
        // .padding(padding)
        (root);

    // use this information to add rectangles:
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
                let r;
                let g;
                let b;
                if (category_colors.hasOwnProperty(d.data.category)){
                    r = category_colors[d.data.category].r;
                    g = category_colors[d.data.category].g;
                    b = category_colors[d.data.category].b;
                } else {
                    r = color_map[color_idx].r;
                    g = color_map[color_idx].g;
                    b = color_map[color_idx].b;
                    color_idx = (color_idx + 1) % color_map.length;
                    category_colors[d.data.category] = {r: r, g: g, b: b,};
                }
                // return `rgb(${r},${g},${b})`;
                return `url(#svgGradient_${r}_${g}_${b})`;
            })
            .attr("class", "tile")
            .on("mouseover", (d, i) => {
                let html = `<div>${d.data.category}:&nbsp${d.data.name} = ${d.data.value}</div>`;
                let elem = document.getElementById("tooltip");
                elem.innerHTML = html;
                elem.style.visibility = "visible";
                tooltip.attr("style", `left:${d3.event.pageX + 16}px; top:${d3.event.pageY + 8}px;`);
                tooltip.attr("data-value", d.data.value);
            })
            .on("mouseout", (d, i) => { 
                let elem = document.getElementById("tooltip");
                elem.style.visibility = "hidden";
            })
            ;
        
        let legend_height = (Math.ceil(((Object.keys(category_colors).length + 1) * 16) /legend_cols)) + 32;
        const legend = d3.selectAll("body")
            .append("svg")
            .attr("id", "legend")
            .attr("width", w + "px")
            .attr("height", legend_height + "px")
            ;

        legend
            .selectAll("rect")
            .data(Object.keys(category_colors))
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i % legend_cols) * (w / legend_cols) + 8 + "px")
            .attr("y", (d, i) => Math.floor(i / legend_cols) * 16 + 24 + "px")            
            .attr("width", "16px")
            .attr("height", "16px")
            .attr("class", "legend-item")
            .attr("fill", (d, i) => {
                let r = category_colors[d].r
                return `url(#svgGradient_${category_colors[d].r}_${category_colors[d].g}_${category_colors[d].b})`;

            })
            ;
        
        legend
            .selectAll("text")
            .data(Object.keys(category_colors))
            .enter()
            .append("text")
            .attr("x", (d, i) => (i % legend_cols) * (w / legend_cols) + 32 + "px")
            .attr("y", (d, i) => (Math.floor(i / legend_cols) + 1) * 16 + 24 + "px")            
            .attr("width", (d, i) => (Math.floor(w / legend_cols) - 32) + "px")
            .attr("height", "16px")
            .text((d, i) => d)            
            ;
        
        legend
            .append("text")
            .attr("x", "0px")
            .attr("y", "16px")
            .attr("width", w + "px")
            .attr("height", "16px")
            .text("Categories")
            ;

}

// Build a bunch of color gradients for the categories.
function buildGradients(svg) {
    let color_keys = Object.keys(color_map);
    let defs = svg.append("defs");
    for (let i = 0; i < color_keys.length; i++) {
        let r = color_map[color_keys[i]].r;
        let g = color_map[color_keys[i]].g;
        let b = color_map[color_keys[i]].b;
        
        let gradient = defs.append("radialGradient")
        .attr("id", `svgGradient_${r}_${g}_${b}`)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", `rgb(${r}, ${g}, ${b})`)
        .attr("stop-opacity", 1);

        gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", `rgb(${r/2}, ${g/2}, ${b/2})`)
        .attr("stop-opacity", 1);
    }
}

// Clean up any elements that will be recreated when we reload data.
function cleanUp() {
    const elementIds = ["title", "description", "graph", "tooltip", "legend"];
    let elem;    
    for (let i = 0; i < elementIds.length; i++) {
        elem = document.getElementById(elementIds[i]);
        if ((elem !== undefined) && (elem !== null)) {
            elem.parentElement.removeChild(elem);
        }
    }

    category_colors = {};
    color_idx = 0;
}

// Create the datasource buttons.
// (largely hard coded stuff).
function createButtons() {
    let body = document.getElementsByTagName("body")[0];
    let div = document.createElement("div");
    div.className = "buttons";
    body.appendChild(div);
    let btnVideoGames = document.createElement("button");
    btnVideoGames.innerText = "Video Games";
    btnVideoGames.onclick = onVideoGames;
    div.appendChild(btnVideoGames);

    let btnMovies = document.createElement("button");
    btnMovies.innerText = "Movies";
    btnMovies.onclick = onMovies;
    div.appendChild(btnMovies);

    let btnKickStarter = document.createElement("button");
    btnKickStarter.innerText = "Kickstarter";
    btnKickStarter.onclick = onKickStarter;
    div.appendChild(btnKickStarter);
}

// Fetch a data file from a url then draw the treemap for that file.
function loadFile(url) {
    cleanUp();
    fetch(url.url)
    .then(response => response.json())
    .then(data => {
        createTreeMap(data, url.title, url.description);
    });
}

// Load up the Kickstarter data
function onKickStarter(e) {
    loadFile(urls.kickstarter);
}

// Load up the Movies data
function onMovies(e) {
    loadFile(urls.movie);
}

// Load up the video game data
function onVideoGames(e) {
    loadFile(urls.videogame);
}

// Start up the page.
createButtons();
onVideoGames();;