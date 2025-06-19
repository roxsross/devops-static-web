# Makefile para DevOps Testing Project by @roxsross
.PHONY: help install test test-unit test-integration test-service test-production test-all clean build run dev docker-build docker-run docker-test setup lint format


NODE_VERSION := 18
PORT := 3000
COVERAGE_THRESHOLD := 80


RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m 

help: 
	@echo "$(BLUE)DevOps Testing Project - Comandos disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: 
	@echo "$(BLUE)📦 Instalando dependencias...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependencias instaladas$(NC)"

setup: install 
	@echo "$(BLUE)🔧 Configuración inicial...$(NC)"
	cp .env.example .env || echo "$(YELLOW)⚠️  .env ya existe$(NC)"
	chmod +x scripts/*.sh
	mkdir -p coverage logs
	@echo "$(GREEN)✅ Proyecto configurado$(NC)"

# Testing
test-unit: ## Ejecutar tests unitarios (TDD)
	@echo "$(BLUE)🧪 Ejecutando tests unitarios...$(NC)"
	npm run test:unit

test-integration: ## Ejecutar tests de integración
	@echo "$(BLUE)🔗 Ejecutando tests de integración...$(NC)"
	npm run test:integration

test-service: ## Ejecutar tests de servicio
	@echo "$(BLUE)🌐 Ejecutando tests de servicio...$(NC)"
	npm run test:service

test-production: ## Ejecutar tests de producción
	@echo "$(BLUE)🚀 Ejecutando tests de producción...$(NC)"
	npm run test:production

test-bdd: ## Ejecutar tests BDD
	@echo "$(BLUE)📝 Ejecutando tests BDD...$(NC)"
	npm run test:bdd 
	@echo "$(GREEN)📁 Reporte disponible en: reports/cucumber_report.html$(NC)"

test-all: ## Ejecutar todos los tests
	@echo "$(BLUE)🎯 Ejecutando suite completa de tests...$(NC)"
	./scripts/run-all-tests.sh

test-coverage: ## Ejecutar tests con reporte de coverage
	@echo "$(BLUE)📊 Generando reporte de coverage...$(NC)"
	npm run test:unit -- --coverage
	@echo "$(GREEN)📁 Reporte disponible en: coverage/lcov-report/index.html$(NC)"

test-watch: ## Ejecutar tests en modo watch
	@echo "$(BLUE)👀 Iniciando tests en modo watch...$(NC)"
	npm run test:watch

# Development
dev: ## Ejecutar en modo desarrollo
	@echo "$(BLUE)🚀 Iniciando aplicación en modo desarrollo...$(NC)"
	npm run dev

run: ## Ejecutar aplicación
	@echo "$(BLUE)▶️  Iniciando aplicación...$(NC)"
	npm start

build: ## Construir aplicación (si aplica)
	@echo "$(BLUE)🏗️  Construyendo aplicación...$(NC)"
	@echo "$(GREEN)✅ Build completado$(NC)"

# Quality
lint: ## Ejecutar linter
	@echo "$(BLUE)🔍 Ejecutando linter...$(NC)"
	npm run lint

lint-fix: ## Corregir problemas de linting automáticamente
	@echo "$(BLUE)🔧 Corrigiendo problemas de linting...$(NC)"
	npm run lint:fix

format: ## Formatear código
	@echo "$(BLUE)💅 Formateando código...$(NC)"
	npm run format || echo "$(YELLOW)⚠️  Prettier no configurado$(NC)"

# Docker
docker-build: ## Construir imagen Docker
	@echo "$(BLUE)🐳 Construyendo imagen Docker...$(NC)"
	docker build -t devops-testing-app .
	@echo "$(GREEN)✅ Imagen Docker construida$(NC)"

docker-run: ## Ejecutar con Docker
	@echo "$(BLUE)🐳 Ejecutando con Docker...$(NC)"
	docker run -p $(PORT):$(PORT) --name devops-testing-container devops-testing-app

docker-compose-up: ## Ejecutar con docker-compose
	@echo "$(BLUE)🐳 Iniciando servicios con docker-compose...$(NC)"
	docker compose up -d

docker-compose-down: ## Detener servicios docker-compose
	@echo "$(BLUE)🐳 Deteniendo servicios...$(NC)"
	docker compose down

# Health & Monitoring
health: ## Verificar health de la aplicación
	@echo "$(BLUE)❤️  Verificando health...$(NC)"
	curl -f http://localhost:$(PORT)/health || echo "$(RED)❌ Aplicación no disponible$(NC)"

monitoring: ## Abrir dashboards de monitoreo
	@echo "$(BLUE)📊 Abriendo dashboards...$(NC)"
	@echo "$(GREEN)Prometheus: http://localhost:9090$(NC)"
	@echo "$(GREEN)Grafana: http://localhost:3001 (admin/admin)$(NC)"

logs: ## Ver logs de la aplicación
	@echo "$(BLUE)📝 Mostrando logs...$(NC)"
	docker compose logs -f app || tail -f logs/app.log

# Database
db-reset: ## Resetear base de datos (SQLite en memoria se resetea automáticamente)
	@echo "$(BLUE)🗄️  Base de datos SQLite en memoria - se resetea automáticamente$(NC)"

# Deployment
deploy-staging: ## Deploy a staging
	@echo "$(BLUE)🚀 Desplegando a staging...$(NC)"
	./scripts/deploy.sh staging

deploy-production: ## Deploy a producción
	@echo "$(BLUE)🚀 Desplegando a producción...$(NC)"
	./scripts/deploy.sh production

performance-test: ## Ejecutar tests de performance k6
	@echo "$(BLUE)⚡ Ejecutando tests de performance...$(NC)"
	k6 run k6-loadtesting/devops-testing-k6.js

load-test: ## Ejecutar test de carga básico
	@echo "$(BLUE)🏋️  Ejecutando test de carga...$(NC)"
	@echo "Enviando 50 requests concurrentes..."
	@seq 1 50 | xargs -n1 -P50 -I{} curl -s http://localhost:$(PORT)/health > /dev/null
	@echo "$(GREEN)✅ Test de carga completado$(NC)"

clean: 
	@echo "$(BLUE)🧹 Limpiando archivos temporales...$(NC)"
	rm -rf node_modules/.cache
	rm -rf coverage
	rm -rf logs/*.log
	docker system prune -f
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

clean-all: clean 
	@echo "$(BLUE)🧹 Limpieza completa...$(NC)"
	rm -rf node_modules
	rm -rf coverage
	docker compose down -v
	docker rmi devops-testing-app devops-testing-app:test 2>/dev/null || true
	@echo "$(GREEN)✅ Limpieza completa terminada$(NC)"

check-dependencies: 
	@echo "$(BLUE)🔍 Verificando dependencias...$(NC)"
	npm outdated

security-audit: 
	@echo "$(BLUE)🔒 Ejecutando audit de seguridad...$(NC)"
	npm audit

update-dependencies: 
	@echo "$(BLUE)⬆️  Actualizando dependencias...$(NC)"
	npm update

# Default target
.DEFAULT_GOAL := help