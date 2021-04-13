function generateMapZoom() {
let us;
d3.json("https://d3js.org/us-10m.v1.json")
  .then(function(data) {
    us = data;
    console.log(us)
    path = d3.geoPath();
    const width = 975;
    const height = 610;

    //add a reset button - look at your other d3 things to see how to do it?

    const zoom = d3.zoom()
        .scaleExtent([1, 1])
        .on("zoom", zoomed);


    const svg = d3.select("#map_viz")
        .append("svg:svg")
        .attr("viewBox", [0, 0, width, height])
        .on("click", reset);

    svg.append("text")
      .attr("x", width / 2 )
      .attr("y", 20)
      .style("font-size", "20")
      .style("font-weight", "bold")
      .style("font-family", "Poppins")
      .style("text-anchor", "middle")
      .text("U.S. Counties");

    const g = svg.append("g");


    var county_names = [{name: "Sullivan County, NY",
                         color: "#254E70"},
                        {name: "Duval County, FL",
                         color: "#C6E0FF"},
                        {name: "Platte County, NE",
                         color: "#00272B"}]

    const counties = g.append("g")
      .attr("id", "counties")
      .attr("cursor", "pointer")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .style("fill", function(d) { if (d.id == "36105") {return "#254E70"}
        else if (d.id == "12031") {return "#C6E0FF"}
        else if (d.id == "31141") { return "#00272B" }})
        .on("click", clicked);

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


    g.append("path")
        .attr("id", "state-borders")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));



    svg.call(zoom);

    function reset() {
      // states.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      // states.transition().style("fill", null);
      // d3.select(this).transition().style("fill", "red");
      // counties.transition().style("stroke", "white");

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(60, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())

      );
      var img = document.getElementById("sullivan_info")
      if (img.style.display === "block") {
        img.style.display = "none";
      } else {
        img.style.display = "block";

      };
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
