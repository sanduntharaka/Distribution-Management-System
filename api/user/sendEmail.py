from django.core.mail import send_mail
from django.conf import settings


class PasswordEmail:
    @staticmethod
    def send_email(data):
        print(data)
        send_mail(
            subject=data['email_subject'],
            message=data['email_body'],
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=(data['email_to'],),
            fail_silently=False
        )
