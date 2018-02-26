from django.shortcuts import render


def index(request):
    return render(request, 'FacialValidationApp/index.html')

def face3d(request):
    return render(request, 'FacialValidationApp/Face3D.html')
