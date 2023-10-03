
from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

DESIGNATIONS = (
    ('Superuser', 'Superuser'),
    ('Company', 'Company'),
    ('Executive', 'Executive'),
    ('Manager', 'Manager'),
    ('Distributor', 'Distributor'),
    ('Sales Rep', 'Sales Rep'),

)


class UserDetails(models.Model):
    def user_photo_upload_path(instance, filename):
        return f'user/{instance.id}/{filename}'

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    email = models.EmailField(unique=True)
    nic = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=255, null=False)
    address = models.CharField(max_length=255, null=False)
    designation = models.CharField(
        choices=DESIGNATIONS, max_length=50, null=False)
    dob = models.DateField(null=True)
    company_number = models.CharField(max_length=15, null=True)
    personal_number = models.CharField(max_length=15, null=True)
    home_number = models.CharField(max_length=15, null=True)
    immediate_contact_person_name = models.CharField(
        max_length=150, null=True)
    immediate_contact_person_number = models.CharField(
        max_length=15, null=True)
    photo = models.ImageField(upload_to=user_photo_upload_path, blank=True)

    def getTerrotories(self):
        terriotories = UserTerriotory.objects.filter(user_detail=self.id)
        terriotories_list = [i.territory.terriotory_name for i in terriotories]
        return ', '.join(terriotories_list)

    def getTerrotoriesList(self):
        terriotories = UserTerriotory.objects.filter(user_detail=self.id)
        terriotories_list = [i.territory.terriotory_name for i in terriotories]
        return terriotories_list


class Terriotory(models.Model):
    terriotory_name = models.CharField(max_length=20)
    code = models.CharField(max_length=4, blank=True, null=True)


class UserTerriotory(models.Model):
    user_detail = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    territory = models.ForeignKey(Terriotory, on_delete=models.CASCADE)

    def isExist(self):
        return True

    def isOld(self):
        return True
