@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: Stripe checkout, design polish, code cleanup"
git push origin main
echo DONE
