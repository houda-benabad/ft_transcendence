from django.shortcuts import render

def home_view(request):
	return render(request, 'home/index.html')


def layouts(request):
	return render(request, 'home/websiteLayout.html')
