from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    def create_user(self, user_name, password=None, **other_fields):
        user = self.model(user_name=user_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, user_name, password=None, **other_fields):
        other_fields.setdefault('is_superuser', True)
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        # Include the name field when calling create_user() for the superuser
        return self.create_user(user_name=user_name, password=password, **other_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    user_name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_company = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_distributor = models.BooleanField(default=False)
    is_salesref = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_excecutive = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    objects = UserAccountManager()

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['is_company',
                       'is_manager', 'is_distributor', 'is_salesref', 'is_superuser', 'is_excecutive']

    def __str__(self) -> str:
        return self.user_name
