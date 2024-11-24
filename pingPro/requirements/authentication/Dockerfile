FROM python:3.11

COPY ./user_management /usr/src/user_management

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install -r requirements.txt 

WORKDIR  /usr/src/user_management

CMD ["bash", ".././script.sh"]