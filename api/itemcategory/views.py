from rest_framework import status
from rest_framework.response import Response
from item_category.models import Category
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateCategory(generics.CreateAPIView):
    serializer_class = serializers.CreateCategorySerializer
    queryset = Category.objects.all()


class UpdateCategory(generics.UpdateAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()


class DeleteCategory(generics.DestroyAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()


class AllCategory(generics.ListAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()
