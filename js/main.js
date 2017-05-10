/* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).*/

$(function() {
    // Variables to show
    var xVar = 'year';
    var yVar = 'value';
    var chartData,
        nestedData;

    // Load data in using d3's csv function
    d3.csv('data/un_co2_data.csv', function (error, data) {

        /* ********************************** Data prep  ********************************** */
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    x: d[xVar],
                    y: d[yVar],
                    id: d.country_area,
                    //region: d.region
                };
            });


        // Nest the data by `country_area` to create an **array of objects**, one for each **country**
        var nestedData = d3.nest()
            .key(function (d) {
                return d.country_area;
            })
            .entries(chartData);
        };

        // // Get a unique list of countries to make selector
        // var uniqCountries = dataByCountry.map(function (d) {
        //     return d.key
        // });

        // // function for filtering data based on selected countries
        // function filterData() {
        //     selectedData = dataByCountry.filter(function (d) {
        //         return selectedCountries.indexOf(d.key) > -1
        //     })
        // }

        prepData();
        // Define function to draw ScatterPlot
        var line = LineGraph().width(300).height(300);

        // Function to make charts (doing a data-join to make charts)
        var draw = function() {
            // Prep data
            prepData();

            // Do a data join to make small multiples
            var charts = d3.select('#vis').selectAll('.chart')
                .data(nestedData)

            charts.enter().append("div")
                .attr('class', 'chart')
                .merge(charts)
                .call(line);

            charts.exit().remove();
        };

        // Call draw function
        draw();

        // Set change event to the select menu
        $('select').on('change', function(d) {
            xVar = $(this).val();
            draw();
        });

        // Initialize materialize style
        $('select').material_select()

    });
});