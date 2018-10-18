
/* global Highcharts */

$(document).ready(function () {


    $("a").click(function () {
        $("table").each(function () {
            var $this = $(this);
            var newrows = [];
            $this.find("tr").each(function () {
                var i = 0;
                $(this).find("td").each(function () {
                    i++;
                    if (newrows[i] === undefined) {
                        newrows[i] = $("<tr></tr>");
                    }
                    newrows[i].append($(this));
                });
            });
            $this.find("tr").remove();
            $.each(newrows, function () {
                $this.append(this);
            });
        });

        return false;
    });










    if ($('#categories').val() === undefined || $('#container1').val() === undefined) {
        return;
    }

    var categories = JSON.parse($('#categories').attr("data"));

    $('#container1').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Pyramide des ages du systeme sanitaire'
        },
        subtitle: {
            text: 'Source: DGP/DRH/MSAS'
        },
        xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, {// mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value);
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
        },

        series: [{
                name: 'Homme',
                data: JSON.parse($('#serieHomme').attr("data")),
                color: '#6ba2f9'
            }, {
                name: 'Femme',
                data: JSON.parse($('#serieFemme').attr("data")),
                color: '#fc97d5'
            }]
    });

    $(function () {
        if ($("#regions").attr("data") === undefined) {
            return;
        }

        var categories = JSON.parse($('#regions').attr("data"));


        $('#container2').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Repartition homme/femme par RM'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: 'Regions medicales'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total des agents'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            tooltip: {
                valueSuffix: ' agents'
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                    name: 'Homme',
                    data: JSON.parse($('#tab2Hommes').attr("data")),
                    color: '#6ba2f9'
                }, {
                    name: 'Femme',
                    data: JSON.parse($('#tab2Femmes').attr("data")),
                    color: '#fc97d5'
                }]
        });
    });


    $(function () {
        if ($("#totalFemmes").attr("data") === undefined) {
            return;
        }

        var totalFemmes = JSON.parse($('#totalFemmes').attr("data"));
        var totalHommes = JSON.parse($('#totalHommes').attr("data"));

        Highcharts.setOptions({colors: ['#6ba2f9', '#fc97d5']});

        $('#container4').highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Repartition homme/femme (niveau national)'
            },

            tooltip: {
                valueSuffix: ' agents'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                    name: 'Genre',
                    colorByPoint: true,
                    data: [{
                            name: 'Homme',
                            y: totalHommes,
                            color: '#6ba2f9'
                        }, {
                            name: 'Femme',
                            y: totalFemmes,
                            color: '#fc97d5'
                        }]
                }]
        });
    });



    $(function () {
        if ($("#repartitionRM").attr("data") === undefined) {
            return;
        }

        var repartitionRM = JSON.parse($('#repartitionRM').attr("data"));
        var categories = JSON.parse($('#regions').attr("data"));

        $('#container5').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Repartition des contractuels par RM'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Nombre total d\'agents'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal'//,
//                    dataLabels: {
//                        enabled: true,
//                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
//                    }
                }
            },
            series: [{
                    name: 'Agents',
                    data: repartitionRM,
                    colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
                    colorByPoint: true
                }]
        });

    });



});