from django import forms 
from django.contrib.auth.models import User 
from django.contrib.auth import get_user_model
from django.core import validators
from django import forms
from django.contrib.auth.password_validation import validate_password
class UserForm(forms.ModelForm):
    gender = forms.TypedChoiceField(
                coerce=lambda x: x == 'True',
                choices=((False, 'Male'), (True, 'Female')),
                widget=forms.RadioSelect,
                required=False
                
            )
    
    class Meta: 
        model = get_user_model()

        fields = ['username', 'email', 'password','gender']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'password' : forms.PasswordInput(attrs={'class': 'form-control'}),
            

        }
        labels = {
            'username': 'ID',
            'email': 'email',
            'password': 'password',
            'gender':'gender',
        }

class LoginForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['email', 'password']
# 글자수 제한
def __init__(self, *args, **kwargs):
    super(UserForm, self).__init__( *args, **kwargs)
    self.fields['email'].widget.attrs['maxlength'] =59
    