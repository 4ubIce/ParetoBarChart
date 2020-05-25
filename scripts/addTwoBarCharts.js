'use strict';
requirejs(['d3js', 'ParetoBarChart'], function(d3js) {
                let file;
                
                file = 'data/data1.csv';
                const chart1 = new ParetoBarChart(document.querySelector('.my-chart1'), {}, file, d3js);
                               
                file = 'data/data2.csv';
                const chart2 = new ParetoBarChart(document.querySelector('.my-chart2'), {x: 0, y: 0}, file, d3js);
});
