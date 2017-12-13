from django.db import models
from django.forms import ModelForm


class UploadImage(models.Model):
    alignment = (
        ('L', 'left'),
        ('R', 'right')
    )

    filename = models.CharField(max_length=128)
    file = models.ImageField(upload_to='uploads/')
    align = models.CharField(max_length=1, choices=alignment, default='L')
    upload_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{0}\t{1}".format(self.filename, self.upload_date)


class UploadFileForm(ModelForm):
    class Meta:
        model = UploadImage
        fields = ['file', 'filename']
