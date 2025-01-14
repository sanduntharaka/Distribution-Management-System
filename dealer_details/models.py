from userdetails.models import UserDetails
from django.contrib.postgres.fields import ArrayField
from django.db import models
from primary_sales_area.models import PrimarySalesArea
from dealer_category.models import DealerCategory
from django.conf import settings
User = settings.AUTH_USER_MODEL


class Dealer(models.Model):

    GRADE_CHOICES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),


    )
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    psa = models.ForeignKey(PrimarySalesArea,
                            on_delete=models.PROTECT)
    category = models.ForeignKey(
        DealerCategory, on_delete=models.PROTECT)
    name = models.CharField(max_length=150, null=False)
    contact_number = models.CharField(max_length=15, null=False)
    address = models.CharField(max_length=255, null=False)
    owner_name = models.CharField(max_length=50, null=False)
    company_number = models.CharField(max_length=15, null=True, blank=True)
    owner_personal_number = models.CharField(
        max_length=15, null=True, blank=True)
    owner_home_number = models.CharField(max_length=15, null=True, blank=True)
    assistant_name = models.CharField(max_length=150, null=True, blank=True)
    assistant_contact_number = models.CharField(
        max_length=15, null=True, blank=True)
    grade = models.CharField(choices=GRADE_CHOICES, max_length=5, default='D')

    def __str__(self) -> str:
        return self.name


class DealerOrder(models.Model):
    salesref = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE)
    psa = psa = models.OneToOneField(PrimarySalesArea,
                                     on_delete=models.CASCADE)
    dealers = ArrayField(models.IntegerField())
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
