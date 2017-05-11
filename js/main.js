
$(function() {
    // Variables to show
    var xVar = 'year';
    var yVar = 'value';
    var chartData,
        nestedData;

    // Load data in using d3's csv function.
    // d3.csv('data/prepped_data.csv', function(error, data) {
       d3.csv('data/un_co2_data.csv', function(error, data) {
        // Put data into generic terms
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    x: d[xVar],
                    y: d[yVar],
                    id: d.country_area,

                };
            });

            // Nest data by region
            nestedData = d3.nest()
                .key(function(d) {
                    return d.id;
                })
                .entries(chartData);
        };

        prepData();

        // Define function to draw a LineGraph
        var linegraph = LineGraph().width(1000).height(300).xTitle('x test').yTitle('y test').title('test title');

        // Function to make charts (doing a data-join to make charts)
        var draw = function() {
            // Prep data
            prepData();

            // Do a data join to make small multiples
            var charts = d3.select('#vis').selectAll('.chart')
                .data(nestedData)
                //.data(chartData)

            charts.enter().append("div")
                .attr('class', 'chart')
                .merge(charts)
                .call(linegraph);

            charts.exit().remove();
        };

        // Call draw function
        draw();

        // Initialize materialize style
        $('select').material_select()

    });
});