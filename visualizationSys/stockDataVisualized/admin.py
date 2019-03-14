from django.contrib import admin

# Register your models here.
from .models import Stock, SHistoryData,TechIndicator,TIData,PredictData

# 注册
admin.site.register(Stock)
admin.site.register(SHistoryData)
admin.site.register(TechIndicator)
admin.site.register(TIData)
admin.site.register(PredictData)

