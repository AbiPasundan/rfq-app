.PHONY: start stop restart rebuild logs

# Menjalankan container
start:
	docker compose up -d

# Membangun ulang image dan menjalankan container
rebuild:
	docker compose down
	docker compose up --build -d

# Menghentikan container
stop:
	docker compose down

# Melihat logs secara realtime
logs:
	docker compose logs -f