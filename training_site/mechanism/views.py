from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import UploadFileForm


@csrf_exempt
def index(req):
    if req.method == 'POST':
        form = UploadFileForm(req.POST, req.FILES)
        if form.is_valid():
            filename = 'ada'
            data = {'filename': req.FILES['file'].name}
            return JsonResponse(data)

    return render(req, 'mechanism/index.html', {'filename': '-'})
