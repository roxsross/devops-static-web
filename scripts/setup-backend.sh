#!/bin/bash

echo "🐍 Setup Backend"

python3 -m venv /home/vagrant/pokemon-env
source /home/vagrant/pokemon-env/bin/activate

cd /vagrant/backend
pip install -r requirements.txt

echo "✅ Backend configurado"