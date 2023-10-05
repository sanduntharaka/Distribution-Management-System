from rest_framework import status
from rest_framework.response import Response
from dealer_details.models import Dealer, DealerCategory
from primary_sales_area.models import PrimarySalesArea
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from userdetails.models import UserDetails
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class ByDistributor(APIView):
    def get(self, request, *args, **kwargs):
        item = self.kwargs.get('id')

        distributor = SalesRefDistributor.objects.filter(
            distributor=item).first()
        manager_name = ManagerDistributor.objects.get(
            distributor=distributor.distributor.id).manager.full_name
        distributor_name = distributor.distributor.full_name
        terriotory = distributor.distributor.getTerrotories()
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')

        user_details_ids = [distributor.distributor.id]

        for salesref in salesrefs:
            user_details_ids.append(salesref['sales_ref'])

        users = UserDetails.objects.filter(
            id__in=user_details_ids).values('user')

        users_ids = [user['user'] for user in users]

        dealers = Dealer.objects.filter(added_by__in=users_ids).all()
        psas = dealers.values('psa').distinct()
        psa_ids = [psa['psa'] for psa in psas]
        categories = dealers.values('category').distinct()
        category_ids = [category['category'] for category in categories]

        psa_names = PrimarySalesArea.objects.filter(
            id__in=psa_ids).values('area_name')
        category_names = DealerCategory.objects.filter(
            id__in=category_ids).values('category_name')

        details = {}
        for psa in psa_ids:
            cats = {}
            for i in category_ids:
                category_name = DealerCategory.objects.get(
                    id=i).category_name
                cats[category_name] = Dealer.objects.filter(
                    category_id=i, psa=psa).count()
            psa_name = PrimarySalesArea.objects.get(
                id=psa).area_name
            details[psa_name] = cats
        data = {
            'manager_name': manager_name,
            'distributor_name': distributor_name,
            'terriotory': terriotory,
            'category_names': [category_name['category_name'] for category_name in category_names],
            'psas': [area_name['area_name'] for area_name in psa_names],
            'details': details
        }

        print(data)
        return Response(data=data, status=status.HTTP_200_OK)


# class FilterByCategoryDistributor(APIView):
#     def post(self, request, *args, **kwargs):
#         item = self.kwargs.get('id')
#         category = int(request.data['category'])
#         invoices = SalesRefInvoice.objects.filter(
#             dis_sales_ref__distributor=item)
#         filters = {
#             'bill__in': invoices
#         }
#         if category != -1:
#             filters['item__category'] = category
#         items = InvoiceIntem.objects.filter(**filters)
#         serializer = serializers.InvoiceItemSerializer(items, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
