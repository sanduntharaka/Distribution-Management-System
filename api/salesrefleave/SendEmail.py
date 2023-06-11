from django.core.mail import send_mail
from django.conf import settings
from system_settings.models import SystemSettings
from sales_ref_leave.models import SalesRefLeave


class SendEmail:
    def __init__(self, id, supurvisor) -> None:
        self.email_to = SystemSettings.objects.get(id=1).hr_email
        self.leave = SalesRefLeave.objects.get(id=id)
        self.supervisor = supurvisor
        print(self.leave)

    def send_email(self):
        try:
            data = {
                'full_name': self.leave.salesref.full_name,
                'nic': self.leave.salesref.nic,
                'leave_apply_date': self.leave.leave_apply_date,
                'leave_end_date': self.leave.leave_end_date,
                'reson': self.leave.reason,
                'no_of_dates': self.leave.number_of_dates,
                'is_annual': self.leave.is_annual,
                'is_casual': self.leave.is_casual,
                'is_sick': self.leave.is_sick,
                'return_to_work': self.leave.return_to_work,
                'approve_by': self.leave.approved_by.full_name,
                'approve_nic': self.leave.approved_by.nic,
            }
            subject = "Approved Employee Leave Details"
            message = f"Hi \n\n New leave request has been approved.\nRequest By:{data['full_name']}\nNic:{data['nic']}\nLeave apply date:{data['leave_apply_date']}\nLeave end date:{data['leave_end_date']}\nLeave reason:{data['reson']}\nNumber of dates:{data['no_of_dates']}\nAnual:{'Yes' if data['is_annual'] else 'No'}\nCasual:{'Yes' if data['is_casual'] else 'No'}\nSick:{'Yes' if data['is_sick'] else 'No'}\nReturn to work:{data['return_to_work']}\nApproved by:{data['approve_by']}\nApproved by NIC:{data['approve_nic']}\n\nThank you."
            send_mail(
                subject=subject,  # title
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[self.email_to, self.supervisor],
                fail_silently=False
            )
        except Exception as e:
            print(e)
