all :
	docker compose -f src/docker-compose.yml up --build -d  --remove-orphans
clean :
	docker compose -f src/docker-compose.yml down -v
fclean : clean
	docker compose -f src/docker-compose.yml stop
	docker system prune -af


init:
	echo 'Server starting ...'
	python3 -m venv venv && source venv/bin/activate 
	pip install -r src/game/requirements.txt
	python src/game/backend/manage.py migrate && python src/game/backend/manage.py makemigrations
	python src/game/backend/manage.py runserver


push:
	git add .
	git commit -m "gamePart asgi"
	git push