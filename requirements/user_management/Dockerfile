FROM python:3.11

COPY ./user_management /usr/src/user_management

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt 

WORKDIR  /usr/src/user_management

CMD ["bash", ".././script.sh"]