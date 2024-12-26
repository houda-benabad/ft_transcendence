FROM python:3.11

COPY ./aggregator /usr/src/aggregator

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt 

WORKDIR  /usr/src/aggregator

CMD ["bash", ".././script.sh"]