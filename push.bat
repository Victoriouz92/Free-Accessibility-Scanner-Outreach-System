@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: 11 EU languages with dropdown, scan caching (24h), German translation"
git push origin main
echo DONE
