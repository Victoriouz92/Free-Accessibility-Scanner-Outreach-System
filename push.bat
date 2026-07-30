@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: full landing page with reviews, what-happens-next, blog images, BG sync, footer"
git push origin main
echo DONE
