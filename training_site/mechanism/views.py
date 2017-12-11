from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt


def index(req):
    return render(req, 'mechanism/index.html')


@csrf_exempt
def upload(req):
    if req.method == 'POST':
        print("Cool!")
        print(req.FILES)
    else:
        print('Booooo~')
    return HttpResponse('I\'m Ada')
