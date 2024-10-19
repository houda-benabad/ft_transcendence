from django.shortcuts import render

# Create your views here.

def home_view(request):
	return render(request, 'home/index.html')


def layouts(request):
	return render(request, 'home/websiteLayout.html')

def signup(request):
	print("SIGN UP")
	return render(request, 'home/signup.html')