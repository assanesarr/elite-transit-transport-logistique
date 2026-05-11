# =========================
# SOCIAL NETWORK MAKEFILE
# =========================

APP_NAME="transitProd"

# Default message
MSG ?= "fix auth bug"

# =========================
# 🧠 HELP
# =========================

.PHONY: help
help:
	@echo "🚀 PEINTHMIE COMMANDS"
	@echo "----------------------------"
	@echo "make push-msg MSG='text'	-> git add/commit/push"
	@echo "make push              	-> git push only"
	@echo "make version           	-> create git tag"
	@echo "make release           	-> auto version tag"
	@echo "make up                	-> docker compose up"
	@echo "make down              	-> stop docker"
	@echo "make logs              	-> show logs"
	@echo "make clean             	-> clean docker"
	@echo "make dev               	-> run dev"
	@echo "make prod       		  	-> run prod"




# =========================
# 🧠 GIT AUTOMATION
# =========================

.PHONY: commit
commit:
	@bash scripts/git_commit.sh

git-pull:
	@bash scripts/git-pull.sh

.PHONY: changelog bump
changelog:
	@bash scripts/git_changelog.sh

bump:
	@bash scripts/git_bump.sh

push-msg:
	git add .
	git commit -m "$(MSG)"
	git push origin main

.PHONY: deploy-config
deploy-config:
	@bash scripts/deploy-config.sh


.PHONY: release
release:
	@echo "Auto release version..."
	@git tag v$(shell date +%Y.%m.%d.%H%M)
	@git push origin --tags

# =========================
# 🚀 RUN PROJECT
# =========================

.PHONY: up
up:
	docker compose -f docker-compose-dev.yml up --build -d

.PHONY: ps
ps:
	docker compose -f docker-compose-dev.yml ps

.PHONY: down
down:
	docker compose -f docker-compose-dev.yml down

# =========================
# 🧹 CLEAN PROJECT
# =========================

.PHONY: clean
clean:
	docker system prune -f
	docker volume prune -f

# =========================
# ⚙️ FRONTEND
# =========================

.PHONY: dev
dev:
	npm run dev


# =========================
# 🧩 SERVICES
# =========================

.PHONY: prod
prod:
	npm run build && npm start