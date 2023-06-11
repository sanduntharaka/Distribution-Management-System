from distrubutor_salesref.models import SalesRefDistributor
from django.db.models import Exists, OuterRef
from django.db.models import Subquery
from manager_distributor.models import ManagerDistributor
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from userdetails.models import UserDetails
from users.models import UserAccount
from rest_framework.views import APIView
from . import serializers
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from core import settings
from .sendEmail import PasswordEmail


class PasswordResetEmail(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data['email']
        try:
            if UserDetails.objects.filter(email=email).exists():
                user_details = UserDetails.objects.get(email=email)
                user = user_details.user
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user=user)
                absurl = settings.DOMAIN + '/reset/'+uidb64+'/'+token
                email_body = 'Hello \n'+user.user_name + \
                    ' Use link below to reset your password \n'+absurl
                data = {
                    'email_subject': 'Reset your password',
                    'email_body': email_body,
                    'email_to': user_details.email,
                }
                PasswordEmail.send_email(data)
                return Response({'success', 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
            else:
                return Response({'error', 'This email has not assigned actual user. Please enter valid email'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'error', e}, status=status.HTTP_406_NOT_ACCEPTABLE)


class PasswordTokenCheck(APIView):
    permission_classes = [AllowAny]
# test001pwdtest

    def post(self, request):
        try:
            data = {
                "uidb64": request.data['uid'],
                "token": request.data['token'],
                "password": request.data['new_password']

            }

            id = smart_str(urlsafe_base64_decode(data['uidb64']))
            user = UserAccount.objects.get(id=id)
            if PasswordResetTokenGenerator().check_token(user=user, token=data['token']):
                serializer = serializers.SetNewPasswordSeralizer(data=data)
                serializer.is_valid(raise_exception=True)
                print(data)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
