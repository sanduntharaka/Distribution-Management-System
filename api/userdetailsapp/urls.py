from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateUserDetails.as_view()),
    path('edit/<int:pk>', views.EditUserDetails.as_view()),
    path('delete/<int:pk>', views.DeleteUserDetails.as_view()),
    path("all/", views.AllUserDetails.as_view()),

    path("all/users/", views.AllUsers.as_view()),
    path('executives/', views.AllExecutives.as_view()),
    path('executives/new/', views.AllNewExecutives.as_view()),

    path('managers/', views.AllManagers.as_view()),
    path('distributors/', views.AllDistributors.as_view()),
    path('managers/new/', views.AllNewManagers.as_view()),

    path('distributors/new/', views.AllNewDistributors.as_view()),
    path('distributors/by/manager/<id>',
         views.AllDistributorsByManager.as_view()),
    path('distributors/by/executive/<id>',
         views.AllDistributorsByExcecutive.as_view()),
    path('distributor/not/executive/',
         views.AllNotExecutiveDistributor.as_view()),


    path('salesrefs/', views.AllSalesRefs.as_view()),
    path('salesrefs/by/manager/', views.SalesRefsByManager.as_view()),

    path('distri-srep/by/manager/', views.DistributorsSrepsByManager.as_view()),


    path('salesrefs/new/', views.AllNewSalesrefs.as_view()),


    path('get/<id>', views.getUsersDetails.as_view()),
    path('get/terriotires/<id>', views.GetUserTerriotories.as_view()),

    path('upload/image/<int:pk>', views.ProfilePictureUpload.as_view()),
    path('get/user/<id>', views.getUsersDetailsByMainUser.as_view()),

    path('search/terriotory/<code>', views.CheckTerriotory.as_view()),

    path('add/terriotory/<id>', views.AddTerriotory.as_view()),
    path('remove/terriotory/<id>', views.RemoveTerriotory.as_view()),


]
# users/distri-srep/by/manager/
