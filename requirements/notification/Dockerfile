FROM python:3.11

COPY ./notification /usr/src/notification

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt 

WORKDIR  /usr/src/notification

CMD ["bash", ".././script.sh"]