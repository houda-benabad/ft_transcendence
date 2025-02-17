python manage.py makemigrations
python manage.py migrate 
daphne  user_management.asgi:application -b 0.0.0.0 -p 8000