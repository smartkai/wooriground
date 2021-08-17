from django.urls import path
from . import views, apis
# from django.contrib.auth import views as auth_views
from django.contrib.auth import views as auth_views


app_name = "hipdrobe"
urlpatterns = [
    path('', views.index, name='index'),
    path('wardrobe/items/', views.items, name="items" ),
    path('wardrobe/coordi/', views.coordi, name="coordi"),
    path('wardrobe/coordi/<int:c_id>/detail/', views.coordi_detail, name="coordi_detail"),
    path('wardrobe/coordi/<int:c_id>/update/', views.coordi_update, name="coordi_update"),
    path('wardrobe/stat/', views.stat, name="stat" ),
    
    path('signup/',views.signup, name="signup"),
    path('login/' ,views.signin, name="signin"),
    path('logout/' ,views.logout, name="logout"),

    # auth_views 이용
    # path('signup/', views.UserCreateView.as_view(), name='signup'),
    # path('login/', auth_views.LoginView.as_view(), name='login'),
    # path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    




    # 페이지 요청이 아닌 기능 요청은 아래쪽에서 관리
    # 대표적으로 AJAX 요청이 여기에 해당
    path('apis/parts/', apis.parts, name="parts"),
    path('apis/cate1/', apis.cate1, name="cate1"),
    path('apis/cate2/', apis.cate2, name="cate2"),
    path('apis/upload/', apis.upload, name="upload"),
    path('apis/clothes/', apis.clothes, name="clothes"),
    path('apis/additem/', apis.additem, name="additem"),
    path('apis/coordi/', apis.coordi, name="coordi_list"),
    path('apis/coordi/new/', apis.coordi_new, name="coordi_new"),
    path('apis/coordi/delete/', apis.coordi_delete, name="coordi_delete"),
    path('apis/coordi/edit/', apis.coordi_edit, name="coordi_edit"),
    path('apis/daily-status/', apis.daily_status, name="daily_status"),
    # path('check_id/',views.check_id,name="check_id"),
    path('apis/clothes_detail/', apis.clothes_detail, name="clothes_detail"),
    path('apis/updateitem/', apis.updateitem, name="updateitem"),
    path('apis/delete_clothes/', apis.delete_clothes, name="delete_clothes"),
]
