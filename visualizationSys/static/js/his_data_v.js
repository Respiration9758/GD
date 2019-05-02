$(document).ready(function () {

    $("#hdata").click(function () {
        id = $('#id').val()

        $.ajax({
            type: 'POST',
			url: '/obtain_hdata/',
            data:{
                'searchid':id,
            },
			dataType: 'json',
			success: function(data) {



            	if(data.msg=="error"){

            		alert("没有找到对应数据！");
                    window.location.href="../his_v/"
				}
            	else{
            	    showData = data.showData;
                      /*基于准备好的dom，初始化echarts实例*/
                    var myChart = echarts.init(document.getElementById('main'));


                    var dates = showData.date;
                    var data = showData.data;
                    var chartTitle =showData.chartTitle;
                    var dataMA5 =showData.MA_5;
                    var dataMA10 = showData.MA_10;
                    var dataMA20 = showData.MA_20;



                    option = {
                        title: {    //标题
                            text: chartTitle,
                            left: 'center',
                        },
                        tooltip: {  //提示框
                            trigger: 'axis',    //触发类型：坐标轴触发
                            axisPointer: {  //坐标轴指示器配置项
                                type: 'cross'   //指示器类型，十字准星
                            }
                        },
                        legend: {   //图例控件，点击图例控制哪些系列不现实
                            top: 30,
                            data: ['日K', 'MA5', 'MA10', 'MA20']
                        },
                        grid: {     //直角坐标系
                            show:true,
                            top:100,
                            left: '10%',    //grid组件离容器左侧的距离
                            right: '10%',
                            bottom: '15%',
                            //backgroundColor:'#ccc'
                        },
                        xAxis: {
                            type: 'category',   //坐标轴类型，类目轴
                            data: dates,
                            //scale: true,  //只在数字轴中有效
                            boundaryGap : false,    //刻度作为分割线，标签和数据点会在两个刻度上
                            axisLine: {onZero: false},
                            splitLine: {show: false},   //是否显示坐标轴轴线
                            //splitNumber: 20,    //坐标轴的分割段数，预估值，在类目轴中无效
                            min: 'dataMin', //特殊值，数轴上的最小值作为最小刻度
                            max: 'dataMax'  //特殊值，数轴上的最大值作为最大刻度
                        },
                        yAxis: {
                            scale: true,    //坐标刻度不强制包含零刻度
                            axisLabel: {
                                formatter: '￥{value} '
                            },
                            splitArea: {
                                show: true  //显示分割区域
                            }
                        },
                        // dataZoom: [     //用于区域缩放
                        //     {
                        //         filterMode:'filter',    //当前数据窗口外的数据被过滤掉来达到数据窗口缩放的效果  默认值filter
                        //         type: 'inside', //内置型数据区域缩放组件
                        //         start: 50,      //数据窗口范围的起始百分比
                        //         end: 100        //数据窗口范围的结束百分比
                        //     },
                        //     {
                        //         show: true,
                        //         type: 'slider', //滑动条型数据区域缩放组件
                        //         y: '90%',
                        //         start: 50,
                        //         end: 100
                        //     }
                        // ],
                        dataZoom: [{
                                type: 'slider',
                                realtime: false,
                                start: 20,
                                end: 70,
                                top: 65,
                                height: 20,
                                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                handleSize: '120%'
                            }, {
                                type: 'inside',

                                start: 40,
                                end: 70,
                                top: 30,
                                height: 20
                            }],
                        series: [   //图表类型
                            {
                                name: '日K',
                                type: 'candlestick',    //K线图
                                data: data,     //y轴对应的数据

                    ////////////////////////图标标注/////////////////////////////

                                markPoint: {    //图表标注
                                    label: {    //标注的文本
                                        normal: {   //默认不显示标注
                                            show:true,
                                            //position:['20%','30%'],
                                            formatter: function (param) {   //标签内容控制器
                                                return param != null ? Math.round(param.value) : '';
                                            }
                                        }
                                    },
                                    data: [     //标注的数据数组
                                        {
                                            name: 'XX标点',
                                            coord: ['2013/5/31', 2300], //指定数据的坐标位置
                                            value: 2300,
                                            itemStyle: {    //图形样式
                                                normal: {color: 'rgb(41,60,85)'}
                                            }
                                        },
                                        {
                                            name: 'highest value',
                                            type: 'max',    //最大值
                                            valueDim: 'highest'     //在highest维度上的最大值 最高价
                                        },
                                        {
                                            name: 'lowest value',
                                            type: 'min',
                                            valueDim: 'lowest'  //最低价
                                        },
                                        {
                                            name: 'average value on close',
                                            type: 'average',
                                            valueDim: 'close'   //收盘价
                                        }
                                    ],
                                    tooltip: {      //提示框
                                        formatter: function (param) {
                                            return param.name + '<br>' + (param.data.coord || '');
                                        }
                                    }
                                },

            /////////////////////////////////图标标线///////////////////////////

                                markLine: {
                                    symbol: ['none', 'none'],   //标线两端的标记类型
                                    data: [
                                        [
                                            {
                                                name: 'from lowest to highest',
                                                type: 'min',    //设置该标线为最小值的线
                                                valueDim: 'lowest', //指定在哪个维度上的最小值
                                                symbol: 'circle',
                                                symbolSize: 10, //起点标记的大小
                                                label: {    //normal默认，emphasis高亮
                                                    normal: {show: false},  //不显示标签
                                                    emphasis: {show: false} //不显示标签
                                                }
                                            },
                                            {
                                                type: 'max',
                                                valueDim: 'highest',
                                                symbol: 'circle',
                                                symbolSize: 10,
                                                label: {
                                                    normal: {show: false},
                                                    emphasis: {show: false}
                                                }
                                            }
                                        ],

                                        {
                                            name: 'min line on close',
                                            type: 'min',
                                            valueDim: 'close'
                                        },
                                        {
                                            name: 'max line on close',
                                            type: 'max',
                                            valueDim: 'close'
                                        }
                                    ]

                                }

                            },

                            {   //MA5 5天内的收盘价之和/5
                                name: 'MA5',
                                type: 'line',
                                data: dataMA5,
                                smooth: true,
                                lineStyle: {
                                    normal: {opacity: 0.5}
                                }
                            },
                            {
                                name: 'MA10',
                                type: 'line',
                                data: dataMA10,
                                smooth: true,
                                lineStyle: {    //标线的样式
                                    normal: {opacity: 0.5}
                                }
                            },
                            {
                                name: 'MA20',
                                type: 'line',
                                data: dataMA20,
                                smooth: true,
                                lineStyle: {
                                    normal: {opacity: 0.5}
                                }
                            },


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