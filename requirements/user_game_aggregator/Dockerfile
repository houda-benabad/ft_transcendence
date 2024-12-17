FROM python:3.11

COPY ./aggregator /usr/src/user_game_aggregator

WORKDIR  /usr/src/

COPY ./tools/ ./

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt 

WORKDIR  /usr/src/user_game_aggregator

CMD ["uvicorn", "aggregator.asgi:application", "--host", "0.0.0.0", "--port", "8000"]