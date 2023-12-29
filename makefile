.PHONY: up down
up:
	docker run -d -v ./:/usr/share/nginx/html -p 8080:80 --rm --name app nginx
down:
	docker stop app
