// reusable Line Graph
var LineGraph = function () {
    // Set default values
    var height = 500,
        width = 500,
        xScale = d3.scaleLinear(),
        // xScale = d3.scaleTime().rangeRound([0, width]);
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        title = 'Chart title',
        stroke = 'steelblue',
        margin = {
            left: 70,
            bottom: 50,
            top: 30,
            right: 10,
        };

    // Function returned by LineGraph
    var chart = function (selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // Iterate through selections, in case there are multiple
        selection.each(function (data) {
            var data = data.values;

            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            // Append static elements (i.e., only added once)
            var svgEnter = svg.enter()
                .append("svg")
                .attr('width', width)
                .attr("height", height);

            // Title G
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('class', 'chart-title')

            // g element for lines
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr("class", 'chartG');

            // Append axes to the svgEnter element
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'axis x');

            svgEnter.append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x');

            // Add a title g for the y axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('class', 'title y');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(d3.format('d'));
            var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));

            // Calculate x and y scales
            // var xMax = d3.max(data, (d) => +d.x) * 1.01;
            // var xMin = d3.min(data, (d) => +d.x) * .99;
            var xMax = d3.max(data, (d) => +d.x);
            var xMin = d3.min(data, (d) => +d.x);
            xScale.range([0, chartWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d.y) * .95;
            var yMax = d3.max(data, (d) => +d.y) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);

            // Update axes
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.axis.x').transition().duration(1000).call(xAxis);
            ele.select('.axis.y').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.title.x').text(xTitle)
            ele.select('.title.y').text(yTitle)

            var line = d3.line()
                .x(function (d) { console.log(d); return xScale(d.x); })
                .y(function (d) { return yScale(d.y); });

            // xScale.domain(d3.extent(data, function (d) { return d.xVar; }));
            // yScale.domain(d3.extent(data, function (d) { return d.yVar; }));

            // Draw lines
            var lines = ele.select('.chartG').selectAll('path')
                .data(data, function (d) {
                    d.xVar = d.xVar;
                    d.yVar = d.yVar;
                    return d.key
                });

            // Use the .enter() method to get entering elements
            lines.enter().append('path')
                .attr('class', 'line')
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                // .attr("d", line);
                //.attr('d',data, function (d) {console.log(d.value); return line(d.value) });
                // .attr('d', line);
                .attr('fill', 'none')
                .attr('d', line(data));

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            lines.exit().remove();
        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };
    chart.xTitle = function (value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function (value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };

    chart.title = function (value) {
        if (!arguments.length) return title;
        title = value;
        return chart;
    };

    return chart;
};