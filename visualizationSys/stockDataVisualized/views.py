from django.shortcuts import render
from django.shortcuts import render, redirect
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
import pandas as pd
import datetime
import tushare as ts
from django.core import serializers

import numpy as np
import json
from django.views.decorators.csrf import csrf_exempt
# import os
# Create your views here.
from .models import Stock, SHistoryData, PredictData, TechIndicator, TIData

import tools.dataProcess


def stockPage(request, pageID):


    aPageNum = 5
    if not(not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    stocksList = Stock.objects.filter(isDelete=False)
    paginator =Paginator(stocksList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/stockPage.html", {"page": page, "detailpage": "stockPage",
                                                  "title": '股票信息', "listNum": len(stocksList),
                                                  "aPageNum": aPageNum
                                                  })
def historyPage(request, pageID):
    aPageNum = 5
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    historyList = SHistoryData.objects.filter(isDelete=False)
    print(historyList)
    paginator = Paginator(historyList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/historyPage.html", {"page": page, "detailpage": "historyPage",
                                                  "title": '历史行情', "listNum": len(historyList),
                                                  "aPageNum": aPageNum
                                                  })
def predictPage(request, pageID):
    aPageNum = 5
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    predictList = PredictData.objects.filter(isDelete=False)
    paginator = Paginator(predictList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/predictPage.html", {"page": page, "detailpage": "predictPage",
                                                  "title": '股价预测', "listNum": len(predictList),
                                                  "aPageNum": aPageNum
                                                  })



def indicatorPage(request, pageID):
    aPageNum = 5
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    indicatorList = TechIndicator.objects.filter(isDelete=False)
    paginator = Paginator(indicatorList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/indicatorPage.html", {"page": page, "detailpage": "indicatorPage",
                                                  "title": '技术指标信息', "listNum": len(indicatorList),
                                                  "aPageNum": aPageNum
                                                  })
def tidataPage(request, pageID):
    aPageNum = 5
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    tidataList = TIData.objects.filter(isDelete=False)
    paginator = Paginator(tidataList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/tidataPage.html", {"page": page, "detailpage": "tidataPage",
                                                  "title": '技术指标数据', "listNum": len(tidataList),
                                                  "aPageNum": aPageNum
                                                })





def his_v(request):
    h_id = request.POST.get("searchid")
    showData = {}
    if h_id == None:
        pass
    else:
        try:
            h_d = SHistoryData.objects.get(pk=h_id, isDelete=False)

            df_hd = pd.read_csv(h_d.filePath, index_col='date', parse_dates=['date'])


            data = []
            date = []
            for i in range(0, len(df_hd)):
                data.append(list(df_hd.iloc[i][['open', 'close', 'low', 'high', 'volume']].values))
                date.append(df_hd.index[i].strftime("%Y-%m-%d"))

            if 'MA_5' not in df_hd.columns.values.tolist():
                for i in [5, 10, 20]:
                    tools.dataProcess.calculateMA(df_hd, i)
                df_hd = df_hd.fillna('-')
                df_hd.to_csv(h_d.filePath)

            showData = {
                "title": "his_v",
                "searchTip": "Please enter history data id",
                "chartTitle": h_d.stock.name + "-" + h_d.stock.code,
                "date": date,
                "volume": list(df_hd['volume'].values),
                "data": data,
                "MA_5": list(df_hd['MA_5'].values),
                "MA_10": list(df_hd["MA_10"].values),
                "MA_20": list(df_hd['MA_20'].values)
            }

        except SHistoryData.DoesNotExist as e:
            return redirect("/add_sh/")
    return render(request, 'sdv/his_data_v.html', {"showData": showData, "title": "历史行情数据可视化",
                                                   "searchTip": "请输入历史行情数据ID"})
def pred_v(request):
    p_id = request.POST.get("searchid")

    showData = {}
    if p_id == None:
        pass
    else:
        try:
            p_d = PredictData.objects.get(pk=p_id)

            df_pd = pd.read_csv(p_d.filePath, index_col='date', parse_dates=['date'])
            date = []
            for i in range(0,len(df_pd)):
                date.append(df_pd.index[i].strftime("%Y-%m-%d"))


            showData = {
                "chartTitle": p_d.SHD.stock.name + "-" + p_d.SHD.stock.code,
                "date": date,
                "priceData": list(df_pd['close'].values),
                "predictData": list(df_pd['predict'].values)
            }
        except PredictData.DoesNotExist as e:
            return redirect("/add_sh/")
    return render(request, 'sdv/pred_data_v.html', {"showData": showData, "title": "股价预测数据可视化",
                                                   "searchTip": "请输入股价预测数据ID"})

def ti_v(request):
    # t_id = request.POST.get("searchid")
    # t_indicators = request.POST.getlist("indicators")
    #
    # # showData = {}
    # show_data = {}
    # if (t_id == None) or (t_id == ''):
    #     pass
    # else:
    #     try:
    #         t_d = TIData.objects.get(pk=t_id)
    #
    #         df_td = pd.read_csv(t_d.filePath, index_col='date', parse_dates=['date'])
    #
    #         date = []
    #         data = []
    #         for i in range(0, len(df_td)):
    #             data.append(list(df_td.iloc[i][['open', 'close', 'low', 'high', 'volume']].values))
    #             date.append(df_td.index[i].strftime("%Y-%m-%d"))
    #
    #         show_data = {
    #             "chartTitle": t_d.stockData.stock.name + "-" + t_d.stockData.stock.code,
    #             "date": date,
    #             "data": data,
    #             "volume": list(df_td['volume'].values)
    #         }
    #
    #         # if 'MACD' not in df_td.columns.values.tolist():
    #         #     # for i in [5, 10, 20]:
    #         #     #     calculateMA(df_td, i)
    #         #     # for i in [10, 20, 30]:
    #         #     #     calculateEMA(df_td, i)
    #         #     # calculateKDJ(df_td)
    #         #     # calculatePSY(df_td, 10)
    #         #     tools.dataProcess.calculateMACD(df_td)
    #         #     tools.dataProcess.calculateRSI(df_td)
    #         #     tools.dataProcess.calculateBBANDS(df_td)
    #         #     tools.dataProcess.calculateMOM(df_td)
    #         #     tools.dataProcess.calculateOBV(df_td)
    #         #     tools.dataProcess.calculateTRIX(df_td)
    #         #     df_td = df_td.fillna('-')
    #         #     df_td.to_csv(t_d.filePath)
    #         # i_name_list = []
    #         #
    #         # if 'MA' in t_indicators:
    #         #     i_name_list.append(['MA_5', 'MA_10', 'MA_20'])
    #         # if 'EMA' in t_indicators:
    #         #     i_name_list.append(['EMA10', 'EMA20', 'EMA30'])
    #         # if 'KDJ' in t_indicators:
    #         #     i_name_list.append(['KValue', 'DValue', 'JValue'])
    #         # if 'PSY' in t_indicators:
    #         #     i_name_list.append(['PSY'])
    #         # if 'MACD' in t_indicators:
    #         #     i_name_list.append(['DIFF', 'DEA', 'MACD'])
    #         # if 'RSI' in t_indicators:
    #         #     i_name_list.append(['RSI6', 'RSI12', 'RSI24'])
    #         # if 'MOM' in t_indicators:
    #         #     i_name_list.append(['MOM25', 'MOM25_MA_10'])
    #         # if 'Bolling' in t_indicators:
    #         #     i_name_list.append(['UPPER', 'MID', 'LOWER'])
    #         # if 'OBV' in t_indicators:
    #         #     i_name_list.append(['OBV'])
    #         # if 'TRIX' in t_indicators:
    #         #     i_name_list.append(['TRIX12', 'TRIX20'])
    #         #
    #         #
    #         # for i in i_name_list:
    #         #    for j in i:
    #         #        show_data[''+j] = list(df_td[j].values)
    #         #
    #         # show_data['i_name_list'] = i_name_list
    #         # show_data['t_indicators'] = t_indicators
    #
    #
    #
    #         # showData = {
    #         #     "chartTitle": t_d.stockData.stock.name + "-" + t_d.stockData.stock.code,
    #         #     "date": date,
    #         #     "data": data,
    #         #     "volume": list(df_td['volume'].values),
    #         #     "MA_5": list(df_td['MA_5'].values),
    #         #     "MA_10": list(df_td['MA_10'].values),
    #         #     "MA_20": list(df_td['MA_20'].values),
    #         #     "EMA10": list(df_td['EMA10'].values),
    #         #     "EMA20": list(df_td['EMA20'].values),
    #         #     "EMA30": list(df_td['EMA30'].values),
    #         #     "KValue": list(df_td['KValue'].values),
    #         #     "DValue": list(df_td['DValue'].values),
    #         #     "JValue": list(df_td['JValue'].values),
    #         #     "PSY": list(df_td['PSY'].values),
    #         #
    #         # }
    #
    #     except TIData.DoesNotExist as e:
    #
    #         return redirect("/add_sh/")
    return render(request, 'sdv/ti_data_v.html', {"title": "技术指标数据可视化",
                                                    })
@csrf_exempt
def obtain_tidata(request):
    t_id = request.POST.get("searchid")
    print(t_id)
    t_indicators = request.POST.getlist("indicators[]")

    show_data = {}
    if (t_id == None) or (t_id == ''):
        pass
    else:
        try:
            t_d = TIData.objects.get(pk=t_id)
            print(t_d.filePath)

            df_td = pd.read_csv(t_d.filePath, index_col='date', parse_dates=['date'])

            date = []
            data = []
            for i in range(0, len(df_td)):
                data.append(list(df_td.iloc[i][['open', 'close', 'low', 'high', 'volume']].values))
                date.append(df_td.index[i].strftime("%Y-%m-%d"))

            show_data = {
                "chartTitle": t_d.stockData.stock.name + "-" + t_d.stockData.stock.code,
                "date": date,
                "data": data,
                "volume": list(df_td['volume'].values),
                "MA_5": list(df_td['MA_5'].values),
                "MA_10": list(df_td['MA_10'].values),
                "MA_20": list(df_td['MA_20'].values)
            }


            i_name_list = []

            if 'MA' in t_indicators:
                i_name_list.append(['MA_5', 'MA_10', 'MA_20'])
            if 'EMA' in t_indicators:
                i_name_list.append(['EMA10', 'EMA20', 'EMA30'])
            if 'KDJ' in t_indicators:
                i_name_list.append(['KValue', 'DValue', 'JValue'])
            if 'PSY' in t_indicators:
                i_name_list.append(['PSY'])
            if 'MACD' in t_indicators:
                i_name_list.append(['DIFF', 'DEA', 'MACD'])
            if 'RSI' in t_indicators:
                i_name_list.append(['RSI6', 'RSI12', 'RSI24'])
            if 'MOM' in t_indicators:
                i_name_list.append(['MOM25', 'MOM25_MA_10'])
            if 'Bolling' in t_indicators:
                i_name_list.append(['UPPER', 'MID', 'LOWER'])
            if 'OBV' in t_indicators:
                i_name_list.append(['OBV'])
            if 'TRIX' in t_indicators:
                i_name_list.append(['TRIX12', 'TRIX20'])

            for i in i_name_list:
                for j in i:
                    show_data['' + j] = list(df_td[j].values)

            show_data['i_name_list'] = i_name_list
            show_data['t_indicators'] = t_indicators
            print(show_data)


        except TIData.DoesNotExist as e:
            print("找不得到页面")
            return redirect("/add_sh/")
    return JsonResponse({'showData': show_data})
def showIndicator(request):
    indicator_list = TechIndicator.objects.filter(isDelete=False).values('shortName')
    data = json.dumps(list(indicator_list))
    return JsonResponse(data, safe=False)



def home(request):
    # df = pd.read_csv(hd1.filePath)
    #
    # # pc = os.getcwd()
    # # print(pc)
    # # p1 = os.path.abspath('..')
    # # print(p1)
    # # p2 = os.path.abspath('.')
    # # print(p2)
    return render(request, 'sdv/home.html')


@csrf_exempt
def sto_delete(request):
    id = request.POST.get('id')
    stock = Stock.objects.get(id=id)
    stock.isDelete = True
    stock.save()
    if (stock.isDelete == True):
        ret = {'msg': '删除成功'}
    else:
        ret = {'msg': '删除失败'}
    return JsonResponse(ret)
@csrf_exempt
def sto_add(request):
    if (request.method == 'POST'):
        code = request.POST.get('code')
        name = request.POST.get('name')
        describe = request.POST.get('describe')
        Stock.createSto(code, name, describe).save()
        return redirect("/stockPage/1/")
    else:
        return render(request, "sdv/sto_add.html", {"title": "添加股票信息"})
@csrf_exempt
def checkCode(request):
    code = request.POST.get("code")
    try:
        sto = Stock.objects.get(code=code, isDelete=False)
        print(sto.code)
        return JsonResponse({"data": "stock already exists", "status": "error"})
    except Stock.DoesNotExist as e:
        return JsonResponse({"data": "ok", "status": "success"})


@csrf_exempt
def sh_delete(request):
    id = request.POST.get('id')
    sh = SHistoryData.objects.get(id=id)
    sh.isDelete = True
    sh.save()
    print("AJAX请求后")
    print(SHistoryData.objects.filter(isDelete=False))
    if (sh.isDelete == True):
        ret = {'msg': '删除成功'}
    else:
        ret = {'msg': '删除失败'}
    return JsonResponse(ret)
@csrf_exempt
def sh_add(request):
    if (request.method == 'POST'):

        stock = request.POST.get('stock')
        print(type(stock))
        startTime = request.POST.get('startTime')
        endTime = request.POST.get('endTime')
        describe = request.POST.get('describe')

        df_sh = ts.get_hist_data(stock, start=startTime, end=endTime)[['open', 'close', 'high', 'low', 'volume']]
        print(df_sh)
        df_sh.index = df_sh.index.sort_values()
        number = len(df_sh)
        filePath = './dataset/shd/'+stock+'_'+startTime+'_'+str(number)+'.csv'
        df_sh.to_csv(filePath)
        sto = Stock.objects.get(code=stock)
        SHistoryData.createSh(startTime, endTime, number, sto,
                              filePath, describe).save()
        return redirect("/historyPage/1/")
    else:
        today = str(datetime.datetime.now().date())
        print(today)
        return render(request, "sdv/sh_add.html", {"today": today, "title": "添加历史行情数据"})
@csrf_exempt
def showStock(request):
    sto_list = Stock.objects.filter(isDelete=False).values('code', 'name')
    data = json.dumps(list(sto_list))

    # data = serializers.serialize("json", sto_list)[1:-1]
    return JsonResponse(data, safe=False)


@csrf_exempt
def tid_delete(request):
    id = request.POST.get('id')
    tid = TIData.objects.get(id=id)
    tid.isDelete = True
    tid.save()
    print("AJAX请求后")
    print(SHistoryData.objects.filter(isDelete=False))
    if (tid.isDelete == True):
        ret = {'msg': '删除成功'}
    else:
        ret = {'msg': '删除失败'}
    return JsonResponse(ret)
@csrf_exempt
def tid_add(request):
    if (request.method == 'POST'):

        history = request.POST.get('history')

        describe = request.POST.get('describe')


        sh = SHistoryData.objects.get(pk=history)
        filePath = './dataset/tid/'+sh.stock.code+'_'+sh.hd_startTime.strftime('%Y-%m-%d')+'_'+str(sh.number)+'.csv'
        df_tid = pd.read_csv(sh.filePath, index_col='date', parse_dates=['date'])
        if 'MA_5' not in df_tid.columns.values.tolist():
            for i in [5, 10, 20]:
                tools.dataProcess.calculateMA(df_tid, i)
        for i in [10, 20, 30]:
            tools.dataProcess.calculateEMA(df_tid, i)
        tools.dataProcess.calculateMACD(df_tid)
        tools.dataProcess.calculatePSY(df_tid)
        tools.dataProcess.calculateTRIX(df_tid)
        tools.dataProcess.calculateOBV(df_tid)
        tools.dataProcess.calculateMOM(df_tid)
        tools.dataProcess.calculateBBANDS(df_tid)
        tools.dataProcess.calculateRSI(df_tid)
        tools.dataProcess.calculateKDJ(df_tid)
        df_tid = df_tid.fillna('-')
        df_tid.to_csv(filePath)

        TIData.createTID(sh, filePath, describe).save()
        return redirect("/tidataPage/1/")
    else:

        return render(request, "sdv/tid_add.html",{'title':"添加技术指标数据"})
@csrf_exempt
def showHistory(request):
    sh_list = SHistoryData.objects.filter(isDelete=False)
    data = []
    for item in sh_list:
        data.append(item.__str__())
    # print(type(sh_list[0].__str__()))
    # data = serializers.serialize("json", sh_list)
    data = json.dumps(data)
    return JsonResponse(data, safe=False)


@csrf_exempt
def pd_delete(request):
    id = request.POST.get('id')
    p = PredictData.objects.get(id=id)
    p.isDelete = True
    p.save()
    if (p.isDelete == True):
        ret = {'msg': '删除成功'}
    else:
        ret = {'msg': '删除失败'}
    return JsonResponse(ret)
@csrf_exempt
def pd_add(request):
    if (request.method == 'POST'):

        file = request.FILES.get("inputfile", None)

        test_date = request.POST.get('test_date')
        pred_date = request.POST.get('pred_date')
        history = request.POST.get('history')
        describe = request.POST.get('describe')

        sh = SHistoryData.objects.get(pk=history)

        filePath = './dataset/pd/' + sh.stock.code + '_' + test_date + '_' + pred_date + '.csv'
        with open(filePath, 'wb') as fp:
            for info in file.chunks():
                fp.write(info)

        PredictData.createPD(test_date,pred_date,sh, filePath, describe).save()

        return redirect("/predictPage/1/")
    else:

        return render(request, "sdv/pd_add.html",{'title':"上传股价预测数据"})
@csrf_exempt
def obtain_time(request):
    sh_id = request.POST.get("id")
    sh = SHistoryData.objects.get(id=sh_id)
    df_sh = pd.read_csv(sh.filePath, index_col='date', parse_dates=['date'])
    startTime = df_sh.index[-10].strftime("%Y-%m-%d")
    # print("预测开始时间")
    # print(startTime)
    # print(datetime.datetime.now().weekday())
    # today = datetime.datetime.now()
    # hou = today + datetime.timedelta(days=2)
    # print(hou)
    # print(sh.hd_endTime)
    sh_endTime = df_sh.index[-1]
    if(sh_endTime.weekday() == 4):
        predictTime = sh_endTime + datetime.timedelta(days=3)
    elif(sh_endTime.weekday() == 5):
        predictTime = sh_endTime + datetime.timedelta(days=2)
    else:
        predictTime = sh_endTime + datetime.timedelta(days=1)
    predictTime = predictTime.strftime("%Y-%m-%d")
    time = {
        'startTime': startTime,
        "predictTime": predictTime
    }
    return JsonResponse(time)




@csrf_exempt
def i_delete(request):
    id = request.POST.get('id')
    ti = TechIndicator.objects.get(id=id)
    ti.isDelete = True
    ti.save()
    if (ti.isDelete == True):
        ret = {'msg': '删除成功'}
    else:
        ret = {'msg': '删除失败'}
    return JsonResponse(ret)












def add_sh(request):
    return HttpResponse("没有找到ID对应的数据集！")
