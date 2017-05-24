var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#e4e429", "#29e487", "#29e429", "#29e4e4", "#2929e4", "#e42987", "#e42929", "#e48729"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var country = "Australia";
d3.csv("../data/tweets_data.csv", function(d) {
  d.sum = +d.sum;
  d.hour = +d.hour;
  d.emotion = +d.emotion;
  return d;
}, function(error, data) {
  if (error) throw error;

  var byCountry = data.filter(function(d) {
    if (d["country"] == country) {
      return d;
    }
  });
  console.log(byCountry);

  var byEmotion = d3.nest()
    .key(function(d) { return d.emotion; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.sum; }); })
    .entries(byCountry);
  console.log(byEmotion);

  var arc = g.selectAll(".arc")
    .data(pie(byEmotion))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.key); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.value; });
});
