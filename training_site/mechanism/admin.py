from django.contrib import admin
from mechanism.models import UploadImage


class UploadImageAdmin(admin.ModelAdmin):
    pass

admin.site.register(UploadImage, UploadImageAdmin)