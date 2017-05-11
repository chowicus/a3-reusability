
$(function() {
    // Variables to show
    var xVar = '';
    var yVar = '';
    var chartData,
        nestedData;

    // Load data in using d3's csv function.
       d3.csv('', function(error, data) { // choose a csv data set

        // Put data into generic terms
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    // return variables to map 



                };
            });

            // Nest data by region
            nestedData = d3.nest()
                .key(function(d) {
                    // return nested data

                  
                })
                .entries(chartData);
        };

        prepData();

        // Define function to draw a LineGraph


        
        
        // Function to make charts (doing a data-join to make charts)
        var draw = function() {
            // Prep data
            prepData();

            // Do a data join to make small multiples
            var charts = d3.select('#vis').selectAll('.chart')
                // call the data to join


            charts.enter().append("div")
                .attr('class', 'chart')
                .merge(charts)
                .call(linegraph);

            // exit and remove    



        };

        // Call draw function




        // Initialize materialize style
        $('select').material_select()

    });
});