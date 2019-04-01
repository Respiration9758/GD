from django.shortcuts import render
from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import JsonResponse
import pandas as pd
# import os
# Create your views here.
from .models import Stock, SHistoryData, PredictData, TechIndicator, TIData
def stock(request):
    stocksList = Stock.objects.all()
    
    return render(request, 'sdv/stock.html', {"List": stocksList, "title": 'stock',
                                              "listNum": len(stocksList)})


def stockPage(request, pageID):
    aPageNum = 3
    if not(not bool(request.GET)):
        aPageNum = request.GET.get("aPageNum")

    stocksList = Stock.objects.all()
    paginator =Paginator(stocksList, aPageNum)
    page = paginator.page(pageID)
    return render(request, "sdv/stockPage.html", {"page": page, "detailpage": "stockPage",
                                                  "title": 'stockPage', "listNum": len(stocksList),
                                                  "aPageNum": aPageNum
                                                  })

def ajaxSP(request):
    print(request.POST.get("data"))
    num = request.POST.get("data")
    stocksList = Stock.objects.all()
    paginator = Paginator(stocksList, num)
    page = paginator.page(1)
    return JsonResponse({"page": page, "aPageNum": num})


def historyPage(request, pageID):

    historyList = SHistoryData.objects.all()
    paginator =Paginator(historyList, 3)
    page = paginator.page(pageID)
    return render(request, "sdv/historyPage.html", {"page": page, "detailpage": "historyPage",
                                                  "title": 'historyPage', "listNum": len(historyList)
                                                  })

def predictPage(request, pageID):

    predictList = PredictData.objects.all()
    paginator =Paginator(predictList, 3)
    page = paginator.page(pageID)
    return render(request, "sdv/predictPage.html", {"page": page, "detailpage": "predictPage",
                                                  "title": 'predictPage', "listNum": len(predictList)
                                                  })


def history(request):
    historyList = SHistoryData.objects.all()


    print(historyList[0].hd_startTime)

    return render(request, 'sdv/history.html', {"List": historyList, "title": "history",
                                                "listNum": len(historyList)})


def predict(request):
    predictList = PredictData.objects.all()

    return render(request, 'sdv/predict.html', {"List": predictList, "title": "predict",
                                                "listNum": len(predictList)})


def indicator(request):
    indicatorList = TechIndicator.objects.all()

    return render(request, 'sdv/indicator.html', {"List": indicatorList, "title": 'indicator',
                                                  "listNum": len(indicatorList)})


def tidata(request):
    tidataList = TIData.objects.all()

    return render(request, 'sdv/tidata.html', {"List": tidataList, "title": "tidata",
                                               "listNum": len(tidataList)})

def his_v(request):
    tidataList = TIData.objects.all()

    return render(request, 'sdv/his_data_v.html', {"List": tidataList, "title": "tidata",
                                               "listNum": len(tidataList)})

def pred_v(request):
    tidataList = TIData.objects.all()

    return render(request, 'sdv/pred_data_v.html', {"List": tidataList, "title": "tidata",
                                               "listNum": len(tidataList)})

def ti_v(request):
    tidataList = TIData.objects.all()

    return render(request, 'sdv/ti_data_v.html', {"List": tidataList, "title": "tidata",
                                               "listNum": len(tidataList)})


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

