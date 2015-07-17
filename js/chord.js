// Chord handles the D3 display of a chord diagram
window.Chord = new function () {
    var timer = null;

    //setup and display the chord diagram
    this.init = function (data) {
        // as there are no transitions for the chord, each time it is updated
        // it just draws a new chord from scratch
        this.update(data);
    };

    function drawChords(matrix, mmap) {
        var w = $('#chord-diagram').width();
        var h = $('#chord-diagram').height();
        var r1 = Math.min(h, w) / 2.15, r0 = r1 - 100;
        var innerRadius = Math.min(w, h) * .3,
            outerRadius = innerRadius * 1.1;
        var sourceIndex = -1;

        var fill = function (team) {
            return Data.getTeams()[rdr(team).gname].color;
        }

        var chordFill = function(data) {
            if (data.source.value == data.target.value) {
                return '#AFAFAF';
            } else {
                return fill(data.source);
            }
        }

        var logo = function (team) {
            return Data.getTeams()[rdr(team).gname].logo;
        }

        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);
        var svg = d3.select("#chord-diagram")
        .append('svg')
          .attr("width", w)
          .attr("height", h)
        .append("svg:g")
          .attr("id", "circle")
          .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var rdr = chordRdr(matrix, mmap);

        chord.matrix(matrix);

        var g = svg.selectAll("g.group")
            .data(chord.groups())
          .enter().append("svg:g")
            .attr("class", "group")
          .on("mouseover", mouseover)
         .on("mouseout", function (d) { hideTip(); d3.select("#tooltip").style("visibility", "hidden");});

        g.append("svg:path")
            .style("stroke", "black")
            .style("fill", function (d) { return fill(d); })
            .attr("d", arc);

        g.append("svg:image")
            .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("transform", function (d) {
                if (d.angle > Math.PI) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 82) + ")"
                     + (d.angle * 180 / Math.PI - 90 > 90 ? "translate(" + (r0 + 110) + ")" : "translate(" + (r0 + 26) + ")")
                    + (d.angle > Math.PI ? "rotate(180)" : "rotate(0)");
                }
                return "rotate(" + (d.angle * 180 / Math.PI - 98) + ")"
                     + (d.angle * 180 / Math.PI - 90 >90 ? "translate(" + (r0 + 26) + ")" : "translate(" + (r0 + 26) + ")")
                    + (d.angle > Math.PI ? "rotate(180)" : "rotate(0)");
            }).attr("width", "90px").attr("height", "85px")
   .attr("xlink:href", function (d) { return logo(d); });


        var chordPaths = svg.selectAll("path.chord")
              .data(chord.chords())
            .enter().append("svg:path")
              .attr("class", "chord")
              .style("stroke", function (d) { return d3.rgb(fill(d.source)).darker(); })
              .style("fill", function (d) { return chordFill(d); })
              .attr("d", d3.svg.chord().radius(r0))
              .on("mouseover", function (d) {
                  showChordTip();
                  if(d.source.index==sourceIndex || d.target.index == sourceIndex){
                      d3.select("#tooltip")
                        .style("visibility", "visible")
                        .html(chordTip(rdr(d)))
                        .style("top", function () { return (d3.event.pageY - 100) + "px" })
                        .style("left", function () { return (d3.event.pageX - 100) + "px"; })
                  }
              })
              .on("mouseout", function (d) { hideTip(); d3.select("#tooltip").style("visibility", "hidden") });

        function chordTip(d) {
            var p = d3.format(".1%"), q = d3.format(",.3r")
            return d.sname + " vs " + d.tname + ":<br/>"
          + d.sname + " scored " + ((d.svalue) - (d.tvalue)) + " more goals than <br/> " + d.tname + " in their games against them ("
                    + (d.svalue) + "-" + (d.tvalue) + ")";
        }

        function groupTip(d) {
            var p = d3.format(".1%"), q = d3.format(",.3r")
            return d.gname + " Info:<br/>"
                +" Scored " + q(d.gvalue) + " (" +
            p(d.gvalue / d.mtotal) + ") of the total goals <br/> scored across all teams (" + (d.mtotal) + ")";
        }

        function mouseover(d, i) {
            showTeamTip();
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(groupTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 80) + "px" })
              .style("left", function () { return (d3.event.pageX - 130) + "px"; })
            chordPaths.classed("fade", function (p) {
                sourceIndex = i;
                return p.source.index != i
                    && p.target.index != i;
            });
        }

    }

    // draw the chord diagram from the given data
    this.update = function (data) {
        $('#chord-diagram').html('');
        var mpr = chordMpr(data);
        mpr
            .addValuesToMap('team')
            .setFilter(function (row, a, b) {
                return (row.team === a.name && row.opponent === b.name)
            })
            .setAccessor(function (recs, a, b) {
                if (!recs[0]) return 0;
                return +recs[0].score;
            });
        drawChords(mpr.getMatrix(), mpr.getMap());
     };

    function chordMpr(data) {
        var mpr = {}, mmap = {}, n = 0,
            matrix = [], filter, accessor;

        mpr.setFilter = function (fun) {
            filter = fun;
            return this;
        },
        mpr.setAccessor = function (fun) {
            accessor = fun;
            return this;
        },
        mpr.getMatrix = function () {
            matrix = [];
            _.each(mmap, function (a) {
                if (!matrix[a.id]) matrix[a.id] = [];
                _.each(mmap, function (b) {
                    var recs = _.filter(data, function (row) {
                        return filter(row, a, b);
                    })
                    matrix[a.id][b.id] = accessor(recs, a, b);
                });
            });
            return matrix;
        },
        mpr.getMap = function () {
            return mmap;
        },
        mpr.printMatrix = function () {
            _.each(matrix, function (elem) {
            })
        },
        mpr.addToMap = function (value, info) {
            if (!mmap[value]) {
                mmap[value] = { name: value, id: n++, data: info }
            }
        },
        mpr.addValuesToMap = function (varName, info) {
            var values = _.uniq(_.pluck(data, varName));
            _.map(values, function (v) {
                if (!mmap[v]) {
                    mmap[v] = { name: v, id: n++, data: info }
                }
            });
            return this;
        }
        return mpr;
    }

    //*******************************************************************
    //  CHORD READER
    //*******************************************************************
    function chordRdr(matrix, mmap) {
        return function (d) {
            var i, j, s, t, g, m = {};
            if (d.source) {
                i = d.source.index; j = d.target.index;
                s = _.where(mmap, { id: i });
                t = _.where(mmap, { id: j });
                m.sname = s[0].name;
                m.sdata = d.source.value;
                m.svalue = +d.source.value;
                m.stotal = _.reduce(matrix[i], function (k, n) { return k + n }, 0);
                m.tname = t[0].name;
                m.tdata = d.target.value;
                m.tvalue = +d.target.value;
                m.ttotal = _.reduce(matrix[j], function (k, n) { return k + n }, 0);
            } else {
                g = _.where(mmap, { id: d.index });
                m.gname = g[0].name;
                m.gdata = g[0].data;
                m.gvalue = d.value;
            }
            m.mtotal = _.reduce(matrix, function (m1, n1) {
                return m1 + _.reduce(n1, function (m2, n2) { return m2 + n2 }, 0);
            }, 0);
            return m;
        }
    }

    var showChordTip = function() {
        timer = setTimeout(function() {
            $('#tip span').html($('#chord-tip').html());
            $('#tip').removeClass('hide');
        }, 1000);
    }

    var showTeamTip = function() {
        timer = setTimeout(function() {
            $('#tip span').html($('#team-tip').html());
            $('#tip').removeClass('hide');
        }, 1000);
    }

    var hideTip = function() {
        clearTimeout(timer);
        $('#tip').addClass('hide');
    }
};