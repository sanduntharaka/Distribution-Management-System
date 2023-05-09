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
    is_annual = models.BooleanField(default=False)
    is_casual = models.BooleanField(default=False)
    is_sick = models.BooleanField(default=False)
    return_to_work = models.DateField()
    approved = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    def get_leave_type(self):
        leave_type = ''
        if self.is_annual:
            leave_type = leave_type + ' Annual'
        if self.is_casual:
            leave_type = leave_type + ' Casual'
        if self.is_sick:
            leave_type = leave_type + ' Sick'
        return leave_type

    def get_aproved_status(self):
        if self.approved:
            return 'Yes'
        else:
            return 'No'
