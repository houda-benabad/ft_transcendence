from django.shortcuts import render, redirect


def base(request):
	return render(request, 'index.html')

