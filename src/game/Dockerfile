FROM python:3.8

WORKDIR /app

COPY ./backend /app/
COPY ./requirements.txt /app/

RUN pip install -r requirements.txt

CMD [ "tail", "-f" ]
# RUN python3 manage.py migrate
# CMD [ "python",  "manage.py", "runserver", "0.0.0.0:8000" ]
#   python  manage.py runserver 0.0.0.0:8000
