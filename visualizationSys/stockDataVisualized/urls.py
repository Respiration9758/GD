from django.urls import include, re_path
from . import views

app_name = 'stockDataVisualized'
urlpatterns = [
    re_path(r'^index/$', views.index, name='index'),
    re_path(r'^home/$', views.home, name='home'),
]