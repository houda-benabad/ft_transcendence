all :
	docker compose -f src/docker-compose.yml up --build -d  --remove-orphans
clean :
	docker compose -f src/docker-compose.yml down -v
fclean : clean
	docker compose -f src/docker-compose.yml stop
	docker system prune -af

re : clean all

push:
	git add .
	git commit -m "gamePart asgi"
	git push