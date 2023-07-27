from data_classes.UsersUderCompany import UsersUnderCompany
from data_classes.UsersUnderExecutive import UsersUnderExecutive
from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from data_classes.UsersUnderDestributor import UsersUnderDestributor
from data_classes.UsersUnderManager import UsersUnderManager
from data_classes.UsersUnderExecutive import UsersUnderExecutive


class AllDealerDetails(generics.ListAPIView):
    queryset = Dealer.objects.all()
    serializer_class = serializers.DealerDetailsSerializer


class AllDealerDetailsBy(APIView):
    def get(self, *args, **kwargs):
        try:
            user_details_id = self.kwargs.get('id')
            user = self.request.user.id
            if self.request.user.is_company:
                user_details = UsersUnderCompany(user_details_id)
                users = user_details.get_users_under_to_me_ids()

            if self.request.user.is_manager:
                user_details = UsersUnderManager(user_details_id)
                users = user_details.get_users_under_to_me_with_me_ids()

            if self.request.user.is_excecutive:
                user_details = UsersUnderExecutive(user_details_id)
                users = user_details.get_users_in_my_cluster_ids()

            if self.request.user.is_distributor:
                user_details = UsersUnderDestributor(user_details_id)
                users = user_details.get_users_under_to_me_with_me_ids()

            if self.request.user.is_salesref:
                users = [user_details_id]
            user_ids = UserDetails.objects.filter(
                id__in=users).values_list('user', flat=True)
            dealers = Dealer.objects.filter(
                added_by__in=user_ids)
            serializer = serializers.DealerDetailsSerializer(
                dealers, many=True)
            #
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllDealerDetailsByManager(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')

        distributors = ManagerDistributor.objects.filter(
            manager=item).values('distributor')
        distributors_id = [distributor['distributor']
                           for distributor in distributors]
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=distributors_id).values('sales_ref')
        distributors = SalesRefDistributor.objects.filter(
            distributor__in=distributors_id).values('distributor')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        [salesrefs_ids.append(distributor['distributor'])
         for distributor in distributors]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        dealers = Dealer.objects.filter(added_by__in=salesref_users_id)
        serializer = serializers.DealerDetailsSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)