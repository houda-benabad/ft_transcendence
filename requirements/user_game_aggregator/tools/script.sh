# python manage.py migrate
# python manage.py runserver 0.0.0.0:8000
uvicorn aggregator.asgi:application --host 0.0.0.0 --port 8000 --reload