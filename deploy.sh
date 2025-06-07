#!/bin/bash
set -e

REPO="https://github.com/roxsross/devops-static-web.git"
BRANCH="devops-mario64"
TARGET_DIR="/var/www/mariobros"
NGINX_CONF="/etc/nginx/sites-available/mariobros"

echo "📦 Clonando repositorio..."
git clone --branch "$BRANCH" "$REPO" temp-mariobros
sudo mkdir -p "$TARGET_DIR"
sudo cp -r temp-mariobros/* "$TARGET_DIR"
rm -rf temp-mariobros

echo "🌐 Instalando Nginx..."
sudo apt update
sudo apt install -y nginx

echo "🧩 Configurando Nginx..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name localhost;

    root $TARGET_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(css|js|png|jpg|gif|svg|mp3|wav)$ {
        expires 1d;
        add_header Cache-Control "public";
    }
}
EOF

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Mario Bros listo en: http://localhost"
