
NAME = PingPro

D_COMPOSE = docker compose

all : $(NAME)

$(NAME) :
	# mkdir -p ./data/
	$(D_COMPOSE) -f ./docker-compose.yml up --build -d

up:
	$(D_COMPOSE) -f ./docker-compose.yml up --build -d

down:
	$(D_COMPOSE) -f ./docker-compose.yml down

stop:
	$(D_COMPOSE) -f ./docker-compose.yml stop

clean :
	$(D_COMPOSE) -f ./docker-compose.yml down -v
	sudo rm -rf ./data

fclean: clean
	docker system prune -af

re : clean all

.PHONY: up down