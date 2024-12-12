FROM python:3.11

COPY ./backend /usr/src/game

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install -r requirements.txt 

WORKDIR  /usr/src/game

CMD ["bash", ".././script.sh"]