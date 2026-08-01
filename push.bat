@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: PDF report export, fix review avatars (no external images), cleanup"
git push origin main
del "%~f0"
