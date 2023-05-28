from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **other_fields):

        if not email:
            raise ValueError('Users must have email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **other_fields):
        other_fields.setdefault('is_superuser', True)
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        # Include the name field when calling create_user() for the superuser
        return self.create_user(email=email, password=password, **other_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    nic = models.CharField(max_length=20, default=None, unique=True)
    user_name = models.CharField(max_length=255, default=None, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_companyStaff = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_distributor = models.BooleanField(default=False)
    is_salesref = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name', 'nic', 'is_companyStaff',
                       'is_manager', 'is_distributor', 'is_salesref', 'is_superuser']

    def __str__(self) -> str:
        return self.email
