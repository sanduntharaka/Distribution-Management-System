from rest_framework import status
from rest_framework.response import Response
from dealer_category.models import DealerCategory
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404


class CreateCategory(generics.CreateAPIView):
    serializer_class = serializers.CreateCategorySerializer
    queryset = DealerCategory.objects.all()


class AllCreatedCategories(generics.ListAPIView):
    serializer_class = serializers.GetAllCategorySerializer
    queryset = DealerCategory.objects.all()


class EditCategory(generics.UpdateAPIView):
    serializer_class = serializers.EditCategorySerializer
    queryset = DealerCategory.objects.all()


class DeleteCategory(generics.DestroyAPIView):
    serializer_class = serializers.CreateCategorySerializer
    queryset = DealerCategory.objects.all()
