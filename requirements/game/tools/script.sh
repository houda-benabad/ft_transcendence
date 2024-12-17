python manage.py makemigrations
python manage.py migrate 
python manage.py runserver 0.0.0.0:8000
# tail -f
# daphne -b 0.0.0.0 -p 8001 backend.asgi:application