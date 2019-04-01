from django.urls import include, re_path
from . import views

app_name = 'stockDataVisualized'
urlpatterns = [
    re_path(r'^stock/$', views.stock, name='stock'),
    re_path(r'^stockPage/(\d+)/$', views.stockPage, name='stockPage'),
    re_path(r'^ajaxSP/$', views.ajaxSP, name='ajaxSP' ),
    re_path(r'^history/$', views.history, name='history'),
    re_path(r'^predict/$', views.predict, name='predict'),
    re_path(r'^historyPage/(\d+)$', views.historyPage, name='historyPage'),
    re_path(r'^predictPage/(\d+)$', views.predictPage, name='predictPage'),


    re_path(r'^indicator/$', views.indicator, name='indicator'),
    re_path(r'^tidata/$', views.tidata, name='tidata'),

    re_path(r'^his_v/$', views.his_v, name='his_v'),
    re_path(r'^pred_v/$', views.pred_v, name='pred_v'),
    re_path(r'^ti_v/$', views.ti_v, name='ti_v'),

    re_path(r'^home/$', views.home, name='home'),
]