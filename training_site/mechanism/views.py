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
            img_data = {
                'filename': req_file.name,
                'file': req_file
                }
            img_obj = UploadImage(**img_data)
            img_obj.save()
            del img_data['file']
            return JsonResponse(img_data)
        else:
            print('Form is not valid')            

    return render(req, 'mechanism/index.html', {'filename': '-'})
