.DEFAULT_GOAL := start

.PHONY: start
start:
	npx ts-node src/app.ts

.PHONY: docker-build
docker-build:
	docker build -t my-backend:latest .  

.PHONY: docker-run
docker-run:
	docker run my-backend:latest
