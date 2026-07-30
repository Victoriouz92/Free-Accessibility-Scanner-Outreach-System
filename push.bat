@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: reviews redesign with avatars, i18n fallback to EN, all new landing sections"
git push origin main
echo DONE
