$(document).ready(function () {
    $("#pdata").click(function () {

         id = $('#id').val()

        $.ajax({
            type: 'POST',
			url: '/obtain_pdata/',
            data:{
                'searchid':id,
            },
			dataType: 'json',
			success: function(data) {
            	if(data.msg=="error"){

            		alert("没有找到对应数据！");
                     window.location.href="../pred_v/"
				}
            	else {
                    showData = data.showData;
                    /*基于准备好的dom，初始化echarts实例*/
                    var myChart = echarts.init(document.getElementById('main'));
                    var chartTitle = showData.chartTitle;
                    var date = showData.date;

                    var priceData =  showData.priceData;
                    var predictData = showData.predictData;

                    option = {
                        title: {
                            text: chartTitle,
                            left: 'center',
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            top: 30,
                            data: ['收盘价', '预测价格']
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: [0]
                                },
                                dataView: {readOnly: false},
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        grid: {     //直角坐标系
                            show: true,
                            top: 65,
                            left: '10%',    //grid组件离容器左侧的距离
                            right: '10%',
                            bottom: '20%',
                            //backgroundColor:'#ccc'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: date

                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '￥{value} '
                            },
                            scale: true,
                        },
                        series: [{
                            name: '收盘价',
                            type: 'line',
                            data: priceData,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'},

                                ]
                            },
                            markLine: {
                                data: [
                                    [
                                        {
                                            name: 'from lowest to highest',
                                            type: 'min',    //设置该标线为最小值的线
                                            // valueDim: 'lowest', //指定在哪个维度上的最小值
                                            symbol: 'circle',
                                            symbolSize: 10, //起点标记的大小
                                            label: {    //normal默认，emphasis高亮
                                                normal: {show: false},  //不显示标签
                                                emphasis: {show: false} //不显示标签
                                            }
                                        },
                                        {
                                            type: 'max',
                                            // valueDim: 'highest',
                                            symbol: 'circle',
                                            symbolSize: 10,
                                            label: {
                                                normal: {show: false},
                                                emphasis: {show: false}
                                            }
                                        }
                                    ],
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                            {
                                name: '预测价格',
                                type: 'line',
                                symbol: 'roundRect',
                                data: predictData,
                                markPoint: {
                                    data: [

                                        {
                                            name: '预测值',
                                            symbol: 'arrow',
                                            coord: [10, predictData[10]],
                                            symbolSize: 25,
                                            value:predictData[10],




                                        }
                                    ]
                                },

                            }
                        ]


                    };


                    // 使用刚指定的配置项和数据显示图表
                    myChart.setOption(option);
                }
            	},
			error:function(data) {

			},

        })


    })


})