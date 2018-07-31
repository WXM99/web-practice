
    var svg = d3.select("svg"),
        margin = 20,
        diameter = +svg.attr("width"),
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
        .domain([-1, 1])
        .range(["hsl(0,70%,100%)", "hsl(160,60%,80%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(5);

    d3.json("gdp.json", function(error, root) {
      if (error) throw error;

      root = d3.hierarchy(root)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });

      var focus = root,
          nodes = pack(root).descendants(),
          view;

      var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
          .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
          .style("fill", function(d) { return color(d.depth)  })
          .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

      var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text").style("font-size", function(d) {return getNodeSize(d)})
          .attr("class", "label")
          .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
          .style("fill", "#fff")
          .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
          .text(function(d) { return d.data.name; });

      var node = g.selectAll("circle,text");

      svg
          .style("background", color(-1))
          .on("click", function() { zoom(root); });

      zoomTo([root.x, root.y, root.r * 2 + margin]);
      
      function getNodeSize(d){
        var size1
          if(d.depth ==1 ){
            return 20+2*d.data.size + "px";
          }else if(d.depth ==2){
            if(d.data.name == "南非0.5"|| d.data.name == "尼日利亚0.4" 
            || d.data.name == "诶及0.3"){
              return 120*d.data.size + "px";
            }else if(d.data.name == "巴西2.1"||d.data.name == "阿根廷0.6"){
              return 60*d.data.size + "px";
            }else if(d.data.name == "澳大利亚1.3"||d.data.name == "新西兰0.2"){
              return 20+40*d.data.size + "px";
            }
            return 10+6*d.data.size + "px";
          }else if(d.depth ==3){
            return 40*d.data.size + "px";
          }
          
      }
      function zoom(d) {
        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });

        transition.selectAll("text")
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }
    });
