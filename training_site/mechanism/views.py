from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UploadImage
from .forms import UploadFileForm
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper


@csrf_exempt
def index(req):
    if req.method == 'POST':
        form = UploadFileForm(req.POST, req.FILES)
        predictor_path = 'mechanism/static/shape_predictor_68_face_landmarks.dat'
        if form.is_valid():
            req_file = req.FILES['file']
            align = req.POST.get('control_id')[0].upper()
            extension = req_file.name.split('.').pop()
            img_data = {
                'filename': '',
                'original_filename': req_file.name,
                'file': req_file,
                'align': align,
                'extension': extension
                }
            count = UploadImage.objects.filter(align=align).count()
            # Create Image Object for Save to DB
            img_obj = UploadImage(**img_data)
            img_obj.filename = img_obj.rename(count)
            req_file.name = img_obj.filename
            img_obj.yaml_file, shape_parts = img_obj.extract_feature(predictor_path)
            w, h = img_obj.get_shape()
            img_obj.width = w
            img_obj.height = h
            img_obj.save()

            del img_data['file']
            img_data['shape_parts'] = shape_parts
            img_data['filename'] = img_obj.filename
            img_data['path'] = img_obj.file.url
            return JsonResponse(img_data)
        else:
            print('Form is not valid')

    context = {
        'filename': '-',
        'img_path': '/static/images/default_imageview.jpg',
        'control': ('left', 'right')
        }
    return render(req, 'mechanism/index.html', context)


def imageview(req, control_id, filename):
    context = {
        'img_path': 'static/default_imageview.jpg'
    }
    if req.is_ajax():
        img_obj = UploadImage.objects.filter(original_filename=filename)[0]
        context = {
            'img_path': img_obj.file.url,
            'control_id': control_id
        }
    return render(req, 'mechanism/components/imageview.html', context)
