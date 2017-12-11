from django.db import models
from django import forms


class UploadFileForm(forms.Form):
    filename = forms.CharField(max_length=512)
    file = forms.ImageField()
