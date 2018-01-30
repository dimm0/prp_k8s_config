Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

Array.prototype.deleteElement = function(obj) {
    var elm_index = this.indexOf(obj);
    if (elm_index > -1) {
        this.splice(elm_index, 1);
    }
};


var width = window.innerWidth,
    height = window.innerHeight;

// For buttons
var bWidth= 40; //button width
var bHeight= 25; //button height
var bSpace= 10; //space between buttons
var x0= 20; //x offset
var y0= 10; //y offset


var selectedSNode = [], selectedTNode = [];
var attachPoints = [], overNode = null;
        var curColorScale = 0; // throughput

requirejs([
    "//cdnjs.cloudflare.com/ajax/libs/d3/4.11.0/d3.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/topojson/2.0.0/topojson.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/humanize-plus/1.8.2/humanize.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"], function(d3, topojson, humanize, _) {
      d3.json("https://traceroute.nautilus.optiputer.net/graph.json", function(error, graph) {
      // d3.json("graph.json", function(error, graph) {



      var hosts = graph.nodes.filter(function(d, i) {
          return d.type == "primary";
      });

      function usedNodes(allPrimary) {
          return graph.nodes.filter(function(d) {
              if(d.type == "primary" && allPrimary) return true;
              var show_node_s = (selectedSNode.length == 0), show_node_t = (selectedTNode.length == 0);
              for(var i=0; i<selectedSNode.length; i++ ){
                  if(d.source_group.contains(selectedSNode[i].source_group[0]))
                      show_node_s = true;
              }
              for(var i=0; i<selectedTNode.length; i++ ){
                  if(d.target_group.contains(selectedTNode[i].source_group[0]))
                      show_node_t = true;
              }
              return show_node_s && show_node_t;
          });
      }

      function usedEdges() {
          return graph.links.filter(function(d) {
              var show_node_s = (selectedSNode.length == 0), show_node_t = (selectedTNode.length == 0);
              for(var i=0; i<selectedSNode.length; i++ ){
                  if(d.source_group.contains(selectedSNode[i].source_group[0]))
                      show_node_s = true;
              }
              for(var i=0; i<selectedTNode.length; i++ ){
                  if(d.target_group.contains(selectedTNode[i].source_group[0]))
                      show_node_t = true;
              }
              return show_node_s && show_node_t;
          });
      }

      d3.json("https://sentinel.sdsc.edu/lustre-usage/gz_2010_us_040_00_500k_2.json", function(error, mapData) {
          if (error) throw error;
          var svg = d3.select("svg"),
              map = svg.append("g"),
              link = svg.append("g").selectAll(".link"),
              node = svg.append("g").selectAll(".node");

          var linkMode = 0;

          // Tooltip for node names
          var tip = d3.select("#tip")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("top", "0")
              .style("left", "35%")
              .style("width", "30%")
              .style("text-align", "center")
              .style("opacity", "0.9")
              .style("background-color", "rgba(0, 0, 0, 0.8)")
              .style("color", "white")
              .style("padding", "2px")
              .style("border-radius", "3px")
              .style("pointer-events", "none")
              .style("font", "14px helvetica");

          var nodesDiv = d3.select("#nodes")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("top", "0")
              .style("right", "0")
              .style("width", "30%")
              .style("text-align", "center")
              .style("opacity", "0.9")
              .style("background-color", "rgba(0, 0, 0, 0.8)")
              .style("color", "white")
              .style("padding", "2px")
              .style("border-radius", "3px")
              .style("pointer-events", "none")
              .style("font", "14px helvetica");


          svg.append("svg:defs").selectAll("marker")
              .data(["end"])
              .enter().append("svg:marker")
              .attr("id", String)
              .attr("viewBox", "0 -6 12 12")
              .attr("refX", 15)
              .attr("refY", 0)
              .attr("markerUnits", "userSpaceOnUse")
              .attr("markerWidth", 10)
              .attr("markerHeight", 8)
              .attr("orient", "auto")
              .append("svg:path")
              .attr("d", "M0,-6L12,0L0,6");

          svg.append("svg:defs").selectAll("marker")
              .data(["mid"])
              .enter().append("svg:marker")
              .attr("id", String)
              .attr("viewBox", "0 0 5 5")
              .attr("refX", 3)
              .attr("refY", 3)
              .attr("markerUnits", "userSpaceOnUse")
              .attr("markerWidth", 6)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
              .append("svg:rect")
              .attr("x", 1)
              .attr("y", 1)
              .attr("width", 5)
              .attr("height", 5);

          var colorScaleThroughput = d3.scaleThreshold()
              .domain([0, Math.pow(2, 30) * 5, Math.pow(2, 30) * 7.5])
              .range(["rgb(255, 165, 0)", "rgb(255,0,0)", "rgb(255,200,0)", "rgb(0, 182,0)"]);

          var colorScaleLatency = d3.scaleThreshold()
              .domain([40, 100])
              .range(["rgb(0, 182,0)", "rgb(255,200,0)", "rgb(255,0,0)"]);

          var colorScaleRetransmits = d3.scaleThreshold()
              .domain([100, 500])
              .range(["rgb(0, 182,0)", "rgb(255,200,0)", "rgb(255,0,0)"]);

          var features = mapData.features;
          var projection = d3.geoAlbers().fitSize([width, height], mapData);

          var path = d3.geoPath()
              .projection(projection);

          var clusters = {};

          var groups = [];
          hosts.forEach( function(host) {
            if (!groups[host["org"]]) {
              groups[host["org"]] = {nodes: [host], name: host["org"][0]};
            } else {
              groups[host["org"]].nodes.push(host);
            }
          });

          for(var groupkey in groups) {
            if(groups.hasOwnProperty(groupkey)){
              if (groups[groupkey].nodes.length <= 1) {
                delete groups[groupkey];
              } else {
                var r = 4.0*groups[groupkey].nodes.length;
                var circle = svg.append("circle").attr("cx", 0)
                                        .attr("cy", 0)
                                        .attr("r", r)
                                        .style("fill", "none").style("stroke", "grey").style("stroke-width", "2");
                var text = svg.append("text")
                  // .attr("text-anchor", "middle")
                  .style("font", "14px helvetica")
                  .style("font-weight", "bold")
                  .attr("dy", -r+"px")
                  .attr("dx", r+"px")
                  .text(groups[groupkey].name);
                circle.text = text;

                circle.nodesnum = groups[groupkey].nodes.length;
                groups[groupkey]["circle"] = circle;
                var nodeNumInCircle = 0;
                groups[groupkey].nodes.forEach( function(host) {
                  host.circle = circle;
                  host.nodeNumInCircle = nodeNumInCircle++;
                });
              }
            }
          }

          //https://gist.github.com/krosenberg/989204175f68f40dfe3b#file-index-html
          var circleCoord = function(node){
              var circle = node.circle;
              var circumference = circle.node().getTotalLength();
              var pointAtLength = function(l){return circle.node().getPointAtLength(l)};
              var sectionLength = (circumference)/circle.nodesnum;
              var position = sectionLength*node.nodeNumInCircle+sectionLength/2;
              return pointAtLength(circumference-position)
          }

          hosts.forEach(function(d, i) {
              if(!clusters[d.as])
                  clusters[d.as] = d;
          });

          map.selectAll('path')
              .data(features)
              .enter().append('path')
              .attr('d', path)
              .attr('class', 'map')
              .style('fill', "white")
              .style('stroke', 'grey');

          var nodes = usedNodes(true);
          var edges = usedEdges();

          var maxLat = 0;
          for(var i=0; i<edges.length; i++){
              if(edges[i].latency > 0 && edges[i].latency > maxLat)
                  maxLat = edges[i].latency;
          }
          document.maxLat = maxLat;

          function clustering(alpha) {
              nodes.forEach(function(d) {
                var cluster = clusters[d["as"]];
                if (!cluster || cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = 4+4;
                if (l != r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                }
              });
          }

          var forces = {
              //"collide": d3.forceCollide(4),
              "manybody": d3.forceManyBody(-2).distanceMax(40),
              "cluster": null,
              "link": d3.forceLink(edges).id(function(d, i) {
                          return i;
                      })
                     .distance(function(d) {
                         var scaleLatency = d3.scaleLinear()
                              .domain([0, maxLat])
                              .range([0,50]);
                         document.scaleLatency = scaleLatency;
                         return scaleLatency(d.latency);
                     })
                     .strength(0.05)
          };
          document.forces = forces;
          document.clustering = clustering;

          var simulation = d3.forceSimulation(nodes);
          simulation.alphaDecay(1-Math.pow(0.001,1/10)); // 1-Math.pow(0.001,1/300) is default for 300 iterations
          document.simulation = simulation;

          for(var forcename in forces) {
              simulation.force(forcename, forces[forcename]);
          }

          simulation.on("tick", function() {
              node.attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
              });

              link.attr("d", function(d) {
                  var dx = d.target.x - d.source.x,
                      dy = d.target.y - d.source.y,
                      dr = 1.5*Math.sqrt(dx * dx + dy * dy);
                  return "M" +
                      d.source.x + "," +
                      d.source.y + "A" +
                      dr + "," + dr + " 0 0,1 " +
                      d.target.x + "," +
                      d.target.y;
              });
          });

          var d3_geom_voronoi = d3.voronoi().x(function(d) { return d.point.x; }).y(function(d) { return d.point.y; });
          reload();

          var transform = d3.zoomIdentity
              .translate(projection.translate()[0], projection.translate()[1])
              .scale(projection.scale());
          var mapzoom = d3.zoom()
              .scaleExtent([500, 340000])
              .on("zoom", function() {
                  var transform = d3.zoomTransform(this);
                  projection.translate([transform.x, transform.y]).scale(transform.k);
                  d3.selectAll('path.map').attr('d', path);

                  for(var groupkey in groups) {
                    if(groups.hasOwnProperty(groupkey)){
                      var group = groups[groupkey];
                      var d = group.nodes[0];
                      var pix_coord = projection([d.lon, d.lat]);
                      group.circle.attr("cx", pix_coord[0]);
                      group.circle.attr("cy", pix_coord[1]);
                      group.circle.text.attr("x", pix_coord[0]);
                      group.circle.text.attr("y", pix_coord[1]);
                    }
                  };
                  hosts.forEach(function(d, i) {
                    if (d.circle) {
                      var coord = circleCoord(d);
                      d.fx = coord.x;
                      d.fy = coord.y;
                    } else {
                      var pix_coord = projection([d.lon, d.lat]);
                      d.fx = pix_coord[0];
                      d.fy = pix_coord[1];
                    }
                  });
              })
              .on("end", function() {
                  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
              });

          svg.call(mapzoom.transform, transform);
          svg.call(mapzoom);

          mapzoom.translateBy(svg, 0.12, -0.25);
          mapzoom.scaleBy(svg, 8);

          d3.select(window).on("resize", function() {
              width = window.innerWidth, height = window.innerHeight;
              svg.attr("width", width).attr("height", height);
          });


          svg
              .on("click", function(cd) {
                  if(overNode){
                      var overNodeData = d3.select(overNode);
                      var overNodeDatum = overNodeData.datum();
                      if(overNodeDatum.source) {
                          vex.dialog.alert("Edge: "+overNodeDatum.source.id + " "+overNodeDatum.target.id);
                      } else {
                          if(overNodeDatum.type == "primary"){
                              if (d3.event.altKey) {
                                  if(selectedTNode.contains(overNodeDatum)){
                                      selectedTNode.deleteElement(overNodeDatum);
                                  } else {
                                      selectedTNode.push(overNodeDatum);
                                  }
                              } else {
                                  if(selectedSNode.contains(overNodeDatum)){
                                      selectedSNode.deleteElement(overNodeDatum);
                                  } else {
                                      selectedSNode.push(overNodeDatum);
                                  }
                              }

                              nodes = usedNodes(true);
                              edges = usedEdges();

                              reload();

                              node
                                  .filter(function(d) { return (d.type == "primary")})
                                  .select("circle")
                                  .attr("fill", "black");

                              node
                                  .filter(function(d) {
                                      if(d.type == "primary"){
                                          for(var i=0; i<selectedSNode.length; i++)
                                              if(selectedSNode[i].source_group[0] === d.source_group[0]) return true;
                                          return false;
                                      }
                                  })
                                  .select("circle")
                                  .attr("fill", "orange");

                              node
                                  .filter(function(d) {
                                      if(d.type == "primary"){
                                          for(var i=0; i<selectedTNode.length; i++)
                                              if(selectedTNode[i].source_group[0] === d.source_group[0]) return true;
                                          return false;
                                      }
                                  })
                                  .select("circle")
                                  .attr("fill", "pink");
                          } else {
                              vex.dialog.alert("Node name: "+overNodeDatum.id);
                          }
                      }
                  }
              });



          function reload() {
              node = node.data(nodes, function(d) { return d.id;});
              node.exit().remove();
              var g = node.enter()
                  .append("g")
                  .attr("class", "node")
                  .style("cursor", "pointer");

              g.append("circle")
                  .attr("r", 4)
                  .attr("fill", function(d) {
                      return (d.type == "primary") ? "black" : "blue";
                  });
              g.filter(function(d) {
                  return d.type == "primary" && !d.circle;
              })
              .append("text")
                  .attr("text-anchor", "middle")
                  .style("font", "14px helvetica")
                  .attr("dy", "-.5em")
                  .text(function(d) {
                      var as_str = (d.as)?(" (as"+d.as+")"):"";
                      return d.id+as_str
                  });
              node = g.merge(node);

              link = link.data(edges, function(d) { return d.source.id + "-" + d.target.id; });
              link.exit().remove();
              link = link.enter().append("path")
                  .attr("marker-mid", "url(#mid)")
                  .attr("marker-end", "url(#end)")
                  .attr("stroke-width", "1.5")
                  .attr("stroke-dasharray", function(d) {
                      return d.flap_route?"5,5":""
                  })
                  .style("fill", "none")
                  .attr("stroke", function(d) {
                      switch(curColorScale){
                          case 0:
                              return colorScaleThroughput(d.throughput);
                          case 1:
                              return colorScaleLatency(d.latency);
                          case 2:
                              return colorScaleRetransmits(d.retransmits);
                      }
                  }).merge(link);

              svg.on("touchmove mousemove", function() {
                  var m = d3.mouse(this);

                  attachPoints = [];

                  node.each(function(item){
                     attachPoints.push({point: {"x": item.x, "y": item.y}, node: this});
                  })

                  link.each(function(p,j){
                      var curnode = d3.select(this).node();
                      var point = curnode.getPointAtLength( curnode.getTotalLength()/2 );
                      attachPoints.push({point: point, node: this});
                  });

                  var found = d3_geom_voronoi(attachPoints).find(m[0],m[1]);
                  if (found){
                      var item_found = found.data.node;

                      if(overNode === item_found)
                          return;

                      svg.selectAll("path.overed").classed(".overed",false).attr("stroke-width",1.5);
                      node.selectAll(".overed").classed(".overed",false).attr("r", "4");

                      var item_select = d3.select(item_found);
                      var d = item_select.datum();
                      switch(item_found.nodeName){
                          case "path":
                              d3.select(item_found)
                                  .attr("stroke-width", 5)
                                  .classed("overed", true);

                              tip.html("<b>"+d.source.id+" - "+d.target.id + "</b><br/>"+
                                       "lat: "+((d.latency != -1)?(humanize.formatNumber(d.latency)+"ms"):"unknown")+
                                       "; throughput: "+((d.throughput != -1)?(humanize.fileSize(d.throughput)+"/s"):"unknown")+
                                       "; retransmits: "+((d.retransmits != -1)?(humanize.intComma(d.retransmits)):"unknown"));

                              var participatingNodes = [];
                              var usedNodesCur = usedNodes(false);
                              for(var j = 0; j<d.source_group.length; j++) {
                                  for(var i=0; i<usedNodesCur.length; i++){
                                      if(usedNodesCur[i].type=="primary" && usedNodesCur[i].source_group.contains(d.source_group[j]))
                                          participatingNodes.push(usedNodesCur[i]);
                                  }
                              }
                              for(var j = 0; j<d.target_group.length; j++) {
                                  for(var i=0; i<usedNodesCur.length; i++){
                                      if(usedNodesCur[i].type=="primary" && usedNodesCur[i].source_group.contains(d.target_group[j]))
                                          participatingNodes.push(usedNodesCur[i]);
                                  }
                              }
                              nodesDiv.html("<b>Nodes having path through the segment:</b><br/>"+window._.uniq(participatingNodes.map(function(d) {
                                  return d.id
                              })).sort().join("<br/>"));

                              break;
                          case "g":
                              item_select.select("circle")
                                  .classed("overed", true)
                                  .attr("r", 6);
                              var as_str = (d.as)?(" (as"+d.as+")"):"";
                              tip.html(d.id+as_str);
                              nodesDiv.html("");
                              break;
                      }
                      overNode = item_found;

                  }
              });

              node.filter(function(d) {
                      return d.type == "";
                  })
                  .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));

              simulation.nodes(nodes);
              simulation.force("link").links(edges);
              simulation.alpha(1).restart();

  //             link = link.data(edges);
  //             link.exit().remove();
  //             link = link.enter().append("path")
  //                 .attr("marker-mid", "url(#mid)")
  //                 .attr("marker-end", "url(#end)")
  //                 .attr("stroke-width", "1.5")
  //                 .style("fill", "none")
  //                 .attr("stroke", function(d) {
  //                     return colorScaleThroughput(d.throughput)
  //                 }).merge(link);

              node.filter(function(d) {
                  return d.type == "primary";
              })
              .select("text")
              .attr("opacity",function(d) {
                  if(selectedSNode.length + selectedTNode.length == 0)
                      return 1; // All labels not dimmed when no nodes selected
                  for(var i=0; i<selectedSNode.length; i++)
                      if(selectedSNode[i].source_group[0] === d.source_group[0])
                          return 1;
                  for(var i=0; i<selectedTNode.length; i++)
                      if(selectedTNode[i].source_group[0] === d.source_group[0])
                          return 1;
                  return 0.2;
              });

      };


      function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
      }

      function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
      }


      var allButtons= svg.append("g")
                  .attr("id","allButtons")

      //fontawesome button labels
      var labels= [{'icon': '\uf061', 'title':'Bandwidth'},{'icon': '\uf017', 'title':'Latency'}, {'icon': '\uf0ec', 'title':'Retransmits'}];
      var defaultColor= "#7777BB";
      var hoverColor= "#0000ff";
      var pressedColor= "#000077";

      var buttonGroups= allButtons.selectAll("g.button")
          .data(labels)
          .enter()
          .append("g")
          .attr("class","button")
          .style("cursor","pointer")
          .on("click",function(d,i) {
              d3.event.stopPropagation();
              updateButtonColors(d3.select(this), d3.select(this.parentNode));
              curColorScale = i;
              switch(i){
                  case 0:
                      link
                          .attr("stroke", function(d) {
                              return colorScaleThroughput(d.throughput)
                          });
                      break;
                  case 1:
                      link
                          .attr("stroke", function(d) {
                              return colorScaleLatency(d.latency)
                          });
                      break;
                  case 2:
                      link
                          .attr("stroke", function(d) {
                              return colorScaleRetransmits(d.retransmits)
                      });
                      break;
              }
          })
          .on("mouseover", function() {
              if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                  d3.select(this)
                      .select("rect")
                      .attr("fill",hoverColor);
              }
          })
          .on("mouseout", function() {
              if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                  d3.select(this)
                      .select("rect")
                      .attr("fill",defaultColor);
              }
          });

      buttonGroups.append("rect")
          .attr("class","buttonRect")
          .attr("width",bWidth)
          .attr("height",bHeight)
          .attr("x",function(d,i) {return x0+(bWidth+bSpace)*i;})
          .attr("y",y0)
          .attr("rx",5) //rx and ry give the buttons rounded corners
          .attr("ry",5)
          .attr("fill", function(d,i) {return (i == linkMode)?pressedColor:defaultColor})
          .append("title").text(function(d) {return d.title;});

      buttonGroups.append("text")
          .attr("class","buttonText")
          .attr("font-family","FontAwesome")
          .attr("x",function(d,i) {
              return x0 + (bWidth+bSpace)*i + bWidth/2;
          })
          .attr("y",y0+bHeight/2)
          .attr("text-anchor","middle")
          .attr("dominant-baseline","central")
          .attr("fill","white")
          .text(function(d) {return d.icon;})
          .append("title").text(function(d) {return d.title;});

      function updateButtonColors(button, parent) {
          parent.selectAll("rect")
                  .attr("fill",defaultColor)

          button.select("rect")
                  .attr("fill",pressedColor)
      };

  });
});
});

function handleClusterClick(cb) {
    if(cb.checked)
        document.simulation.force("cluster", document.clustering);
    else
        document.simulation.force("cluster", null);
}

requirejs([
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/bootstrap-slider.min.js"
    ], function(slider) {
        $("#strength").bootstrapSlider({tooltip: 'always'});
        $("#strength").on("slideStop", function(slideEvt) {
            document.forces["manybody"].
                strength(slideEvt.value)
        });
        $("#dist").bootstrapSlider({tooltip: 'always'});
        $("#dist").on("slideStop", function(slideEvt) {
            document.forces["manybody"].
                distanceMax(slideEvt.value)
        });
        $("#link_strength").bootstrapSlider({tooltip: 'always'});
        $("#link_strength").on("slideStop", function(slideEvt) {
            document.forces["link"].
                strength(slideEvt.value)
        });
        $("#link_dist").bootstrapSlider({tooltip: 'always'});
        $("#link_dist").on("slideStop", function(slideEvt) {
            document.forces["link"].
               distance(function(d) {
                   var scaleLatency = document.scaleLatency.copy()
                        .domain([0, document.maxLat])
                        .range([0,slideEvt.value]);
                   return scaleLatency(d.latency);
               })
        });
    });
