
NAME = PingPro

D_COMPOSE = docker compose

all : $(NAME)

$(NAME) :
	$(D_COMPOSE) -f ./docker-compose.yml up --build -d

up:
	$(D_COMPOSE) -f ./docker-compose.yml up --build -d

down:
	$(D_COMPOSE) -f ./docker-compose.yml down

stop:
	$(D_COMPOSE) -f ./docker-compose.yml stop

clean :
	$(D_COMPOSE) -f ./docker-compose.yml down -v

fclean: clean
	docker system prune -af

re : clean all

.PHONY: up down