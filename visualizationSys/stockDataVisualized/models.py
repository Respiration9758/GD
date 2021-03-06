from django.db import models

# Create your models here.
class Stock(models.Model):
    code = models.CharField(max_length=100, default='')
    # blank=true允许为空
    name = models.CharField(max_length=100, blank=True, default='')
    createTime = models.DateTimeField(auto_now_add=True)
    describe = models.TextField(default='')
    isDelete = models.BooleanField(default=False)

    class Meta:
        ordering = ('createTime',)

class SHistoryData(models.Model):
    hd_startTime = models.DateTimeField(default='')
    hd_endTime = models.DateTimeField(default='')
    number = models.IntegerField(blank=True, null=True)
    # 关联外键
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    filePath = models.CharField(max_length=250, default='')
    describe = models.TextField(default='')
    createTime = models.DateTimeField(auto_now_add=True)
    isDelete = models.BooleanField(default=False)

    class Meta:
        ordering = ('createTime',)


class TechIndicator(models.Model):
    # blank=true允许为空
    name = models.CharField(max_length=100, blank=True, default='')
    shortName = models.CharField(max_length=100, default='')
    tType = models.CharField(default='均线型', max_length=100)
    interface = models.CharField(max_length=100, default='')
    parameter1 = models.CharField(max_length=100, default='')
    parameter2 = models.CharField(max_length=100, default='')
    parameter3 = models.CharField(max_length=100, default='')
    parameter4 = models.CharField(max_length=100, default='')
    parameter5 = models.CharField(max_length=100, default='')
    describe = models.TextField(default='')
    KY1 = models.CharField(max_length=100, default='')
    KY2 = models.CharField(max_length=100, default='')
    KY3 = models.CharField(max_length=100, default='')
    createTime = models.DateTimeField(auto_now_add=True)
    isDelete = models.BooleanField(default=False)

    class Meta:
        ordering = ('createTime',)


class TIData(models.Model):
    # 一组技术指标数据对应一个指标，一组历史数据
    stockData = models.ForeignKey(SHistoryData, on_delete=models.CASCADE)
    TI = models.ForeignKey(TechIndicator, on_delete=models.CASCADE)
    number = models.IntegerField(blank=True, null=True)
    filePath = models.CharField(max_length=250, default='')
    describe = models.TextField(default='')
    # 指标数据集名称
    KY1 = models.CharField(max_length=100, default='')
    KY2 = models.CharField(max_length=100, default='')
    KY3 = models.CharField(max_length=100, default='')
    createTime = models.DateTimeField(auto_now_add=True)
    isDelete = models.BooleanField(default=False)

    class Meta:
        ordering = ('createTime',)


class PredictData(models.Model):
    numberOfHD = models.IntegerField(blank=True, null=True)
    startTime = models.DateTimeField(default='')
    predictTime = models.DateTimeField(default='')
    # 关联外键
    SHD = models.ForeignKey(SHistoryData, on_delete=models.CASCADE)
    filePath = models.CharField(max_length=250, default='')
    describe = models.TextField(default='')
    createTime = models.DateTimeField(auto_now_add=True)
    isDelete = models.BooleanField(default=False)

    class Meta:
        ordering = ('createTime',)
