@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: blog BG translations, smooth progress counter, i18n deep merge"
git push origin main
del "%~f0"
