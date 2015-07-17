// Pie handles the D3 display of a pie chart
window.Pie = new function() {
  var canvas,
      canvas2,
      pie,
      arc,
      compareArc,
      info,
      info2;

  var dataMap = {
    'Home Match: Win': {
      text: 'Home Games Won: ',
      arcClass: 'home-game game-win',
    },
    'Home Match: Loss': {
      text: 'Home Games Lost: ',
      arcClass: 'home-game game-loss',
    },
    'Away Match: Win': {
      text: 'Away Games Won: ',
      arcClass: 'away-game game-win',
    },
    'Away Match: Loss': {
      text: 'Away Games Lost: ',
      arcClass: 'away-game game-loss',
    },
  }

  // set up the Pie chart and draw it
  this.init = function(data, dataCompare) {
    var canvasWidth = $('#pie-chart').width(),
    canvasHeight = $('#pie-chart').height(),
    pieRadius = (Math.min(canvasHeight, canvasWidth) / 2) * 0.9;

    var canvasWidth2 = $('#second-pie').width(),
    canvasHeight2 = $('#second-pie').height(),
    pieRadius2 = (Math.min(canvasHeight2, canvasWidth2) / 2) * 0.9;

    arc = d3.svg.arc()
      .outerRadius(pieRadius)
      .innerRadius(pieRadius * 0.75);

    compareArc = d3.svg.arc()
      .outerRadius(pieRadius2)
      .innerRadius(pieRadius2 * 0.5);

    pie = d3.layout.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    canvas = d3.select('#pie-chart')
      .append('svg')
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
      .append('g')
        .attr('transform', 'translate(' + canvasWidth / 2 + ',' + canvasHeight / 2 + ')');

    canvas2 = d3.select('#second-pie')
      .append('svg')
        .attr('width', canvasWidth2)
        .attr('height', canvasHeight2)
      .append('g')
        .attr('transform', 'translate(' + canvasWidth2 / 2 + ',' + canvasHeight2 / 2 + ')');

    var arcs = canvas.selectAll('.arc')
        .data(pie(data))
      .enter().append('g')
        .attr('class', 'arc');

    var arcs2 = canvas2.selectAll('.arc')
        .data(pie(dataCompare))
      .enter().append('g')
        .attr('class', 'arc');

    hoveredArc = d3.svg.arc()
      .outerRadius(pieRadius + 20)
      .innerRadius(pieRadius * 0.70);

    arcs.append('path')
        .each(function(d) { this._current = d; })
        .on('mouseenter', function(d) {
          info.select('#stats')
              .text(dataMap[d.data.type].text + d.data.count)
              .transition(500);

          d3.select(this)
            .transition()
              .duration(500)
              .attr('d', hoveredArc)
              .transition(500);
        })
        .on('mouseleave', function(d) {
          info.select('#stats')
              .text('');

          d3.select(this)
            .transition()
              .duration(500)
              .attr('d', arc);
        });

    arcs2.append('path')
        .each(function(d) { this._current = d; });

    info = canvas.append('g');

    info2 = canvas2.append('g');

    this.update(data);
    this.updateCompare(dataCompare);
  };

  // update the pie chart with new data and animate transition
  this.update = function(data) {
    canvas.selectAll('path')
        .data(pie(data))
        .attr('d', arc)
        .attr('class', function(d) { return dataMap[d.data.type].arcClass; })
        .attr('fill', function(d) { return arcFill(d); })
        .attr('stroke', function(d) { return arcStroke(d); })
        .transition().duration(750).attrTween("d", arcTween); // redraw the arcs

    info.selectAll('*')
        .remove();

    info.append('svg:image')
        .attr("xlink:href", function (d) { return logo(d); })
        .attr("width", "200px").attr("height", "150px")
        .attr('transform', 'translate(-100,-150)');

    info.append('svg:text')
        .attr('text-anchor', 'middle')
        .text(function() { return 'PLAYED ' + d3.sum(data, function(d){return d.count;}) + ' GAMES';})
        .attr('font-size', '2em')
        .attr('font-weight', 'bold')
        .attr('fill', '#009BEE')
        .attr("width", "200px").attr("height", "150px")
        .attr('transform', 'translate(0,40)');

    info.append('svg:text')
        .attr('id', 'stats')
        .attr('text-anchor', 'middle')
        .text('')
        .attr('font-size', '1.8em')
        .attr('fill', '#EB007E')
        .attr("width", "200px").attr("height", "150px")
        .attr('transform', 'translate(0,70)');
  };

  this.updateCompare = function(data) {
    canvas2.selectAll('path')
        .data(pie(data))
        .attr('d', compareArc)
        .attr('class', function(d) { return dataMap[d.data.type].arcClass; })
        .attr('fill', function(d) { return arcFillCompare(d); })
        .attr('stroke', function(d) { return arcStrokeCompare(d); })
        .transition().duration(750).attrTween("d", arcTweenCompare); // redraw the arcs

    info2.selectAll('*')
        .remove();

    info2.append('svg:image')
        .attr("xlink:href", function (d) { return logoCompare(d); })
        .attr("width", "100px").attr("height", "75px")
        .attr('transform', 'translate(-50,-37)');
  };

  // PRIVATE

  var statsText = function(d) {
    var type = d.data.type;
    return d.data.type + ': ' + d.data.count;
  }

  var logo = function(d) {
    return Data.getTeams()[PieController.getSelectedTeam()].logo;
  };

  var logoCompare = function(d) {
    return Data.getTeams()[PieController.getComparedTeam()].logo;
  };

  var arcFill = function(d) {
    var team = PieController.getSelectedTeam();
    var type = d.data.type;

    if (type.indexOf('Win') > -1) {
      return Data.getTeams()[team].color;
    } else {
      return '';
    }
  };

  var arcStroke = function(d) {
    var team = PieController.getSelectedTeam();
    var type = d.data.type;

    if (type.indexOf('Home') > -1) {
      return Data.getTeams()[team].colorComplement;
    } else {
      return '';
    }
  };

  var arcFillCompare = function(d) {
    var team = PieController.getComparedTeam();
    var type = d.data.type;

    if (type.indexOf('Win') > -1) {
      return Data.getTeams()[team].color;
    } else {
      return '';
    }
  };

  var arcStrokeCompare = function(d) {
    var team = PieController.getComparedTeam();
    var type = d.data.type;

    if (type.indexOf('Home') > -1) {
      return Data.getTeams()[team].colorComplement;
    } else {
      return '';
    }
  };

  // ===============================================================
  //
  // THE FOLLOWING CODE IS FROM: http://bl.ocks.org/mbostock/1346410
  // (modified slightly for arcTweenCompare)
  //

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  var arcTween = function(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  };

  var arcTweenCompare = function(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return compareArc(i(t));
    };
  };
};
