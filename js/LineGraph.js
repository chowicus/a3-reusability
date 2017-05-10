// Script for drawing interactive line chart
// $(function () {
//     'use strict';

var LineGraph = function() { // needs an }
    /* ********************************** Initial graph settings  ********************************** */
    // SVG width and height
    var width = 960;
        height = 500;
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'Year',
        yTitle = 'CO2 Emissions (in units of kilotonne CO2 equivalent)',
        title = 'Chart title', // change this to the chart's title
        fill = 'green',
        radius = 6,    
    // Graph margin settings
        margin = {
        top: 10,
        right: 120,
        bottom: 50,
        left: 80,
    };

    // Set default countries
    var selectedCountries = ["Australia", "Austria"];
    var selectedData = [];

    // function returned by LineGraph
    var chart = function(selection) { // needs an }
        // Graph width and height - accounting for margins
        var drawWidth = width - margin.left - margin.right;
        var drawHeight = height - margin.top - margin.bottom;

        // Iterate through selections, in case there are multiples
        selection.each(function(data) { //will this be needed ) 
            var data = data.values;
            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]); 
            
            /* ********************************** Append static elements  ********************************** */
            // Append svg to hold elements
            var svgEnter = svg.enter()
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Title
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('class', 'chart-title')            

            // Append g for holding chart markers
            svgEnter.append("g")
                .attr('id', 'graph')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // xAxis labels
            svgEnter.append("g")
                .attr('transform', 'translate(0,' + drawHeight + ')')
                .attr('class', 'axis x')

            // xAxis Text
            svgEnter.append('text')
                .attr('class', 'title x')
                .attr('transform', 'translate(' + (drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
                .style('text-anchor', 'middle')
                //.text("Year")

            // yAxis labels
            svgEnter.append("g")
                .attr('class', 'axis y')

            // yAxis Text
            svgEnter.append('text')
                .attr('class', 'title y')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left)
                .attr('x', 0 - (drawHeight / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                //.text("CO2 Emissions (in units of kilotonne CO2 equivalent)")

            // Apend an overlay rectangle to catch hover events
            svgEnter.append('rect')
                .attr("class", "overlay")
                .attr('width', drawWidth)
                .attr('height', drawHeight)

            
            setScales();
            setAxes();

            // Update titles
            ele.select('.title.x').text(xTitle)
            ele.select('.title.y').text(yTitle)

    // // Load data in using d3's csv function // move to main.js
    // d3.csv('data/un_co2_data.csv', function (error, data) {

    //     /* ********************************** Data prep  ********************************** */

    //     // Nest the data by `country_area` to create an **array of objects**, one for each **country**
    //     var dataByCountry = d3.nest()
    //         .key(function (d) {
    //             return d.country_area;
    //         })
    //         .entries(data);

    //     // Get a unique list of countries to make selector
    //     var uniqCountries = dataByCountry.map(function (d) {
    //         return d.key
    //     });

    //     // function for filtering data based on selected countries
    //     function filterData() {
    //         selectedData = dataByCountry.filter(function (d) {
    //             return selectedCountries.indexOf(d.key) > -1
    //         })
    //     }

        /* ********************************** Country selector  ********************************** */

        // Create a country selector menu     
        var countrySelector = $('#countrySelect');

        // fill in select menu
        uniqCountries.forEach(function (d) {
            var newOption = new Option(d, d);
            countrySelector.append(newOption);
        });

        // Set default selector countries in menu
        countrySelector.val(selectedCountries);

        /* ********************************** Define scale and axis variables  ********************************** */

        // Create an ordinal color scale for coloring lines
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Global scale and axis variables
        var xFormat = d3.format("d");
        var yFormat = d3.format('.2s')
        //var xScale = d3.scaleLinear();
        //var yScale = d3.scaleLinear();
        var xAxis = d3.axisBottom().tickFormat(xFormat);;
        var yAxis = d3.axisLeft().tickFormat(yFormat);

        /* ********************************** Functions for setting scales and axes  ********************************** */

        // function for setting scales based on given data
        function setScales() {
            // Get set of all values
            var allValues = [];
            selectedData.forEach(function (d) {
                d.values.forEach(function (d) {
                    allValues.push(+d.value);
                });
            });

            // Reset xScale
            var xExtent = d3.extent(selectedData[0].values, function (d) {
                return +d.year;
            });
            xScale.domain([xExtent[0], xExtent[1]]).rangeRound([0, drawWidth]);

            // Reset yScale
            var yExtent = d3.extent(allValues);
            yScale.domain([yExtent[0] * 0.9, yExtent[1] * 1.1]).rangeRound([drawHeight, 0]);

            // Reset color scale to current set of countries
            //console.log(selectedCountries)
            colorScale.domain(selectedCountries);
        }

        function setAxes() {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            // xAxisLabel.transition().duration(1000).call(xAxis);
            // yAxisLabel.transition().duration(1000).call(yAxis);

            ele.select('.axis.x').transition().duration(1000).call(xAxis);
            ele.select('.axis.y').transition().duration(1000).call(yAxis);
        }


        /* ********************************** Function for calculating line path  ********************************** */

        // Define a line function that will return a `path` element based on data
        // hint: https://bl.ocks.org/mbostock/3883245
        var line = d3.line()
            .x(function (d) { return xScale(+d.year); })
            .y(function (d) { return yScale(+d.value); });

        /* ********************************** Function for drawing lines  ********************************** */

        // function for drawing graph
        function draw(data) {
            // Set scales and axes
            setScales();
            setAxes();

            // Do a datajoin between your path elements and the data passed to the draw function
            // Make sure to set the identifying key
            var countries = g.selectAll('.countries') // can't use path because will select x and y axis
                .data(data, function (d) { return d.key });

            // Handle entering elements (see README.md)
            countries.enter().append('path')
                .attr('class', 'countries')
                .attr('d', function (d) { return line(d.values) })
                .attr('fill', 'none')
                .attr('stroke-width', 1.5)
                .attr('stroke', function (d) { return colorScale(d.key) })
                .attr("stroke-dasharray", function (d) {
                    var totalLength = d3.select(this).node().getTotalLength();
                    // return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength() })
                    return (totalLength + ' ' + totalLength);
                })
                .attr("stroke-dashoffset", function (d) { return -d3.select(this).node().getTotalLength(); }) //animation
                .transition()
                .duration(2000)
                .attr("stroke-dashoffset", function (d) { return 0; });

            // Handle updating elements (see README.md)
            // Set your stroke-dasharray to none
            // Transition your d attribute using your line function to update the position appropriately
            // Update the stroke of each path
            countries
                .attr('stroke-dasharray', 'none')
                .transition()
                .duration(2000)
                .attr('d', function (d) { return line(d.values) })

            // Handle exiting elements (see README.md)
            countries.exit().transition().duration(500)
                .attr("stroke-dashoffset", function (d) { return -d3.select(this).node().getTotalLength() })
                .attr("stroke-dasharray", function (d) {
                    var totalLength = d3.select(this).node().getTotalLength();
                    return (totalLength + ' ' + totalLength)
                    //return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength() })
                })
                .remove();

        }

        /* ********************************** Function for drawing hovers (circles/text)  ********************************** */
        // Function to draw hovers (circles and text) based on year (called from the `overlay` mouseover)
        function drawHovers(year) {
            // Bisector function to get closest data point: note, this returns an *index* in your array
            var bisector = d3.bisector(function (d, x) {
                return +d.year - x;
            }).left;

            // Get hover data by using the bisector function to find the y value
            var years = selectedData.map(function (d) {
                d.values.sort(function (a, b) {
                    return +a.year - +b.year
                });
                return d.values[bisector(d.values, year)];
            });

            // Do a data-join (enter, update, exit) to draw circles
            var circles = g.selectAll('circle')
                .data(years, function (d) { return d.country_area; });
            circles.enter() // enter
                .append('circle')
                .attr('fill', 'none')
                .attr('stroke', function (d) { return colorScale(d.country_area); });
            circles // update
                .attr('cx', function (d) { return xScale(d.year) })
                .attr('cy', function (d) { return yScale(d.value) })
                .attr('r', 7);
            circles.exit() // exit
                .remove();

            // Do a data-join (enter, update, exit) draw text 
            var text = g.selectAll('.hoverText')
                .data(years, function (d) { return d.country_area });
            text.enter() // enter
                .append('text')
                .attr('class', 'hoverText');
            text // update
                .attr("x", 15)
                .text(function (d) { return d.country_area + ': ' + d3.format(".2s")(d.value); })
                .attr('transform', function (d) { return 'translate(' + xScale(d.year) + ', ' + yScale(d.value) + ')'; })
                .style('font-size', '.75em');
            text.exit() // exit
                .remove();
        }

        /* ********************************** Event listener  ********************************** */

        // Filter your data and draw the initial layout
        filterData();
        draw(selectedData);

        // Assign an event listener to your overlay element
        /*
            - On mousemove, detect the mouse location and use `xScale.invert` to get the data value that corresponds to the pixel value
            - On mouseout, remove all the circles and text from inside the g
        */
        overlay
            //.on("mouseover", function () { focus.style("display", null); })
            // .on("mousemove", function (d) { return xScale.invert(drawHovers(d)) })
            //.on("mousemove", function (d) { focus.style("display", xScale.invert(drawHover(d))); })
            // .on("mouseout", function () { focus.style("display", "none"); });
            .on('mousemove', function () { return drawHovers(xScale.invert(d3.mouse(this)[0])) })
            .on("mouseout", function () { g.selectAll('circle, .hoverText').remove() });

        // event listener for country selector change
        countrySelector.change(function () {
            // Reset selected countries
            selectedCountries = [];

            // Get selected countries from selector
            $('#countrySelect option:selected').each(function () {
                selectedCountries.push($(this).text());
            });

            // Filter and draw data
            filterData();
            draw(selectedData);
        });
    });
//});