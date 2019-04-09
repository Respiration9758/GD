from django.shortcuts import render
from django.shortcuts import render, redirect
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
import pandas as pd
import datetime
from django.core import serializers

import numpy as np
import json
from django.views.decorators.csrf import csrf_exempt
# import os
# Create your views here.
from .models import Stock, SHistoryData, PredictData, TechIndicator, TIData
from tools.dataProcess import calculateMA, calculateEMA, calculateKDJ, calculatePSY



def stockPage(request, pageID):


    aPageNum = 3
    if not(not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    stocksList = Stock.objects.filter(isDelete=False)
    paginator =Paginator(stocksList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/stockPage.html", {"page": page, "detailpage": "stockPage",
                                                  "title": 'stockPage', "listNum": len(stocksList),
                                                  "aPageNum": aPageNum
                                                  })
def historyPage(request, pageID):
    aPageNum = 3
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    historyList = SHistoryData.objects.all()
    paginator = Paginator(historyList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/historyPage.html", {"page": page, "detailpage": "historyPage",
                                                  "title": 'historyPage', "listNum": len(historyList),
                                                  "aPageNum": aPageNum
                                                  })
def predictPage(request, pageID):
    aPageNum = 3
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    predictList = PredictData.objects.all()
    paginator = Paginator(predictList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/predictPage.html", {"page": page, "detailpage": "predictPage",
                                                  "title": 'predictPage', "listNum": len(predictList),
                                                  "aPageNum": aPageNum
                                                  })



def indicatorPage(request, pageID):
    aPageNum = 3
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    indicatorList = TechIndicator.objects.all()
    paginator = Paginator(indicatorList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/indicatorPage.html", {"page": page, "detailpage": "indicatorPage",
                                                  "title": 'indicatorPage', "listNum": len(indicatorList),
                                                  "aPageNum": aPageNum
                                                  })
def tidataPage(request, pageID):
    aPageNum = 3
    if not (not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    tidataList = TIData.objects.all()
    paginator = Paginator(tidataList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/tidataPage.html", {"page": page, "detailpage": "tidataPage",
                                                  "title": 'tidataPage', "listNum": len(tidataList),
                                                  "aPageNum": aPageNum
                                                })





def his_v(request):
    h_id = request.POST.get("searchid")
    showData = {}
    if h_id == None:
        pass
    else:
        try:
            h_d = SHistoryData.objects.get(pk=h_id)

            df_hd = pd.read_csv(h_d.filePath, index_col='date', parse_dates=['date'])


            data = []
            date = []
            for i in range(0, len(df_hd)):
                data.append(list(df_hd.iloc[i][['open', 'close', 'low', 'high', 'volume']].values))
                date.append(df_hd.index[i].strftime("%Y-%m-%d"))

            if 'MA_5' not in df_hd.columns.values.tolist():
                for i in [5, 10, 20]:
                    calculateMA(df_hd, i)
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
    return render(request, 'sdv/his_data_v.html', {"showData": showData, "title": "his_v",
                                                   "searchTip": "Please enter history data id"})
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
    return render(request, 'sdv/pred_data_v.html', {"showData": showData, "title": "pred_v",
                                                   "searchTip": "Please enter predicted data id"})
def ti_v(request):
    t_id = request.POST.get("searchid")
    showData = {}
    if t_id == None:
        pass
    else:
        try:
            t_d = TIData.objects.get(pk=t_id)

            df_td = pd.read_csv(t_d.filePath, index_col='date', parse_dates=['date'])

            date = []
            data = []
            for i in range(0, len(df_td)):
                data.append(list(df_td.iloc[i][['open', 'close', 'low', 'high', 'volume']].values))
                date.append(df_td.index[i].strftime("%Y-%m-%d"))

            if 'PSY' not in df_td.columns.values.tolist():
                for i in [5, 10, 20]:
                    calculateMA(df_td, i)
                for i in [10, 20, 30]:
                    calculateEMA(df_td, i)
                calculateKDJ(df_td)
                calculatePSY(df_td, 10)
                df_hd = df_td.fillna('-')
                df_hd.to_csv(t_d.filePath)

            showData = {
                "chartTitle": t_d.stockData.stock.name + "-" + t_d.stockData.stock.code,
                "date": date,
                "data": data,
                "MA_5": list(df_td['MA_5'].values),
                "volume": list(df_td['volume'].values),
                "MA_10": list(df_td['MA_10'].values),
                "MA_20": list(df_td['MA_20'].values),
                "EMA10": list(df_td['EMA10'].values),
                "EMA20": list(df_td['EMA20'].values),
                "EMA30": list(df_td['EMA30'].values),
                "KValue": list(df_td['KValue'].values),
                "DValue": list(df_td['DValue'].values),
                "JValue": list(df_td['JValue'].values),
                "PSY": list(df_td['PSY'].values),

            }
        except TIData.DoesNotExist as e:
            return redirect("/add_sh/")
    return render(request, 'sdv/ti_data_v.html', {"showData": showData, "title": "ti_v",
                                                    "searchTip": "Please enter technical indicator data id"})


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
def sto_delete(request,id):
    stock = Stock.objects.get(id=id)
    stock.isDelete = True
    stock.save()
    if (stock.isDelete == True):
        ret = {'msg':'删除成功'}
    else:
        ret = {'msg':'删除失败'}
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
        return render(request,"sdv/sto_add.html")
@csrf_exempt
def checkCode(request):
    code = request.POST.get("code")
    try:
        sto = Stock.objects.get(code=code, isDelete=False)
        return JsonResponse({"data": "stock already exists", "status": "error"})
    except Stock.DoesNotExist as e:
        return JsonResponse({"data": "ok", "status": "success"})

@csrf_exempt
def sh_add(request):
    if (request.method == 'POST'):
        code = request.POST.get('code')
        name = request.POST.get('name')
        describe = request.POST.get('describe')
        Stock.createSto(code, name, describe).save()
        return redirect("/historyPage/1/")
    else:
        today = str(datetime.datetime.now().date())
        print(today)
        return render(request, "sdv/sh_add.html",{"today": today,})

@csrf_exempt
def showStock(request):
    data = serializers.serialize("json", Stock.objects.all())

    if (len(data) != 0):
        return JsonResponse({"data": data, "status": "success"})
    else:
        return JsonResponse({"data": "0 data", "status": "error"})


def add_sh(request):
    return HttpResponse("Don't find data of ID")
