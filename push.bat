@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: block localhost scanning, speed up scans, proof section i18n, PDF improvements"
git push origin main
del "%~f0"
