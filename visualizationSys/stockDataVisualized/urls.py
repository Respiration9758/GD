from django.urls import include, re_path
from . import views

app_name = 'stockDataVisualized'
urlpatterns = [
    re_path(r'^stockPage/(\d+)/$', views.stockPage, name='stockPage'),
    re_path(r'^historyPage/(\d+)/$', views.historyPage, name='historyPage'),
    re_path(r'^predictPage/(\d+)/$', views.predictPage, name='predictPage'),



    re_path(r'^indicatorPage/(\d+)/$', views.indicatorPage, name='indicatorPage'),
    re_path(r'^tidataPage/(\d+)/$', views.tidataPage, name='tidataPage'),

    re_path(r'^his_v/$', views.his_v, name='his_v'),
    re_path(r'^pred_v/$', views.pred_v, name='pred_v'),
    re_path(r'^ti_v/$', views.ti_v, name='ti_v'),
    re_path(r'showIndicator/$', views.showIndicator, name='showIndicator'),
    re_path(r'obtain_tidata/$', views.obtain_tidata, name='obtain_tidata'),

    re_path(r'^add_sh/$', views.add_sh, name='add_sh'),

    re_path(r'sto_delete/$', views.sto_delete, name='sto_delete'),
    re_path(r'sto_add/$', views.sto_add, name='sto_add'),
    re_path(r'^checkCode/$', views.checkCode, name='checkCode'),

    re_path(r'sh_delete/$', views.sh_delete, name='sh_delete'),
    re_path(r'^sh_add/$', views.sh_add, name='sh_add'),
    re_path(r'showStock/$', views.showStock, name='showStock'),

    re_path(r'tid_delete/$', views.tid_delete, name='tid_delete'),
    re_path(r'^tid_add/$', views.tid_add, name='tid_add'),
    re_path(r'showHistory/$', views.showHistory, name='showHistory'),

    re_path(r'pd_delete/$', views.pd_delete, name='pd_delete'),
    re_path(r'^pd_add/$', views.pd_add, name='pd_add'),
    re_path(r'obtain_time/$', views.obtain_time, name='obtain_time'),


    re_path(r'i_delete/$', views.i_delete, name='i_delete'),



    re_path(r'$', views.home, name='home'),
    re_path(r'^home/$', views.home, name='home'),

]