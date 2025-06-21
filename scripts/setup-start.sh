#!/bin/bash

echo "🚀 Iniciando servicios automáticamente..."

mkdir -p /home/vagrant/logs

cd /vagrant/frontend
if [ ! -f ".env" ]; then
  echo "REACT_APP_URL_DEVELOPMENT=http://localhost:8000" > .env
  echo "BROWSER=none" >> .env
  echo "HOST=0.0.0.0" >> .env
fi

echo "🐍 Iniciando backend..."
cd /vagrant/backend
source /home/vagrant/pokemon-env/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /home/vagrant/logs/backend.log 2>&1 &

echo "⏳ Esperando backend..."
sleep 10

echo "⚛️ Iniciando frontend..."
cd /vagrant/frontend
export HOST=0.0.0.0
export BROWSER=none
nohup npm start > /home/vagrant/logs/frontend.log 2>&1 &

# Esperar que el frontend se inicie
echo "⏳ Esperando frontend..."
sleep 15
    
# Reiniciar Nginx para asegurar que todo funcione
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx
    
echo "✅ Servicios iniciados!"
echo "🌐 Acceso unificado: http://192.168.56.10"
echo "📱 Todo funciona a través de Nginx!"