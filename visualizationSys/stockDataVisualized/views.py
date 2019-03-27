from django.shortcuts import render
from django.shortcuts import render
import pandas as pd
# import os
# Create your views here.
from .models import Stock, SHistoryData
def index(request):
    stocksList = Stock.objects.all()
    
    return render(request, 'sdv/index.html', {"stocksList": stocksList})


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

