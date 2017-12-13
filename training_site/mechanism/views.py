from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UploadImage
from .forms import UploadFileForm


@csrf_exempt
def index(req):
    if req.method == 'POST':
        form = UploadFileForm(req.POST, req.FILES)
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
            img_obj = UploadImage(**img_data)
            img_obj.filename = img_obj.rename(count)
            img_obj.save()

            del img_data['file']
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
    
