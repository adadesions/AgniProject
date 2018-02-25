from django.db import models
from django.forms import ModelForm
from .models import UploadImage


class UploadFileForm(ModelForm):
    class Meta:
        model = UploadImage
        fields = ['file', 'filename']
