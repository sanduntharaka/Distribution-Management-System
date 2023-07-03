from exceutive_manager.models import ExecutiveManager
from distrubutor_salesref.models import SalesRefDistributor
from django.db.models import Exists, OuterRef
from django.db.models import Subquery
from manager_distributor.models import ManagerDistributor
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


class AllExecutives(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_excecutive=True)
        return get_list_or_404(queryset)


class AllManagers(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_manager=True)
        return get_list_or_404(queryset)


class AllNewManagers(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        linked_managers = ExecutiveManager.objects.filter(
            manager=OuterRef('pk'))

        new_details = UserDetails.objects.filter(
            user__is_manager=True).exclude(Exists(linked_managers))
        return get_list_or_404(new_details)


class AllDistributors(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_distributor=True)
        return get_list_or_404(queryset)


class AllNewDistributors(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        linked_distributors = ManagerDistributor.objects.filter(
            distributor=OuterRef('pk'))

        new_details = UserDetails.objects.filter(
            user__is_distributor=True).exclude(Exists(linked_distributors))
        return get_list_or_404(new_details)
#


class AllDistributorsByManager(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        distributor_ids = ManagerDistributor.objects.filter(
            added_by=item).values_list('distributor', flat=True)
        distributors = UserDetails.objects.filter(id__in=distributor_ids)
        return get_list_or_404(distributors)


class AllSalesRefs(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_salesref=True)
        return get_list_or_404(queryset)


class AllNewSalesrefs(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        linked_salesrefs = SalesRefDistributor.objects.filter(
            sales_ref=OuterRef('pk'))

        new_details = UserDetails.objects.filter(
            user__is_salesref=True).exclude(Exists(linked_salesrefs))
        return get_list_or_404(new_details)


class ProfilePictureUpload(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.ProfilePicUpdateSerializer
