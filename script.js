
function generateMapZoom() {
let us;

d3.json("https://d3js.org/us-10m.v1.json")
  .then(function(data) {
    us = data;

    path = d3.geoPath();
    const width = 975;
    const height = 610;
    let isClicked;

    const zoom = d3.zoom()
        .scaleExtent([1, 1])
        .on("zoom", zoomed);

    const svg = d3.select("#map_viz")
        .append("svg:svg")
        .attr("viewBox", [0, 0, width, height])
        .on("click", reset);

    const g = svg.append("g");

    var county_names = [{name: "Sullivan County, NY",
                         color: "#254E70"},
                        {name: "Duval County, FL",
                         color: "#64113F"},
                        {name: "Platte County, NE",
                         color: "#00272B"}]

    const counties = g.append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
        .attr("d", path)
        .attr("cursor", "pointer")
        .attr("class", "county-boundary")
        .attr("stroke", function(d) {if (d.id.startsWith("36")) {return "#C4D8F3"}
        else if (d.id.startsWith("12")) {return "#f8d3e7"}
        else if (d.id.startsWith("31")) {return "#91b191"}
        else {return "#fff"}})
        .style("fill", function(d) { if (d.id == "36105") {return "#254E70"}
        else if (d.id.startsWith("36")) {return "#C4D8F3"}
        else if (d.id == "12031") {return "#64113F"}
        else if (d.id.startsWith("12")) {return "#f8d3e7"}
        else if (d.id == "31141") { return "#00272B" }
        else if (d.id.startsWith("31")) {return "#91b191"}})
        .on("click", clickOrReset);

    const country_outline = g.append("g")
      .attr("id", "country_outline")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.nation).features)
      .join("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#cccccc")


    const state_boundaries = g.append("g")
      .attr("id", "state-borders")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .join("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("z-index", function(d) {if (d.id == "36" | d.id == "12" | d.id == "31") { return "1" }
        else {return "0"}})
        .attr("stroke", "#cccccc")
    var size = 20


    svg.selectAll("lineLegend")
      .data(county_names)
      .enter()
      .append("circle")
        .attr("cx", width - 150)
        .attr("cy", function(d,i){ return 425 + i*(size+5)})
        .attr("r", size / 2)
        .style("fill", function(d){ return (d.color)})
        .attr("class", "circle")
        .attr("id", function(d) {return d.name + "circle"})


    svg.selectAll("mylabels")
      .data(county_names)
      .enter()
      .append("text")
        .attr("x", width - 130)
        .attr("y", function(d,i){ return 426 + i*(size+5)})
        .text(function(d) {return d.name})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "15")
        .style("font-family", "PT Sans")
    svg.call(zoom);

    function reset() {
      console.log(isClicked)

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
      isClicked = 0;

    }

    function clicked(event, d) {
      console.log(isClicked)
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      console.log(path.bounds(d))

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(60, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())

      );
      isClicked = 1;
    }
    function clickOrReset(event, d) {
      console.log(isClicked)
      if (isClicked == 1) {
        reset()
      if (d.id == "36105") {
        document.getElementById("sullivan_info").style.display = "none";
      }
      else if (d.id == "12031") {
        document.getElementById("duval_info").style.display = "none";
      }
      else if (d.id == "31141") {
        document.getElementById("platte_info").style.display = "none";
      }
    }
      else {

        if (d.id == "36105") {
          clicked(event, d)
          setTimeout('document.getElementById("sullivan_info").style.display = "block";', 775);
        }
        else if (d.id == "12031") {
          clicked(event, d)
          setTimeout('document.getElementById("duval_info").style.display = "block";', 775);
        }
        else if (d.id == "31141") {
          clicked(event, d)
          setTimeout('document.getElementById("platte_info").style.display = "block";', 775);
        }



      }
    }
    function zoomed(event) {
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }
    })
.catch(function(error) {
  console.log(error)
});

}
