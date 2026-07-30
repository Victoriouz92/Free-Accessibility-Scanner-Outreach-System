@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: 10 new blog articles with BG translations and images"
git push origin main
del "%~f0"
