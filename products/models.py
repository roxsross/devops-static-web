from email.mime import image
from pyexpat import model
from unicodedata import name
from django.db import models


class Product(models.Model):
    name=models.CharField(max_length=255)
    price=models.FloatField()
    stock=models.IntegerField()
    image_url=models.CharField(max_length=2083)

class Offer (models.Model):
    coupon_code=models.CharField(max_length=10)
    description=models.CharField(max_length=255)
    discount=models.FloatField()


    



