from .models import *


def clearAllWornCount(user):
    clothesList = user.clothes_set.all()
    for clothes in clothesList:
        clothes.worn = 0
        clothes.save()

