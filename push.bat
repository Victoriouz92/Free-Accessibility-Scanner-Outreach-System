@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: scanner v2 - follow redirects, dedup, networkidle, copy button, timestamp"
git push origin main
echo DONE
