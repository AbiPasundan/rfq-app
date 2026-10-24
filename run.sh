set -e

echo "Menghapus container lama & membersihkan cache..."
docker compose down

echo "Membangun (build) ulang image Frontend & Backend..."
docker compose build --no-cache

echo "Menjalankan Docker Compose..."
docker compose up -d

echo "Aplikasi berhasil dijalankan!"
echo "Frontend : http://localhost"
echo "Backend  : http://localhost:3000/api"