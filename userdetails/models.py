
from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class UserDetails(models.Model):
    def user_photo_upload_path(instance, filename):
        return f'user/{instance.id}/{filename}'

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    full_name = models.CharField(max_length=255, null=False)
    address = models.CharField(max_length=255, null=False)
    designation = models.CharField(max_length=50, null=False)
    dob = models.DateField(null=True)
    company_number = models.CharField(max_length=15, null=True)
    personal_number = models.CharField(max_length=15, null=True)
    home_number = models.CharField(max_length=15, null=True)
    immediate_contact_person_name = models.CharField(
        max_length=150, null=True)
    immediate_contact_person_number = models.CharField(
        max_length=15, null=True)
    terriotory = models.CharField(max_length=100, null=False)
    photo = models.ImageField(upload_to=user_photo_upload_path, blank=True)
