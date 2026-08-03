@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: what-we-check section, terms page, PDF scope, WCAG 2.2 rules"
git push origin main
del "%~f0"
