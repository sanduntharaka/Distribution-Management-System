from rest_framework import filters
import json
from executive_distributor.models import ExecutiveDistributor
from exceutive_manager.models import ExecutiveManager
from distrubutor_salesref.models import SalesRefDistributor
from django.db.models import Exists, OuterRef
from django.db.models import Subquery
from manager_distributor.models import ManagerDistributor
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from userdetails.models import UserDetails, Terriotory, UserTerriotory
from users.models import UserAccount
from . import serializers
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateUserDetails(generics.CreateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsCreateSerializer

    def create(self, request):
        request_data_user = request.data['data']
        request_data_terriotories = request.data['terriotories']

        user = UserAccount.objects.get(id=request_data_user['user'])

        request_data_user['user'] = user.id
        serializer = serializers.UserDetailsCreateSerializer(
            data=request_data_user)
        if serializer.is_valid():
            saved_id = serializer.save()

            try:

                for terriotory in request_data_terriotories:

                    try:
                        created_terriotory = Terriotory.objects.get(
                            terriotory_name=terriotory['terriotory_name'], code=terriotory['code'])
                        terriotory['territory'] = created_terriotory.id
                    except Terriotory.DoesNotExist:
                        new_terrotory_serializer = serializers.TerriotoryCreateSerializer(
                            data=terriotory)
                        if new_terrotory_serializer.is_valid():
                            new_terrotory = new_terrotory_serializer.save()
                            terriotory['territory'] = new_terrotory.id

                    terriotory['user_detail'] = saved_id.id
                    terriotory_serializer = serializers.UserDetailsTerriotoryCreateSerializer(
                        data=terriotory)

                    if terriotory_serializer.is_valid():
                        terriotory_serializer.save()

                return Response({"status": "success"}, status=status.HTTP_201_CREATED)
            except:
                UserDetails.objects.get(id=saved_id).delete()
                return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class EditUserDetails(generics.UpdateAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsUpdateSerializer


class DeleteUserDetails(generics.DestroyAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = serializers.UserDetailsUpdateSerializer


class AllUserDetails(APIView):

    def get(self, request):
        if request.user.is_excecutive:
            manager_ids = ExecutiveManager.objects.filter(
                executive__user=request.user.id).values_list('manager', flat=True)
            distributors_ids = ManagerDistributor.objects.filter(
                manager__in=manager_ids).values_list('distributor', flat=True)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__in=distributors_ids).values_list('sales_ref', flat=True)
            employees = list(manager_ids) + \
                list(distributors_ids) + list(salesrefs_ids)
        elif request.user.is_manager:
            distributors_ids = ManagerDistributor.objects.filter(
                manager__user=request.user.id).values_list('distributor', flat=True)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__in=distributors_ids).values_list('sales_ref', flat=True)
            employees = list(distributors_ids) + list(salesrefs_ids)
        elif request.user.is_distributor:
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user=request.user.id).values_list('sales_ref', flat=True)
            employees = list(salesrefs_ids)
        else:
            employees = UserDetails.objects.values_list('id', flat=True)

        user_details = UserDetails.objects.filter(id__in=employees)
        serializer = serializers.GetUserDetailsSerializer(
            user_details, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


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


class AllNewExecutives(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        linked_executives = ExecutiveManager.objects.filter(
            executive=OuterRef('pk'))
        new_details = UserDetails.objects.filter(
            user__is_excecutive=True).exclude(Exists(linked_executives))
        return get_list_or_404(new_details)


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
            manager=item).values_list('distributor', flat=True)
        distributors = UserDetails.objects.filter(id__in=distributor_ids)
        return get_list_or_404(distributors)


class AllDistributorsByExcecutive(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        distributor_ids = ExecutiveDistributor.objects.filter(
            executive=item).values_list('distributor', flat=True)
        distributors = UserDetails.objects.filter(id__in=distributor_ids)
        return get_list_or_404(distributors)


class AllSalesRefs(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        queryset = UserDetails.objects.filter(user__is_salesref=True)
        return get_list_or_404(queryset)


class SalesRefsByManager(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        distributors = list(ManagerDistributor.objects.filter(
            manager__user=self.request.user.id).values_list('distributor', flat=True))
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=distributors).values_list('sales_ref', flat=True)

        queryset = UserDetails.objects.filter(id__in=list(salesrefs))
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


class AllNotExecutiveDistributor(generics.ListAPIView):

    serializer_class = serializers.AllDistributorsSerializer

    def get_queryset(self):
        linked_distributors = ExecutiveDistributor.objects.filter(
            distributor=OuterRef('pk'))

        new_details = UserDetails.objects.filter(
            user__is_distributor=True).exclude(Exists(linked_distributors))
        return get_list_or_404(new_details)


class DistributorsSrepsByManager(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        distributors = list(ManagerDistributor.objects.filter(
            added_by=request.user).values_list('distributor', flat=True))

        sreps = list(SalesRefDistributor.objects.filter(
            distributor__in=distributors).values_list('sales_ref', flat=True))
        data = []
        for i in distributors+sreps:
            data.append(
                {
                    'person': UserDetails.objects.get(id=i).full_name,
                    'id': i

                }
            )
        return Response(data=data, status=status.HTTP_200_OK)


class GetUserTerriotories(generics.ListAPIView):
    serializer_class = serializers.UserDetailsTerriotoryGetSerializer

    def get_queryset(self, *args, **kwargs):

        item = self.kwargs.get('id')
        queryset = UserTerriotory.objects.filter(user_detail=item)
        return get_list_or_404(queryset)


class CheckTerriotory(APIView):
    def get(self, request, *args, **kwargs):
        code = self.kwargs.get('code')
        try:
            query_set = Terriotory.objects.get(code=code)
            data = {'exist': True, 'terriotory': query_set.terriotory_name,
                    'code': query_set.code}
            return Response(data, status=status.HTTP_200_OK)
        except Terriotory.DoesNotExist:

            return Response({'exist': False}, status=status.HTTP_200_OK)

    # def get_queryset(self, *args, **kwargs):
    #     code = self.kwargs.get('code')

    #     return get_object_or_404(Terriotory, code=code)
    # queryset = Terriotory.objects.all()
    # filter_backends = [filters.SearchFilter]
    # search_fields = ('terriotory_name', 'code')


class AddTerriotory(APIView):
    def post(self, request, *args, **kwargs):
        user = kwargs.get('id')
        data = request.data

        save_data = {
            'user_detail': user,
        }

        try:
            created_terriotory = Terriotory.objects.get(
                terriotory_name=data['terriotory_name'], code=data['code'])
            save_data['territory'] = created_terriotory.id

        except Terriotory.DoesNotExist:
            new_terrotory_serializer = serializers.TerriotoryCreateSerializer(
                data=data)
            if new_terrotory_serializer.is_valid():
                new_terrotory = new_terrotory_serializer.save()
                save_data['territory'] = new_terrotory.id

        terriotory_serializer = serializers.UserDetailsTerriotoryCreateSerializer(
            data=save_data)

        if terriotory_serializer.is_valid():
            terriotory_serializer.save()

            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RemoveTerriotory(APIView):
    def post(self, request, *args, **kwargs):
        user = kwargs.get('id')
        data = request.data
        try:
            user_terriotory = UserTerriotory.objects.get(
                user_detail=user, territory__terriotory_name=data['terriotory_name'], territory__code=data['code'])
            user_terriotory.delete()
            return Response(status=status.HTTP_200_OK)

        except:

            return Response(status=status.HTTP_200_OK)
