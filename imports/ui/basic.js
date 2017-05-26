var data = [{
        "sale": "102",
        "year": "0"
    }, {
        "sale": "215",
        "year": "2"
    }, {
        "sale": "179",
        "year": "4"
    }, {
        "sale": "199",
        "year": "6"
    }, {
        "sale": "134",
        "year": "8"
    }, {
        "sale": "176",
        "year": "0"
    }];
var data2 = [{
        "sale": "152",
        "year": "0"
    }, {
        "sale": "189",
        "year": "2"
    }, {
        "sale": "179",
        "year": "4"
    }, {
        "sale": "199",
        "year": "6"
    }, {
        "sale": "134",
        "year": "8"
    }, {
        "sale": "176",
        "year": "0"
    }];
var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    },
    xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 23]),
    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 200]),
    xAxis = d3.svg.axis()
    .scale(xScale),
    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

vis.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);
var lineGen = d3.svg.line()
    .x(function (d) {
        return xScale(d.year);
    })
    .y(function (d) {
        return yScale(d.sale);
    })
    .interpolate("basis");
vis.append('svg:path')
    .attr('d', lineGen(data))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
vis.append('svg:path')
    .attr('d', lineGen(data2))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
