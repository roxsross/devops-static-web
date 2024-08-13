from importlib.resources import path
from itertools import product
from django import http
from django.shortcuts import render
from django.http import HttpResponse 
from requests import request
from . models import Product


def index (request):
    product =  Product.objects.all()
    return render(request, "index.html", {'products':product})


def new(request):
    return HttpResponse('New Products')


    
        
    
