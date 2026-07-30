@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: blog grid layout, hover effects, unique images, BG translations"
git push origin main
del "%~f0"
