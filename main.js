'use strict';
requirejs.config({
    baseUrl: 'scripts',
    paths: {
		    d3js: '../lib/d3.v5.min',
        ParetoBarChart: 'ParetoBarChart',
    }
});

requirejs(['addTwoBarCharts']);                          
