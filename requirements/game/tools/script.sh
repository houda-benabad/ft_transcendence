python manage.py makemigrations
python manage.py migrate 
daphne  backend.asgi:application -b 0.0.0.0 -p 8000
# tail -f
