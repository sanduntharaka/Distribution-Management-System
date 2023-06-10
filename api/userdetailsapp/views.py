from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from userdetails.models import UserDetails
from users.models import UserAccount
from . import serializers
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateUserDetails(generics.CreateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsCreateSerializer

    def create(self, request):
        user = UserAccount.objects.get(id=request.data['user'])
        request.data['user'] = user.id
        serializer = serializers.UserDetailsCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class EditUserDetails(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsUpdateSerializer


class DeleteUserDetails(generics.DestroyAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsUpdateSerializer


class AllUserDetails(generics.ListAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsCreateSerializer


class AllUsers(generics.ListAPIView):
    queryset = UserAccount.objects.filter(is_superuser=False)
    serializer_class = serializers.GetUserSerializer


class getUsersDetailsByMainUser(generics.RetrieveAPIView):

    serializer_class = serializers.GetBasicUserDetail

    def get_object(self, **kwargs):
        item = self.kwargs.get('id')

        return get_object_or_404(UserDetails, user__id=item)


class getUsersDetails(generics.RetrieveAPIView):

    serializer_class = serializers.GetBasicUserDetail

    def get_object(self, **kwargs):
        item = self.kwargs.get('id')

        return get_object_or_404(UserDetails, id=item)


class AllManagers(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_manager=True)
        return get_list_or_404(queryset)


class AllDistributors(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_distributor=True)
        return get_list_or_404(queryset)


class AllSalesRefs(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_salesref=True)
        return get_list_or_404(queryset)


class ProfilePictureUpload(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.ProfilePicUpdateSerializer
