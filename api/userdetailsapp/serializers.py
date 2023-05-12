from rest_framework import serializers
from userdetails.models import UserDetails
from users.models import UserAccount


class UserDetailsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ('__all__')


class UserDetailsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ('full_name', 'address', 'designation', 'dob', 'company_number', 'personal_number',
                  'home_number', 'immediate_contact_person_name', 'immediate_contact_person_number', 'terriotory')


class AllDistributorsSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.id')
    user_name = serializers.CharField(source='user.user_name')

    class Meta:
        model = UserDetails
        fields = ('id', 'user', 'full_name', 'user_name')


class GetBasicUserDetail(serializers.ModelSerializer):
    user = serializers.CharField(source='user.email')

    class Meta:
        model = UserDetails
        fields = ('id', 'user', 'photo', 'full_name', 'address', 'designation', 'company_number', 'personal_number',
                  'home_number', 'immediate_contact_person_name', 'immediate_contact_person_number', 'terriotory')


class ProfilePicUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ('photo',)
