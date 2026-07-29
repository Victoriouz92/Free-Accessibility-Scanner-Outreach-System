@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: Part C - admin remediation tool with AI image descriptions"
git push origin main
echo DONE
