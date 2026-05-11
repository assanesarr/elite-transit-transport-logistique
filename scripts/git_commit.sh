#!/bin/bash

# =========================
# COLORS
# =========================
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

options=("feat" "fix" "docs" "refactor" "test" "chore" "exit")
selected=0

# =========================
# CHECK GIT REPO
# =========================
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo -e "${RED}❌ Pas dans un repo git${RESET}"
    exit 1
}

# =========================
# CHECK CHANGES
# =========================
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️ Aucun changement détecté${RESET}"
    exit 0
fi

# =========================
# DRAW MENU
# =========================
draw_menu() {
    clear
    echo -e "${CYAN}🚀 Git Smart Commit System${RESET}"
    echo "--------------------------"
    echo -e "${GREEN}📂 Branche:${RESET} $(git branch --show-current)"
    echo ""

    echo -e "${BOLD}📊 Git status (résumé):${RESET}"
    git status -s
    echo ""

    echo -e "${CYAN}Choisis le type (↑ ↓ + Entrée):${RESET}"
    echo ""

    for i in "${!options[@]}"; do
        if [ $i -eq $selected ]; then
            echo -e "${BOLD}👉 ${options[$i]}${RESET}"
        else
            echo "   ${options[$i]}"
        fi
    done
}

# =========================
# SEMVER AUTO
# =========================
get_latest_tag() {
    git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
}

bump_version() {
    local VERSION
    VERSION=$(get_latest_tag)
    VERSION=${VERSION#v}

    IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

    # =========================
    # BREAKING CHANGE PRIORITY
    # =========================
    if [[ "$MSG" == *"BREAKING"* ]]; then
        ((MAJOR++))
        MINOR=0
        PATCH=0

    # =========================
    # SEMVER RULES
    # =========================
    else
        case "$TYPE" in
            feat)
                ((MINOR++))
                PATCH=0
                ;;
            fix|docs|refactor|test|chore)
                ((PATCH++))
                ;;
            *)
                ((PATCH++))
                ;;
        esac
    fi

    NEW_VERSION="v$MAJOR.$MINOR.$PATCH"
}

# sync_package_json() {
#     if [ -f package.json ]; then
#         node - <<EOF
# const fs = require("fs");
# const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
# pkg.version = "$NEW_VERSION".replace(/^v/, "");
# fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
# EOF
#     fi
# }

sync_build_info() {
    DATE=$(date +"%Y-%m-%d %H:%M:%S")
    HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    BRANCH_NAME=$(git branch --show-current)

    # =========================
    # package.json
    # =========================
    if [ -f package.json ]; then
        node - <<EOF
const fs = require("fs");

const pkg = JSON.parse(
  fs.readFileSync("package.json", "utf-8")
);

pkg.version = "$NEW_VERSION".replace(/^v/, "");

pkg.build = {
  version: "$NEW_VERSION",
  branch: "$BRANCH_NAME",
  commit: "$HASH",
  updatedAt: "$DATE"
};

fs.writeFileSync(
  "package.json",
  JSON.stringify(pkg, null, 2)
);

console.log("✅ package.json updated");
EOF
    fi

    # =========================
    # build-info.json
    # =========================
    cat > build-info.json <<EOF
{
  "version": "$NEW_VERSION",
  "branch": "$BRANCH_NAME",
  "commit": "$HASH",
  "updatedAt": "$DATE"
}
EOF

    echo -e "${GREEN}✅ Build info généré${RESET}"
}

# =========================
# CHANGELOG GENERATOR
# =========================
generate_changelog() {
    LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || true)
    RANGE=${LAST_TAG:+$LAST_TAG..HEAD}
    DATE=$(date +"%Y-%m-%d")

    FEATURES=$(git log $RANGE --pretty=format:"%s" | grep "^feat" || true)
    FIXES=$(git log $RANGE --pretty=format:"%s" | grep "^fix" || true)
    DOCS=$(git log $RANGE --pretty=format:"%s" | grep "^docs" || true)
    REFACTOR=$(git log $RANGE --pretty=format:"%s" | grep "^refactor" || true)

    {
        echo ""
        echo "## $NEW_VERSION - $DATE"
        echo ""

        [ ! -z "$FEATURES" ] && echo "### ✨ Features" && echo "$FEATURES" && echo ""
        [ ! -z "$FIXES" ] && echo "### 🐛 Fixes" && echo "$FIXES" && echo ""
        [ ! -z "$DOCS" ] && echo "### 📚 Docs" && echo "$DOCS" && echo ""
        [ ! -z "$REFACTOR" ] && echo "### ♻️ Refactor" && echo "$REFACTOR" && echo ""
    } >> CHANGELOG.md
}

# =========================
# NAVIGATION MENU
# =========================
while true; do
    draw_menu
    read -rsn3 key

    case "$key" in
        $'\x1b[A') ((selected--)) ;; # ↑
        $'\x1b[B') ((selected++)) ;; # ↓
        "") break ;;
    esac

    ((selected < 0)) && selected=$((${#options[@]} - 1))
    ((selected >= ${#options[@]})) && selected=0
done

TYPE=${options[$selected]}

# =========================
# EXIT
# =========================
if [ "$TYPE" == "exit" ]; then
    echo -e "${RED}❌ Annulé${RESET}"
    exit 0
fi

# =========================
# DISPLAY FULL GIT STATUS & CONFIRMATION
# =========================
clear
echo -e "${CYAN}📋 STATUT COMPLET DU DÉPÔT${RESET}"
echo "================================="
echo ""
git status
echo ""
echo -e "${YELLOW}⚠️  Attention: Les changements ci-dessus seront commités${RESET}"
echo ""
read -p "Continuer avec le commit ? (y/N): " CONTINUE

if [[ "$CONTINUE" =~ ^[Nn]$ ]]; then
    echo -e "${RED}❌ Opération annulée par l'utilisateur${RESET}"
    exit 0
fi

# =========================
# INPUTS
# =========================
echo ""
read -p "Scope (ex: auth/api/ui - optionnel): " SCOPE
read -p "Message (obligatoire): " MSG

if [ -z "$MSG" ]; then
    echo -e "${RED}❌ Message obligatoire${RESET}"
    exit 1
fi

BRANCH=$(git branch --show-current)

if [ -z "$BRANCH" ]; then
    echo -e "${RED}❌ Pas dans un repo git${RESET}"
    exit 1
fi

# =========================
# EMOJI MAP
# =========================
case $TYPE in
  feat) EMOJI="✨" ;;
  fix) EMOJI="🐛" ;;
  docs) EMOJI="📚" ;;
  refactor) EMOJI="♻️" ;;
  test) EMOJI="✅" ;;
  chore) EMOJI="🔧" ;;
  *) EMOJI="🚀" ;;
esac

# =========================
# CONVENTIONAL COMMIT BUILD
# =========================
if [ -z "$SCOPE" ]; then
    COMMIT="$EMOJI $TYPE: $MSG"
    CC="$TYPE: $MSG"
else
    COMMIT="$EMOJI $TYPE($SCOPE): $MSG"
    CC="$TYPE($SCOPE): $MSG"
fi

echo ""
echo -e "${CYAN}📝 Commit preview:${RESET}"
echo -e "${GREEN}👉 $COMMIT${RESET}"
echo -e "${YELLOW}Conventional:${RESET} $CC"
echo ""

# =========================
# CONFIRMATION
# =========================
read -p "Confirmer le commit ? (Y/n): " CONFIRM

if [[ -z "$CONFIRM" || "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
    echo -e "${GREEN}✅ Confirmé${RESET}"
else
    echo -e "${RED}❌ Annulé${RESET}"
    exit 0
fi

# Create file if not exists
if [ ! -f CHANGELOG.md ]; then
    echo "# 📦 Changelog" > CHANGELOG.md
    echo "" >> CHANGELOG.md
fi

bump_version
sync_build_info
# sync_package_json
generate_changelog

# =========================
# GIT ACTIONS
# =========================
git add .

if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️ Aucun changement à commit${RESET}"
    exit 0
fi

echo -e "${CYAN}🏷️ Version:${RESET} ${GREEN}$NEW_VERSION${RESET}"

git commit -m "$COMMIT"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur commit${RESET}"
    exit 1
fi

# Vérifie si tag existe déjà
if git rev-parse "$NEW_VERSION" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ Tag $NEW_VERSION existe déjà${RESET}"
else
    git tag -a "$NEW_VERSION" -m "$COMMIT"
fi

echo -e "${CYAN}🚀 Push en cours...${RESET}"

git push origin "$BRANCH" --follow-tags

if git remote | grep -q "archive"; then
    git push archive "$BRANCH" --follow-tags
fi

echo -e "${GREEN}✅ Push sur $BRANCH terminé !${RESET}"