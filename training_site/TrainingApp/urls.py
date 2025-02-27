from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'TrainingApp'
urlpatterns = [
    path('', views.index, name='index'),
    path(
        'imageview/<control_id>/<filename>',
        views.imageview, name='imageview'
    ),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
