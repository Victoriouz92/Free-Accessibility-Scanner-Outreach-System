@echo off
cd /d "%~dp0"
git add -A
git status
git commit -m "fix: full WCAG 2.1 AA compliance audit - contrast, landmarks, aria, labels"
git push origin main
del "%~f0"
