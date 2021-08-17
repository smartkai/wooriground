from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, get_user_model
import simplejson as json
from .forms import UserForm, LoginForm

# Model
from .models import *

# Custom
from .utils import _coordi_to_dict








# Create your views here.
# -----------------------------------------------------------------------------
# index
# -----------------------------------------------------------------------------
def index(request):
    return render(request, 'hipdrobe/index.html')


# -----------------------------------------------------------------------------
# wardrobe menu
# -----------------------------------------------------------------------------
def items(request):
    # 로그인 안 해도 화면은 보여주고 실제 동작 할때 로그인 하라고 하는 게 나을 것
    # 같아서 로그인 체크 안 함

    # 시연용 테스트 코드 
    # 실제로 구현할 땐 이렇게 하면 안 되지만 그냥 보여주기 용
    # 실제로 구현할 땐 서버에서 일정 주기로 전체 정보를 갱신하여 갖고있도록 해 놓고
    # 각 유저 것만 조회하여 계산...

    if request.user.is_active:
        try:
            list_top = [ len(user.clothes_set.filter(part='상의'))
                for user in User.objects.all() ]
            my_top = len(request.user.clothes_set.filter(part='상의'))

            list_bottom = [ len(user.clothes_set.filter(part='하의'))
                for user in User.objects.all() ]
            my_bottom = len(request.user.clothes_set.filter(part='하의'))

            list_head = [ len(user.clothes_set.filter(part='머리'))
                for user in User.objects.all() ]
            my_head = len(request.user.clothes_set.filter(part='머리'))

            list_foot = [ len(user.clothes_set.filter(part='발'))
                for user in User.objects.all() ]
            my_foot = len(request.user.clothes_set.filter(part='발'))
            
            avg_top = sum(list_top) / len(list_top)
            max_top = max(max(list_top), 0.000001)
            avg_top = (avg_top / max_top) * 100
            my_top = (my_top / max_top) * 100

            avg_bottom = sum(list_bottom) / len(list_bottom)
            max_bottom = max(max(list_bottom), 0.000001)
            avg_bottom= (avg_bottom / max_bottom) * 100
            my_bottom = (my_bottom / max_bottom) * 100

            avg_head = sum(list_head) / len(list_head)
            max_head = max(max(list_head), 0.000001)
            avg_head = (avg_head / max_head) * 100
            my_head = (my_head / max_head) * 100

            avg_foot = sum(list_foot) / len(list_foot)
            max_foot = max(max(list_foot), 0.000001)
            avg_foot = (avg_foot / max_foot) * 100
            my_foot = (my_foot / max_foot) * 100
        except Exception as e:
            print(e)
            context = {}

        else:
            context = {
                'top': {
                    'avg': avg_top,
                    'my' : my_top
                },
                'bottom': {
                    'avg': avg_bottom,
                    'my' : my_bottom
                },
                'head': {
                    'avg': avg_head,
                    'my' : my_head
                },
                'foot': {
                    'avg': avg_foot,
                    'my' : my_foot
                }
            }
    else:
        context = {}
    
    # 시연용 테스트 코드 끝
    # -------------------------------------------------------------------------

    return render(request, 'hipdrobe/wardrobe-items.html', context)


def coordi(request):
    # 로그인 안 해도 화면은 보여주고 실제 동작 할때 로그인 하라고 하는 게 나을 것
    # 같아서 로그인 체크 안 함
    return render(request, 'hipdrobe/wardrobe-coordi.html')


@login_required
def coordi_detail(request, c_id):
    coordi = get_object_or_404(request.user.coordi_set, id=c_id)

    if coordi:
        coordi_dict = _coordi_to_dict(coordi)
        context = {
            'result': True,
            'data': coordi_dict
        }
    else:
        context = {
            'result': False,
            'reason': 'forbidden'
        }

    return render(request, 'hipdrobe/wardrobe-coordi-detail.html', context)


@login_required
def coordi_update(request, c_id):
    coordi = get_object_or_404(request.user.coordi_set, id=c_id)

    if coordi:
        coordi_dict = _coordi_to_dict(coordi)
        context = {
            'result': True,
            'data': coordi_dict
        }
    else:
        context = {
            'result': False,
            'reason': 'forbidden'
        }

    return render(request, 'hipdrobe/wardrobe-coordi-update.html', context)


def stat(request):
    # 여기에 로그인 세션 체크 등 코드가 들어가야 함
    return render(request, 'hipdrobe/wardrobe-stat.html')


def signup(request):
    if request.method == "POST":
        print("11")
        form = UserForm(request.POST)
        print("12")
        User = get_user_model()
        if form.is_valid():
            print("13")
            new_user = User.objects.create_user(**form.cleaned_data)
            login(request, new_user, backend='django.contrib.auth.backends.ModelBackend')
            print(new_user)
            return redirect('hipdrobe:index')
        else:
            return render(request,'hipdrobe/login_Fail.html')
    else:
        print("33")
        form = UserForm()
        return render(request, 'hipdrobe/signup.html', {'form': form})

def signin(request):
    if request.method == "POST":
        
        form = LoginForm(request.POST)
        email = request.POST['email']
        print(email)
        password = request.POST['password']
        print(password)
        user = authenticate(username = email, password = password)
        print(user)
        if user is not None:
            login(request, user)
            return redirect('hipdrobe:index')
        else:
            return render(request,'hipdrobe/login_Fail.html')
    else:
        form = LoginForm()
        return render(request, 'hipdrobe/login.html', {'form': form})


@login_required
def logout(request):
    auth.logout(request)
    return redirect('hipdrobe:index')
