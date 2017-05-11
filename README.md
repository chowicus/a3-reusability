# a3-reusability

Building a Line Graph

This is exercise to make a reusable line graph.

## Initiation of chart
var chartWrapper = d3.select('#mydiv').datum([dataSet]).call(myChart); 

## Update a chart parameter and the data (on some event handler)
myChart.param1(newValue);
chartWrapper.datum([newDataSet]).call(myChart);

## Methods to change
.width(newValue)

.height(newValue)

.xTitle(newString)

.yTitle(newString)

.title(newString)