#!/bin/bash

# Pokemon DevOps - Setup Nginx Simple
# 90 Days of DevOps Challenge by Roxs

echo "🌐 Configurando Nginx..."

export DEBIAN_FRONTEND=noninteractive

apt-get install -y nginx

cat > /etc/nginx/sites-available/pokemon-app << 'EOF'
server {
    listen 80;
    server_name localhost 192.168.56.10;
    
    # Agregar header personalizado
    add_header X-DevOps-Challenge "90-Days-by-Roxs";
    
    # Frontend React (ruta principal)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API (ruta /api)
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API Docs
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

ln -sf /etc/nginx/sites-available/pokemon-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t

systemctl enable nginx
systemctl start nginx

echo "✅ Nginx configurado en puerto 80"
echo "🌐 URLs:"
echo "  • App completa: http://192.168.56.10"
echo "  • API: http://192.168.56.10/api/"
echo "  • Docs: http://192.168.56.10/docs"