import dlib

from django.db import models
from django.forms import ModelForm
from yamlfield.fields import YAMLField
from skimage import io, img_as_ubyte
from skimage.transform import resize
from skimage.draw import circle
from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper


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
    width = models.SmallIntegerField(default=0)
    height = models.SmallIntegerField(default=0)
    upload_date = models.DateTimeField(auto_now=True)
    yaml_file = YAMLField()

    def __str__(self):
        return "{0}\t{1}".format(self.filename, self.upload_date)

    def rename(self, count):
        new_name = '_'.join(['Face', str(self.align), str(count)])
        new_name += '.'+str(self.extension)
        return new_name

    def get_shape(self):
        face_path = self.file
        img = io.imread(face_path)
        width = img.shape[0]
        height = img.shape[1]
        return width, height

    def extract_feature(self, predictor_path):
        face_path = self.file
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor(predictor_path)
        img = resize(io.imread(face_path), (700, 700), mode='reflect')
        img = img_as_ubyte(img)
        dets = detector(img, 1)
        for d in dets:
            shape = predictor(img, d)
        try:
            shape
        except NameError:
            print("Not found any face")
            return []
        else:
            result = []
            for i in range(shape.num_parts):
                point = shape.part(i)
                result.append({
                    'x': point.x,
                    'y': point.y,
                    'z': 0
                })
            yaml_file = dump({
                'filename': self.filename,
                'features': result
            })
            return yaml_file, result


class UploadFileForm(ModelForm):
    class Meta:
        model = UploadImage
        fields = ['file', 'filename']
