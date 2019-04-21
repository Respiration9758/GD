$(document).ready(function () {




    $(function () {

        $(".selectpicker").selectpicker({
            noneSelectedText : '请选择技术指标'
        })

    $(window).on('load', function() {
        $('.selectpicker').selectpicker('val', '');
        $('.selectpicker').selectpicker('refresh');
    })

    //下拉数据加载
    $.ajax({
        type : 'get',
        url : '/showIndicator/',
        dataType : 'json',
        success : function(datas) {//返回list数据并循环获取
            datas =  $.parseJSON( datas )

            var select = $("#slpk");
            for (var i = 0; i < datas.length; i++) {
                select.append("<option value='"+datas[i].shortName+"'>"
                    + datas[i].shortName + "</option>");
            }
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        }
    })

    })

    $('#tidata').click(function () {
        id = $('#id').val()
        search_ti = $('#slpk').val()


        $.ajax({
            type: 'POST',
			url: '/obtain_tidata/',
            data:{
                'searchid':id,
                'indicators':search_ti
            },
			dataType: 'json',
			success: function(data) {

				showData = data.showData
				i_name_list = showData.i_name_list
				t_indicators = showData.t_indicators

				var dates = showData.date
				var data = showData.data
				var volume = showData.volume

				var MA_5 = showData.MA_5
				var MA_10 = showData.MA_10
				var MA_20 = showData.MA_20

				/*基于准备好的dom，初始化echarts实例*/
				var myChart = echarts.init(document.getElementById('main'));
				myChart.clear()

				var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
				var labelFont = 'bold 12px Sans-serif';

				// 网格数目
				var girdNum = search_ti.length + 2
				var girdIndex = []
				for(var i=0;i<girdNum;i++){
					girdIndex.push(i)
				}


				var graphicList = [{
					type: 'group',
					left: 'center',
					top: 70,
					width: 300,
					bounding: 'raw',

					children: [{
						id: 'MA5',
						type: 'text',
						style: {fill: colorList[1], font: labelFont},
						left: 0
					}, {
						id: 'MA10',
						type: 'text',
						style: {fill: colorList[2], font: labelFont},
						left: 'center'
					}, {
						id: 'MA20',
						type: 'text',
						style: {fill: colorList[3], font: labelFont},
						right: 0
					}]
				}]
				var seriesList = [{
					type: 'candlestick',
					name: '日K',
					data: showData.data,
					itemStyle: {
						normal: {
							color: '#ef232a',
							color0: '#14b143',
							borderColor: '#ef232a',
							borderColor0: '#14b143'
						},
						emphasis: {
							color: 'black',
							color0: '#444',
							borderColor: 'black',
							borderColor0: '#444'
						}
					}
				}, {
					name: 'MA5',
					type: 'line',
					data: showData.MA_5,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}, {
					name: 'MA10',
					type: 'line',
					data: showData.MA_10,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}, {
					name: 'MA20',
					type: 'line',
					data: showData.MA_20,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}, {
					name: 'Volume',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					itemStyle: {
						normal: {
							color: '#7fbe9e'
						},
						emphasis: {
							color: '#140'
						}
					},
					data: showData.volume
				}]
				var titleList =  [
						{
							left: 'center',
							text: showData.chartTitle,
						},
						{
							text: 'Volume',
							left: 20,
							top: 190,
							textAlign: 'left',
							textStyle: {
								fontSize: 8,
								color: "#6C6C6C"
							},
						}
					]
				var datazoomList = [{
						type: 'slider',
						xAxisIndex: girdIndex,
						realtime: false,
						start: 20,
						end: 70,
						top: 65,
						height: 20,
						handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
						handleSize: '120%'
					}, {
						type: 'inside',
						xAxisIndex: girdIndex,
						start: 40,
						end: 70,
						top: 30,
						height: 20
					}]
				var axisP = {
					    link: [{
					        xAxisIndex:girdIndex
					    }]
					}
				var xAxisList = [{
						type: 'category',
						data: dates,
						boundaryGap: false,
						axisTick: {show: false},
						axisLine: {lineStyle: {color: '#777'}},
						axisLabel: {
							show: false,

						},
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							show: true
						}
					}, {
						type: 'category',
						gridIndex: 1,
						data: dates,
						scale: true,
						boundaryGap: false,
						splitLine: {show: false},
						axisLabel: {show: false},
						axisTick: {show: false},
						axisLine: {lineStyle: {color: '#777'}},
						splitNumber: 20,
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							show: true
						}
					}]
				var yAxisList =  [{
						scale: true,
						splitNumber: 2,
						axisLine: {lineStyle: {color: '#777'}},
						splitLine: {show: true},
						axisTick: {show: false},
						axisLabel: {
							inside: true,
							formatter: '{value}\n'
						}
					},
						{
						scale: true,
						gridIndex: 1,
						splitNumber: 2,
						axisLabel: {show: false},
						axisLine: {show: false},
						axisTick: {show: false},
						splitLine: {show: false}
					}]
				var gridList = [{
						left: 20,
						right: 20,
						top: 100,
						height: 75,
						show: true,
						borderWidth: 0,
						backgroundColor: '#fff',
						shadowColor: 'rgba(0, 0, 0, 0.3)',
						shadowBlur: 0.5
					},
						{
						left: 20,
						right: 20,
						height: 65,
						top: 190,
						show: true,
						borderWidth: 0,
						backgroundColor: '#fff',
						shadowColor: 'rgba(0, 0, 0, 0.3)',
						shadowBlur: 0.5
					}]

				for (var i = 0; i < t_indicators.length; i++) {
					var index = i + 2
					var gri = {
						left: 20,
						right: 20,
						height: 65,
						top: 190 + ((i+1) * 80),
						show: true,
						borderWidth: 0,
						backgroundColor: '#fff',
						shadowColor: 'rgba(0, 0, 0, 0.3)',
						shadowBlur: 0.5
					}

					var t = {
							text: t_indicators[i] ,
							left: 20,
							top: 190 + ((i+1)*80),
							textAlign: 'left',
							textStyle: {
								fontSize: 8,
								color: "#6C6C6C"
							},
						}
					var yAxis = {
						scale: true,
						gridIndex: index,
						splitNumber: 2,
						axisLabel: {show: false},
						axisLine: {show: false},
						axisTick: {show: false},
						splitLine: {show: false}
					}
					gridList.push(gri)
					titleList.push(t)
					yAxisList.push(yAxis)
					if(index == (girdNum - 1)){
						var xAxis = {
						type: 'category',
						gridIndex: index,
						data: dates,
						scale: true,
						boundaryGap: false,
						axisLabel: {
							formatter: function (value) {
								return echarts.format.formatTime('yyyy-' +
									'MM-dd', value);
							}
						},
						axisTick: {show: false},
						axisLine: {lineStyle: {color: '#777'}},
						splitNumber: 20,
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							show: true
							// type: 'shadow',
							// label: {show: true},
							// triggerTooltip: false,
							// handle: {
							// 	show: true,
							// 	margin: 30,
							// 	color: '#B80C00'
							// }
						}

					 }

					}
					else{
						var xAxis = {
						type: 'category',
						gridIndex: index,
						data: dates,
						scale: true,
						boundaryGap: false,
						splitLine: {show: false},
						axisLabel: {show: false},
						axisTick: {show: false},
						axisLine: {lineStyle: {color: '#777'}},
						splitNumber: 20,
						min: 'dataMin',
						max: 'dataMax',
						axisPointer: {
							show: true
						}
					}

					}
					xAxisList.push(xAxis)

					if (i_name_list[i].length > 1) {
						var cList = []
						for (var j = 0; j < i_name_list[i].length; j++) {
							var sdata = showData[i_name_list[i][j] + '']
							if (i_name_list[i][j] == "MACD") {
								var s = {
									name: i_name_list[i][j],
									type: 'bar',
									xAxisIndex: index,
									yAxisIndex: index,
									data: sdata,
									barWidth: 1,
									showSymbol: false,
									itemStyle: {
										normal: {
											color: function (params) {
												var index_num = params.value

												if (index_num > 0) {
													return 'red'
												} else {
													return 'green'
												}
											}
										}
									}

								}

							} else {
								var s = {
									name: i_name_list[i][j],
									type: 'line',
									xAxisIndex: index,
									yAxisIndex: index,
									data: sdata,
									smooth: true,
									showSymbol: false,
									lineStyle: {
										normal: {
											width: 1
										}
									}
								}
							}


							seriesList.push(s)

							var c = {
								id: i_name_list[i][j],
								type: 'text',
								style: {fill: colorList[2], font: labelFont},

							}
							cList.push(c)

						}
						var g = {
							type: 'group',
							left: 'center',
							top: 70,
							width: 300,
							bounding: 'raw',

							children: cList
						}
						graphicList.push(g)

					} else {
						var sdata = showData[i_name_list[i][0] + '']

						var s = {
							name: i_name_list[i][0],
							type: 'line',
							xAxisIndex: index,
							yAxisIndex: index,
							data: sdata,
							smooth: true,
							showSymbol: false,
							lineStyle: {
								normal: {
									width: 1
								}
							}
						}
						seriesList.push(s)

					}
				}



				option = {
					animation: false,
					color: colorList,
					title: titleList,
					legend: [
						{
							top: 30,
							data: ['日K', 'MA5', 'MA10', 'MA20']
						},
					],
					tooltip: {  //提示框
						trigger: 'axis',    //触发类型：坐标轴触发
						axisPointer: {  //坐标轴指示器配置项
							type: 'cross'   //指示器类型，十字准星
						}
					},
					// tooltip: {
					//     triggerOn: 'none',
					//     transitionDuration: 0,
					//     confine: true,
					//     bordeRadius: 4,
					//     borderWidth: 1,
					//     borderColor: '#333',
					//     backgroundColor: 'rgba(255,255,255,0.9)',
					//     textStyle: {
					//         fontSize: 12,
					//         color: '#333'
					//     },
					//     position: function (pos, params, el, elRect, size) {
					//         var obj = {
					//             top: 60
					//         };
					//         obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					//         return obj;
					//     }
					// },
					// axisPointer:axisP ,
					dataZoom:datazoomList ,
					xAxis:xAxisList ,
					yAxis:yAxisList,
					grid:gridList ,
					graphic: graphicList,
					series: seriesList,

				}

				console.log(option)

				// 使用刚指定的配置项和数据显示图表
				myChart.setOption(option)


// 				if (search_ti.length == 10) {
// 					/*基于准备好的dom，初始化echarts实例*/
// 					var myChart = echarts.init(document.getElementById('main'));
// 					myChart.clear()
//
// 					var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
// 					var labelFont = 'bold 12px Sans-serif';
//
//
// 					showData = data.showData
// 					i_name_list = showData.i_name_list
// 					t_indicators = showData.t_indicators
// 					var graphicList = [{
// 						type: 'group',
// 						left: 'center',
// 						top: 70,
// 						width: 300,
// 						bounding: 'raw',
//
// 						children: [{
// 							id: 'MA5',
// 							type: 'text',
// 							style: {fill: colorList[1], font: labelFont},
// 							left: 0
// 						}, {
// 							id: 'MA10',
// 							type: 'text',
// 							style: {fill: colorList[2], font: labelFont},
// 							left: 'center'
// 						}, {
// 							id: 'MA20',
// 							type: 'text',
// 							style: {fill: colorList[3], font: labelFont},
// 							right: 0
// 						}]
// 					}]
// 					var seriesList = [{
// 						type: 'candlestick',
// 						name: '日K',
// 						data: showData.data,
// 						itemStyle: {
// 							normal: {
// 								color: '#ef232a',
// 								color0: '#14b143',
// 								borderColor: '#ef232a',
// 								borderColor0: '#14b143'
// 							},
// 							emphasis: {
// 								color: 'black',
// 								color0: '#444',
// 								borderColor: 'black',
// 								borderColor0: '#444'
// 							}
// 						}
// 					}, {
// 						name: 'MA5',
// 						type: 'line',
// 						data: showData.MA_5,
// 						smooth: true,
// 						showSymbol: false,
// 						lineStyle: {
// 							normal: {
// 								width: 1
// 							}
// 						}
// 					}, {
// 						name: 'MA10',
// 						type: 'line',
// 						data: showData.MA_10,
// 						smooth: true,
// 						showSymbol: false,
// 						lineStyle: {
// 							normal: {
// 								width: 1
// 							}
// 						}
// 					}, {
// 						name: 'MA20',
// 						type: 'line',
// 						data: showData.MA_20,
// 						smooth: true,
// 						showSymbol: false,
// 						lineStyle: {
// 							normal: {
// 								width: 1
// 							}
// 						}
// 					}, {
// 						name: 'Volume',
// 						type: 'bar',
// 						xAxisIndex: 1,
// 						yAxisIndex: 1,
// 						itemStyle: {
// 							normal: {
// 								color: '#7fbe9e'
// 							},
// 							emphasis: {
// 								color: '#140'
// 							}
// 						},
// 						data: showData.volume
// 					}]
//
//
// 					for (var i = 0; i < t_indicators.length; i++) {
// 						var index = i + 2
//
// 						if (i_name_list[i].length > 1) {
// 							var cList = []
// 							for (var j = 0; j < i_name_list[i].length; j++) {
// 								var sdata = showData[i_name_list[i][j] + '']
// 								if (i_name_list[i][j] == "MACD") {
// 									var s = {
// 										name: i_name_list[i][j],
// 										type: 'bar',
// 										xAxisIndex: index,
// 										yAxisIndex: index,
// 										data: sdata,
// 										barWidth: 1,
// 										showSymbol: false,
// 										itemStyle: {
// 											normal: {
// 												color: function (params) {
// 													var index_num = params.value
// 													console.log(params)
// 													console.log(index_num)
// 													if (index_num > 0) {
// 														return 'red'
// 													} else {
// 														return 'green'
// 													}
// 												}
// 											}
// 										}
//
// 									}
//
// 								} else {
// 									var s = {
// 										name: i_name_list[i][j],
// 										type: 'line',
// 										xAxisIndex: index,
// 										yAxisIndex: index,
// 										data: sdata,
// 										smooth: true,
// 										showSymbol: false,
// 										lineStyle: {
// 											normal: {
// 												width: 1
// 											}
// 										}
// 									}
// 								}
//
//
// 								seriesList.push(s)
//
// 								var c = {
// 									id: i_name_list[i][j],
// 									type: 'text',
// 									style: {fill: colorList[2], font: labelFont},
//
// 								}
// 								cList.push(c)
//
// 							}
// 							var g = {
// 								type: 'group',
// 								left: 'center',
// 								top: 70,
// 								width: 300,
// 								bounding: 'raw',
//
// 								children: cList
// 							}
// 							graphicList.push(g)
//
// 						} else {
// 							var sdata = showData[i_name_list[i][0] + '']
//
// 							var s = {
// 								name: i_name_list[i][0],
// 								type: 'line',
// 								xAxisIndex: index,
// 								yAxisIndex: index,
// 								data: sdata,
// 								smooth: true,
// 								showSymbol: false,
// 								lineStyle: {
// 									normal: {
// 										width: 1
// 									}
// 								}
// 							}
// 							seriesList.push(s)
//
// 						}
// 					}
//
//
// 					var dates = showData.date
// 					var data = showData.data
// 					var volume = showData.volume
//
// 					var MA_5 = showData.MA_5
// 					var MA_10 = showData.MA_10
// 					var MA_20 = showData.MA_20
//
//
// 					option = {
// 						animation: false,
// 						color: colorList,
// 						title: {
// 							left: 'center',
// 							text: showData.chartTitle
// 						},
// 						legend: [
// 							{
// 								top: 30,
// 								data: ['日K', 'MA5', 'MA10', 'MA20']
// 							},
//
// 						],
// 						tooltip: {  //提示框
// 							trigger: 'axis',    //触发类型：坐标轴触发
// 							axisPointer: {  //坐标轴指示器配置项
// 								type: 'cross'   //指示器类型，十字准星
// 							}
// 						},
// 						// tooltip: {
// 						//     triggerOn: 'none',
// 						//     transitionDuration: 0,
// 						//     confine: true,
// 						//     bordeRadius: 4,
// 						//     borderWidth: 1,
// 						//     borderColor: '#333',
// 						//     backgroundColor: 'rgba(255,255,255,0.9)',
// 						//     textStyle: {
// 						//         fontSize: 12,
// 						//         color: '#333'
// 						//     },
// 						//     position: function (pos, params, el, elRect, size) {
// 						//         var obj = {
// 						//             top: 60
// 						//         };
// 						//         obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
// 						//         return obj;
// 						//     }
// 						// },
// 						axisPointer: {
// 							link: [{
// 								xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 							}]
// 						},
// 						dataZoom: [{
// 							type: 'slider',
// 							xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 							realtime: false,
// 							start: 20,
// 							end: 70,
// 							top: 65,
// 							height: 20,
// 							handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
// 							handleSize: '120%'
// 						}, {
// 							type: 'inside',
// 							xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 							start: 40,
// 							end: 70,
// 							top: 30,
// 							height: 20
// 						}],
// 						xAxis: [{
// 							type: 'category',
// 							data: dates,
// 							boundaryGap: false,
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							axisLabel: {
// 								show: false,
// 								// formatter: function (value) {
// 								// 	return echarts.format.formatTime('yyyy-' +
// 								// 			'MM-dd', value);
// 								// }
// 							},
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 1,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 2,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 3,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 4,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 5,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 6,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 7,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 8,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 9,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 10,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							splitLine: {show: false},
// 							axisLabel: {show: false},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								show: true
// 							}
// 						}, {
// 							type: 'category',
// 							gridIndex: 11,
// 							data: dates,
// 							scale: true,
// 							boundaryGap: false,
// 							axisLabel: {
// 								formatter: function (value) {
// 									return echarts.format.formatTime('yyyy-' +
// 										'MM-dd', value);
// 								}
// 							},
// 							axisTick: {show: false},
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitNumber: 20,
// 							min: 'dataMin',
// 							max: 'dataMax',
// 							axisPointer: {
// 								type: 'shadow',
// 								label: {show: false},
// 								triggerTooltip: true,
// 								handle: {
// 									show: true,
// 									margin: 30,
// 									color: '#B80C00'
// 								}
// 							}
//
// 						}],
// 						yAxis: [{
// 							scale: true,
// 							splitNumber: 2,
// 							axisLine: {lineStyle: {color: '#777'}},
// 							splitLine: {show: true},
// 							axisTick: {show: false},
// 							axisLabel: {
// 								inside: true,
// 								formatter: '{value}\n'
// 							}
// 						}, {
// 							scale: true,
// 							gridIndex: 1,
// 							splitNumber: 2,
// 							axisLabel: {show: false},
// 							axisLine: {show: false},
// 							axisTick: {show: false},
// 							splitLine: {show: false}
// 						}, {
// 							scale: true,
// 							gridIndex: 2,
// 							splitNumber: 2,
// 							axisLabel: {show: false},
// 							axisLine: {show: false},
// 							axisTick: {show: false},
// 							splitLine: {show: false}
// 						},
// 							{
// 								scale: true,
// 								gridIndex: 3,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}, {
// 								scale: true,
// 								gridIndex: 4,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							},
// 							{
// 								scale: true,
// 								gridIndex: 5,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}, {
// 								scale: true,
// 								gridIndex: 6,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							},
// 							{
// 								scale: true,
// 								gridIndex: 7,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}, {
// 								scale: true,
// 								gridIndex: 8,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							},
// 							{
// 								scale: true,
// 								gridIndex: 9,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}, {
// 								scale: true,
// 								gridIndex: 10,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}, {
// 								scale: true,
// 								gridIndex: 11,
// 								splitNumber: 2,
// 								axisLabel: {show: false},
// 								axisLine: {show: false},
// 								axisTick: {show: false},
// 								splitLine: {show: false}
// 							}],
// 						grid: [{
// 							left: 20,
// 							right: 20,
// 							top: 100,
// 							height: 70
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 190
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 270
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 350
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 430
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 510
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 590
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 670
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 750
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 830
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 910
// 						}, {
// 							left: 20,
// 							right: 20,
// 							height: 60,
// 							top: 990
// 						}],
//
// 						graphic: graphicList,
// 						series: seriesList,
//
// 					}
//
// 					console.log(option)
// 					// 使用刚指定的配置项和数据显示图表
// 					myChart.setOption(option);
//
//
// 				}
// 				else if(search_ti.length == 1){
// 				/*基于准备好的dom，初始化echarts实例*/
// 				var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
// 				var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
// 				var labelFont = 'bold 12px Sans-serif';
//
//
// 				showData = data.showData
// 				i_name_list = showData.i_name_list
// 				t_indicators = showData.t_indicators
// 				var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]
// 				}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
// 				for (var i = 0; i < t_indicators.length; i++) {
// 					var index = i + 2
//
// 					if (i_name_list[i].length > 1) {
// 						var cList = []
// 						for (var j = 0; j < i_name_list[i].length; j++) {
// 							var sdata = showData[i_name_list[i][j] + '']
// 							if (i_name_list[i][j] == "MACD") {
// 								var s = {
// 									name: i_name_list[i][j],
// 									type: 'bar',
// 									xAxisIndex: index,
// 									yAxisIndex: index,
// 									data: sdata,
// 									barWidth: 1,
// 									showSymbol: false,
// 									itemStyle: {
// 										normal: {
// 											color: function (params) {
// 												var index_num = params.value
//
// 												if (index_num > 0) {
// 													return 'red'
// 												} else {
// 													return 'green'
// 												}
// 											}
// 										}
// 									}
//
// 								}
//
// 							} else {
// 								var s = {
// 									name: i_name_list[i][j],
// 									type: 'line',
// 									xAxisIndex: index,
// 									yAxisIndex: index,
// 									data: sdata,
// 									smooth: true,
// 									showSymbol: false,
// 									lineStyle: {
// 										normal: {
// 											width: 1
// 										}
// 									}
// 								}
// 							}
//
//
// 							seriesList.push(s)
//
// 							var c = {
// 								id: i_name_list[i][j],
// 								type: 'text',
// 								style: {fill: colorList[2], font: labelFont},
//
// 							}
// 							cList.push(c)
//
// 						}
// 						var g = {
// 							type: 'group',
// 							left: 'center',
// 							top: 70,
// 							width: 300,
// 							bounding: 'raw',
//
// 							children: cList
// 						}
// 						graphicList.push(g)
//
// 					} else {
// 						var sdata = showData[i_name_list[i][0] + '']
//
// 						var s = {
// 							name: i_name_list[i][0],
// 							type: 'line',
// 							xAxisIndex: index,
// 							yAxisIndex: index,
// 							data: sdata,
// 							smooth: true,
// 							showSymbol: false,
// 							lineStyle: {
// 								normal: {
// 									width: 1
// 								}
// 							}
// 						}
// 						seriesList.push(s)
//
// 					}
// 				}
//
// 				var dates = showData.date
// 				var data = showData.data
// 				var volume = showData.volume
//
// 				var MA_5 = showData.MA_5
// 				var MA_10 = showData.MA_10
// 				var MA_20 = showData.MA_20
//
//
// 				option = {
// 					animation: false,
// 					color: colorList,
// 					title: [
// 						{
// 							left: 'center',
// 							text: showData.chartTitle,
// 						},
// 						{
// 							text: 'volumn',
// 							left: 20,
// 							top: 190,
// 							textAlign: 'left',
// 							textStyle: {
// 								fontSize: 10,
// 								color: "#6C6C6C"
// 							},
// 						},
// 						{
// 							text: 'macd',
// 							left: 20,
// 							top: 270,
// 							textAlign: 'left',
// 							textStyle: {
// 								fontSize: 10,
// 								color: "#6C6C6C"
// 							},
// 						},
//
// 					],
//
//
// 					legend: [
// 						{
// 							top: 30,
// 							data: ['日K', 'MA5', 'MA10', 'MA20']
// 						},
// 					],
// 					tooltip: {  //提示框
// 						trigger: 'axis',    //触发类型：坐标轴触发
// 						axisPointer: {  //坐标轴指示器配置项
// 							type: 'cross'   //指示器类型，十字准星
// 						}
// 					},
// 					// tooltip: {
// 					//     triggerOn: 'none',
// 					//     transitionDuration: 0,
// 					//     confine: true,
// 					//     bordeRadius: 4,
// 					//     borderWidth: 1,
// 					//     borderColor: '#333',
// 					//     backgroundColor: 'rgba(255,255,255,0.9)',
// 					//     textStyle: {
// 					//         fontSize: 12,
// 					//         color: '#333'
// 					//     },
// 					//     position: function (pos, params, el, elRect, size) {
// 					//         var obj = {
// 					//             top: 60
// 					//         };
// 					//         obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
// 					//         return obj;
// 					//     }
// 					// },
// 					// axisPointer: {
// 					//     link: [{
// 					//         xAxisIndex: [0, 1, 2]
// 					//     }]
// 					// },
// 					dataZoom: [{
// 						type: 'slider',
// 						xAxisIndex: [0, 1, 2],
// 						realtime: false,
// 						start: 20,
// 						end: 70,
// 						top: 65,
// 						height: 20,
// 						handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
// 						handleSize: '120%'
// 					}, {
// 						type: 'inside',
// 						xAxisIndex: [0, 1, 2],
// 						start: 40,
// 						end: 70,
// 						top: 30,
// 						height: 20
// 					}],
// 					xAxis: [{
// 						type: 'category',
// 						data: dates,
// 						boundaryGap: false,
// 						axisTick: {show: false},
// 						axisLine: {lineStyle: {color: '#777'}},
// 						axisLabel: {
// 							show: false,
//
// 						},
// 						min: 'dataMin',
// 						max: 'dataMax',
// 						axisPointer: {
// 							show: true
// 						}
// 					}, {
// 						type: 'category',
// 						gridIndex: 1,
// 						data: dates,
// 						scale: true,
// 						boundaryGap: false,
// 						splitLine: {show: false},
// 						axisLabel: {show: false},
// 						axisTick: {show: false},
// 						axisLine: {lineStyle: {color: '#777'}},
// 						splitNumber: 20,
// 						min: 'dataMin',
// 						max: 'dataMax',
// 						axisPointer: {
// 							show: true
// 						}
// 					}, {
// 						type: 'category',
// 						gridIndex: 2,
// 						data: dates,
// 						scale: true,
// 						boundaryGap: false,
// 						axisLabel: {
// 							formatter: function (value) {
// 								return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 							}
// 						},
// 						axisTick: {show: false},
// 						axisLine: {lineStyle: {color: '#777'}},
// 						splitNumber: 20,
// 						min: 'dataMin',
// 						max: 'dataMax',
// 						axisPointer: {
// 							show: true
// 							// type: 'shadow',
// 							// label: {show: true},
// 							// triggerTooltip: false,
// 							// handle: {
// 							// 	show: true,
// 							// 	margin: 30,
// 							// 	color: '#B80C00'
// 							// }
// 						}
//
// 					}],
// 					yAxis: [{
// 						scale: true,
// 						splitNumber: 2,
// 						axisLine: {lineStyle: {color: '#777'}},
// 						splitLine: {show: true},
// 						axisTick: {show: false},
// 						axisLabel: {
// 							inside: true,
// 							formatter: '{value}\n'
// 						}
// 					}, {
// 						scale: true,
// 						gridIndex: 1,
// 						splitNumber: 2,
// 						axisLabel: {show: false},
// 						axisLine: {show: false},
// 						axisTick: {show: false},
// 						splitLine: {show: false}
// 					}, {
// 						scale: true,
// 						gridIndex: 2,
// 						splitNumber: 2,
// 						axisLabel: {show: false},
// 						axisLine: {show: false},
// 						axisTick: {show: false},
// 						splitLine: {show: false}
// 					}],
// 					grid: [{
// 						left: 20,
// 						right: 20,
// 						top: 100,
// 						height: 75,
// 						show: true,
// 						borderWidth: 0,
// 						backgroundColor: '#fff',
// 						shadowColor: 'rgba(0, 0, 0, 0.3)',
// 						shadowBlur: 1
// 					}, {
// 						left: 20,
// 						right: 20,
// 						height: 65,
// 						top: 190,
// 						show: true,
// 						borderWidth: 0,
// 						backgroundColor: '#fff',
// 						shadowColor: 'rgba(0, 0, 0, 0.3)',
// 						shadowBlur: 1
// 					}, {
// 						left: 20,
// 						right: 20,
// 						height: 65,
// 						top: 270,
// 						show: true,
// 						borderWidth: 0,
// 						backgroundColor: '#fff',
// 						shadowColor: 'rgba(0, 0, 0, 0.3)',
// 						shadowBlur: 1
// 					}],
//
// 					graphic: graphicList,
// 					series: seriesList,
//
// 				}
//
// 				// 使用刚指定的配置项和数据显示图表
// 				myChart.setOption(option);
// 			}
//             	else if(search_ti.length==2){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//               for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},
// 					{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==3){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},
// 					{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==4){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
// 				for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
//
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},
// 					{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==5){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                 for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5, 6]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},
// 				{
// 					type: 'category',
// 					gridIndex: 6,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 6,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 590
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==6){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                 for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 6,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 7,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 6,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 7,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 590
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 670
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==7){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                 for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 6,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 7,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 8,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 6,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 7,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 8,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 590
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 670
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 750
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==8){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                 for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 6,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 7,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 8,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 9,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 6,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 7,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 8,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 9,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 590
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 670
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 750
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 830
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }
//             	else if(search_ti.length==9){ /*基于准备好的dom，初始化echarts实例*/
//                 var myChart = echarts.init(document.getElementById('main'));
// 				myChart.clear()
//
//                 var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
//                 var labelFont = 'bold 12px Sans-serif';
//
//
//                 showData = data.showData
//                 i_name_list = showData.i_name_list
//                 t_indicators = showData.t_indicators
//                 var graphicList = [{
// 					type: 'group',
// 					left: 'center',
// 					top: 70,
// 					width: 300,
// 					bounding: 'raw',
//
// 					children: [{
// 						id: 'MA5',
// 						type: 'text',
// 						style: {fill: colorList[1], font: labelFont},
// 						left: 0
// 					}, {
// 						id: 'MA10',
// 						type: 'text',
// 						style: {fill: colorList[2], font: labelFont},
// 						left: 'center'
// 					}, {
// 						id: 'MA20',
// 						type: 'text',
// 						style: {fill: colorList[3], font: labelFont},
// 						right: 0
// 					}]}]
// 				var seriesList = [{
// 					type: 'candlestick',
// 					name: '日K',
// 					data: showData.data,
// 					itemStyle: {
// 						normal: {
// 							color: '#ef232a',
// 							color0: '#14b143',
// 							borderColor: '#ef232a',
// 							borderColor0: '#14b143'
// 						},
// 						emphasis: {
// 							color: 'black',
// 							color0: '#444',
// 							borderColor: 'black',
// 							borderColor0: '#444'
// 						}
// 					}
// 				}, {
// 					name: 'MA5',
// 					type: 'line',
// 					data: showData.MA_5,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA10',
// 					type: 'line',
// 					data: showData.MA_10,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				}, {
// 					name: 'MA20',
// 					type: 'line',
// 					data: showData.MA_20,
// 					smooth: true,
// 					showSymbol: false,
// 					lineStyle: {
// 						normal: {
// 							width: 1
// 						}
// 					}
// 				},{
// 					name: 'Volume',
// 					type: 'bar',
// 					xAxisIndex: 1,
// 					yAxisIndex: 1,
// 					itemStyle: {
// 						normal: {
// 							color: '#7fbe9e'
// 						},
// 						emphasis: {
// 							color: '#140'
// 						}
// 					},
// 					data: showData.volume
// 				}]
//
//
//                 for (var i=0;i<t_indicators.length;i++){
//                     var index = i+2
//
// 				    if (i_name_list[i].length > 1){
// 				        var cList = []
// 				        for (var j=0;j<i_name_list[i].length;j++){
// 				             var sdata = showData[i_name_list[i][j]+'']
// 							if (i_name_list[i][j]=="MACD"){
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'bar',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 barWidth:1,
//                                 showSymbol: false,
// 								itemStyle:{
//                                 	normal:{
//                                 		color: function (params) {
//                                 			var index_num = params.value
//
// 											if(index_num>0){
// 												return 'red'
// 											}else {
// 												return 'green'
// 											}
// 										}
// 									}
// 								}
//
//                         }
//
// 							}
// 							else {
// 								var s = {
//                                 name: i_name_list[i][j],
//                                 type: 'line',
//                                 xAxisIndex: index,
//                                 yAxisIndex: index,
//                                 data: sdata,
//                                 smooth: true,
//                                 showSymbol: false,
//                                 lineStyle: {
//                                     normal: {
//                                         width: 1
//                                     }
//                                 }
//                         }
// 							}
//
//
//
//
//                         seriesList.push(s)
//
//                         var c = {
//                             id:i_name_list[i][j] ,
//                             type: 'text',
//                             style: {fill: colorList[2], font: labelFont},
//
//                         }
//                         cList.push(c)
//
//                         }
// 				        var g = {
//                                 type: 'group',
//                                 left: 'center',
//                                 top: 70,
//                                 width: 300,
//                                 bounding: 'raw',
//
//                                 children: cList}
//                             graphicList.push(g)
//
// 				    }
// 				    else{
// 				        var sdata = showData[i_name_list[i][0]+'']
//
//                         var s = {
//                             name: i_name_list[i][0],
//                             type: 'line',
//                             xAxisIndex: index,
//                             yAxisIndex: index,
//                             data: sdata,
//                             smooth: true,
//                             showSymbol: false,
//                             lineStyle: {
//                                 normal: {
//                                     width: 1
//                                 }
//                             }
//                     }
//                     seriesList.push(s)
//
//                     }
// 			}
//
//
//
//
//
//
//
//
//                 var dates = showData.date
//                 var data = showData.data
//                 var volume = showData.volume
//
//                 var MA_5 = showData.MA_5
//                 var MA_10 = showData.MA_10
//                 var MA_20 = showData.MA_20
//
//
//
//
//
//
//                 option = {
//                     animation: false,
//                     color: colorList,
//                     title: {
//                         left: 'center',
//                         text: showData.chartTitle
//                     },
//                     legend: [
//                             {top: 30,
//                         data: ['日K', 'MA5', 'MA10', 'MA20']},
//
//                     ],
//                     tooltip: {
//                         triggerOn: 'none',
//                         transitionDuration: 0,
//                         confine: true,
//                         bordeRadius: 4,
//                         borderWidth: 1,
//                         borderColor: '#333',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         textStyle: {
//                             fontSize: 12,
//                             color: '#333'
//                         },
//                         position: function (pos, params, el, elRect, size) {
//                             var obj = {
//                                 top: 60
//                             };
//                             obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
//                             return obj;
//                         }
//                     },
//                     axisPointer: {
//                         link: [{
//                             xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//                         }]
//                     },
//                     dataZoom: [{
//                         type: 'slider',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//                         realtime: false,
//                         start: 20,
//                         end: 70,
//                         top: 65,
//                         height: 20,
//                         handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//                         handleSize: '120%'
//                     }, {
//                         type: 'inside',
//                         xAxisIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//                         start: 40,
//                         end: 70,
//                         top: 30,
//                         height: 20
//                     }],
//                     xAxis: [{
// 					type: 'category',
// 					data: dates,
// 					boundaryGap : false,
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					axisLabel: {
// 						show:false,
// 						// formatter: function (value) {
// 						// 	return echarts.format.formatTime('yyyy-' +
// 						// 			'MM-dd', value);
// 						// }
// 					},
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				}, {
// 					type: 'category',
// 					gridIndex: 1,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 2,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 3,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 4,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 5,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 6,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 7,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 8,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 9,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
// 					splitLine: {show: false},
// 					axisLabel: {show: false},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						show: true
// 					}
// 				},{
// 					type: 'category',
// 					gridIndex: 10,
// 					data: dates,
// 					scale: true,
// 					boundaryGap : false,
//                     axisLabel: {
// 						formatter: function (value) {
// 							return echarts.format.formatTime('yyyy-' +
// 									'MM-dd', value);
// 						}
// 					},
// 					axisTick: {show: false},
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitNumber: 20,
// 					min: 'dataMin',
// 					max: 'dataMax',
// 					axisPointer: {
// 						type: 'shadow',
// 						label: {show: false},
// 						triggerTooltip: true,
// 						handle: {
// 							show: true,
// 							margin: 30,
// 							color: '#B80C00'
// 						}
// 					}
//
// 				}],
// 				yAxis: [{
// 					scale: true,
// 					splitNumber: 2,
// 					axisLine: { lineStyle: { color: '#777' } },
// 					splitLine: { show: true },
// 					axisTick: { show: false },
// 					axisLabel: {
// 						inside: true,
// 						formatter: '{value}\n'
// 					}
// 				}, {
// 					scale: true,
// 					gridIndex: 1,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 2,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 3,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 4,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 5,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 6,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 7,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 8,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},
// 					{
// 					scale: true,
// 					gridIndex: 9,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				},{
// 					scale: true,
// 					gridIndex: 10,
// 					splitNumber: 2,
// 					axisLabel: {show: false},
// 					axisLine: {show: false},
// 					axisTick: {show: false},
// 					splitLine: {show: false}
// 				}],
// 				grid: [{
// 					left: 20,
// 					right: 20,
// 					top: 100,
// 					height: 70
// 				}, {
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 190
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 270
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 350
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 430
// 				},
// 					{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 510},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 590
// 				},
// 					{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 670
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 750
// 				},
// 					{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 830
// 				},{
// 					left: 20,
// 					right: 20,
// 					height: 60,
// 					top: 910
// 				}],
//
//                     graphic:graphicList,
//                     series:seriesList,
//
//                 }
//
//
//                 // 使用刚指定的配置项和数据显示图表
//                 myChart.setOption(option);
//
// }

			},
			error:function(data) {

			},

        })

    })







})