(function() {


  module.exports = function() {

    var data = [100, 31.6];

    var chart = d3.select("#bar")
      .insert("svg", ":first-child")
      .attr("class", "chart")
      .attr("width", 150) // bar has a fixed width
      .attr("height", 20 * data.length);

    var x = d3.scale.linear() 
      .domain([0, d3.max(data)])
      .range([0, 150]); 

    chart.selectAll("rect") // this is what actually creates the bars
      .data(data)
      .enter().append("rect")
      .attr("width", x)
      .attr("height", 20)
      .attr("rx", 5) // rounded corners
      .attr("ry", 5);

    chart.selectAll("text") // adding the text labels to the bar
      .data([data[1]])
      .enter().append("text")
      .attr("x", x)
      .attr("y", 10) // y position of the text inside bar
      .attr("dx", -3) // padding-right
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "end") // text-align: right
      .text(data[1] + '%');

    }
})();
