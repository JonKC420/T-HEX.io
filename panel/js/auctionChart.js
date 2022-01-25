var categories = []
var points = []
var xViewDefault = 0
var xView = 0
var chart
$.getJSON("/auctionData", function(data) {
	xView = data.length - 1
	xViewDefault = xView - 25
	options.xAxis.min = xViewDefault
    let i2 = data.length - 1
    $.each(data, function(i, el) {
        categories[i2] = el.day
        points[i2] = el.auctionTotal;
        i2--
    });
    options.xAxis.categories = categories;
    options.series[0].data = points;
	
    chart = new Highcharts.Chart(options)
	addButtons()
})
let normalState = {
      fill: '#673AB7',
      style: {
        color: '#FFFFFF'
      }
    },
    hoverState = {
      fill: '#ff3AB7',
      style: {
        color: '#FFFFFF'
      }
    }, 
    pressedState = {
      fill: '#000000',
      style: {
        color: '#FFFFFF'
      }
    },
    disabledState = {
      fill: '#000000',
      style: {
        color: '#FFFFFF'
      }
    },
    callback = function () {
    }
function addButtons() {
	chart.renderer.button('+25',25, 250, callback, normalState, hoverState, pressedState, disabledState)
	.attr({ zIndex: 3 })
	.on('click', function () {
		if(options.xAxis.min - 25 < 1)
			options.xAxis.min = 1
		else
			options.xAxis.min -= 25
		chart = new Highcharts.Chart(options)
		addButtons()
	}).add()
	
	chart.renderer.button('-25', 75, 250, callback, normalState, hoverState, pressedState, disabledState)
	.attr({ zIndex: 3 })
	.on('click', function () {
		if(options.xAxis.min + 25 > xView-20)
			options.xAxis.min = xView-20
		else
			options.xAxis.min += 25
		chart = new Highcharts.Chart(options)
		addButtons()
	}).add()
	
	chart.renderer.button('ALL', 125, 250, callback, normalState, hoverState, pressedState, disabledState)
	.attr({ zIndex: 3 })
	.on('click', function () {
		options.xAxis.min = 1
		chart = new Highcharts.Chart(options)
		addButtons()
	}).add()
	
	chart.renderer.button('Default View',175, 250, callback, normalState, hoverState, pressedState, disabledState)
	.attr({ zIndex: 3 })
	.on('click', function () {
		options.xAxis.min = xViewDefault
		chart = new Highcharts.Chart(options)
		addButtons()
	}).add()
}

var options = {
    chart: {
        renderTo: 'container-auctionchart',
        type: 'column',
        height: 300,
        backgroundColor: '#2e2e49',
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
    },
	title: {
		text: ''
	},
    xAxis: {
		min: xViewDefault,
        gridLineColor: '#2e2e49',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#7332a8',
        minorGridLineColor: '#2e2e49',
        tickColor: '#FFFFFF',
        title: {
			text: "Day",
            style: {
                color: '#A0A0A3'

            }
        },
    },
    yAxis: {
        gridLineColor: '#2e2e49',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#7332a8',
        minorGridLineColor: '#2e2e49',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
			text: "TRX Entered",
            style: {
                color: '#A0A0A3'
            }
        },

    },
	tooltip: {
		backgroundColor: 'rgba(0, 0, 0, 0.85)',
		style: {
			color: '#F0F0F0'
		},
    },
    tooltip: {
        pointFormatter: function() {
            return '<span style="color:{point.color}">\u25CF</span> ' + this.series.name + ': <b>' + this.y.toFixed(3) + ' TRX </b><br/>'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#2e2e49'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },
	buttonTheme: {
		fill: '#505053',
		stroke: '#000000',
		style: {
			color: '#CCC'
		},
		states: {
			hover: {
				fill: '#707073',
				stroke: '#000000',
				style: {
					color: 'white'
				}
			},
			select: {
				fill: '#000003',
				stroke: '#000000',
				style: {
					color: 'white'
				}
			}
		}
	},    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.2)',
        series: {
            color: '#7798BF',
            lineColor: '#473573'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },
    series: [
		{
			name: 'T2X Auction Lobby Pool',
			color: {
				linearGradient: {
					x1: 0,
					x2: 0,
					y1: 0,
					y2: 1
				},
				stops: [
					[0, '#9141e0'],
					[1, '#4f158a']
				]
			},
			lineColor: '#4f158a',
			type: 'area',
			threshold: null,
			tooltip: {
				valueDecimals: 2
			}
		}
	],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                chart: {
                    height: 300
                },
                subtitle: {
                    text: null
                },
                navigator: {
                    enabled: false
                }
            }
        }]
    }
}
