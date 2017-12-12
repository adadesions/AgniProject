from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'machanism'
urlpatterns = [
    path('', views.index, name='index'),
    path('imageview/<filename>', views.imageview, name='imageview'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
