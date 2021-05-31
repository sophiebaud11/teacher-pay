
function generateMapZoom() {
let us;

d3.json("https://d3js.org/us-10m.v1.json")
  .then(function(data) {
    us = data;
    // filter data here, then make 3 individual svgs
    console.log(us)
    path = d3.geoPath();
    const width = 975;
    const height = 610;
    let isClicked;
    // window.addEventListener("scroll", function(event) {
    //   var top = this.scrollY;
    //   console.log(top)
    //   if (top > 3300 && top < 3500) {
    //     clickOrReset()
    //   }
    // }, false);


    // start automating the zooms
    // var pageHeight = window.innerHeight;
    //
    // var scrollPercent = (pageHeight - window.scrollY)/pageHeight;
    //
    // if (scrollPercent > -3.9) {
    //   clickOrReset()
    // }
    const zoom = d3.zoom()
        .scaleExtent([1, 1])
        .on("zoom", zoomed);

    const svg = d3.select("#map_viz")
        .append("svg:svg")
        .attr("viewBox", [0, 0, width, height])
        .on("click", reset);

    // svg.append("text")
    //   .attr("x", width / 2 )
    //   .attr("y", 20)
    //   .style("font-size", "20")
    //   .style("font-weight", "bold")
    //   .style("font-family", "Poppins")
    //   .style("text-anchor", "middle")
    //   .text("U.S. Counties");
    //

//     console.log(topojson.feature(us, us.objects.states).features.filter(function(d) {
//   return d.id == 29;
// })

    const g = svg.append("g");

    var county_names = [{name: "Sullivan County, NY",
                         color: "#254E70"},
                        {name: "Duval County, FL",
                         color: "#C6E0FF"},
                        {name: "Platte County, NE",
                         color: "#00272B"}]

    const counties = g.append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      // .data(topojson.feature(us, us.objects.counties).features.filter(function(d) {
      //   return d.id.startsWith("36") | d.id.startsWith("31") | d.id.startsWith("12");}))
      .join("path")
        .attr("d", path)
        .attr("cursor", "pointer")
        .attr("class", "county-boundary")
        .attr("stroke", function(d) {if (d.id.startsWith("36")) {return "#C4D8F3"}
        else if (d.id.startsWith("12")) {return "#f8d3e7"}
        else if (d.id.startsWith("31")) {return "#91b191"}
        else {return "#fff"}})
        // .attr("stroke", function(d) {if (d.id.startsWith("36")) {return "#254E70"}
        // else if (d.id.startsWith("12")) {return "#C6E0FF"}
        // else if (d.id.startsWith("31")) {return "#00272B"}
        // else {return "#d9d9d9"}})
        .style("fill", function(d) { if (d.id == "36105") {return "#254E70"}
        else if (d.id.startsWith("36")) {return "#C4D8F3"}
        else if (d.id == "12031") {return "#64113F"}
        else if (d.id.startsWith("12")) {return "#f8d3e7"}
        else if (d.id == "31141") { return "#00272B" }
        else if (d.id.startsWith("31")) {return "#91b191"}})
        // .on("mouseover", function(d) { if (d.id == "36105" | d.id == "12031" | d.id == "31141") {d3.select(this).attr("fill", "#fff")}})
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
        // .attr("stroke", function(d) {if (d.id == "36") {return "#C4D8F3"}
        // else if (d.id == "12") {return "#002e66"}
        // else if (d.id == "31") { return "#91b191" }
        // else {return "#cccccc"}})

    // const ny_counties = g.append("g")
    //   .attr("id", "counties")
    //   .attr("cursor", "pointer")
    //   .selectAll("path")
    //   .data(topojson.feature(us, us.objects.counties).features.filter(function(d) {
    //     return d.id.startsWith("12")}))
    //   .join("path")
    //     .attr("d", path)
    //     .attr("class", "county-boundary")
    //     .style("fill", function(d) { if (d.id == "36105") {return "#254E70"}
    //     else if (d.id == "12031") {return "#C6E0FF"}
    //     else if (d.id == "31141") { return "#00272B" }})
    //     .on("click", clickOrReset);

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

        // filter for particular states by FIPS code & make other counties not interactive
      // us.objects.states.filter(function(d) { return d.geometries[0].id == stateID; })
    //   // ids: NY,


    // g.append("path")
    //     .attr("id", "state-borders")
    //     .attr("fill", "none")
    //     .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))
    //     .attr("stroke", function(d) {if (d.id == "36" | d.id == "12" | d.id == "31") {return "#fff"}
    //         else {return "#cccccc"}})
    //     .attr("stroke-linejoin", "round");
    //
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
      // var img = document.getElementById("sullivan_info")
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


        // img.style.display = "block";

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
