from django.db import models
from userdetails.models import UserDetails
from django.conf import settings
User = settings.AUTH_USER_MODEL


class SalesRefLeave(models.Model):
    salesref = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    leave_apply_date = models.DateField()
    leave_end_date = models.DateField()
    reason = models.TextField()
    number_of_dates = models.IntegerField()
    leave_type = models.TextField(max_length=50)
    return_to_work = models.DateField()
    approved = models.BooleanField()
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
