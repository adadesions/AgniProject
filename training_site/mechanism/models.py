from django.db import models
from django.forms import ModelForm


class UploadImage(models.Model):
    alignment = (
        ('L', 'left'),
        ('R', 'right')
    )
    id = models.AutoField(primary_key=True)
    filename = models.CharField(max_length=128, default='face_no_id')
    original_filename = models.CharField(max_length=128, default="no_name")
    file = models.ImageField(upload_to='uploads/')
    extension = models.CharField(max_length=10)
    align = models.CharField(max_length=1, choices=alignment, default='L')
    upload_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{0}\t{1}".format(self.filename, self.upload_date)

    def rename(self, count):
        new_name = '_'.join(['Face', str(self.align), str(count)])
        return new_name


class UploadFileForm(ModelForm):
    class Meta:
        model = UploadImage
        fields = ['file', 'filename']
