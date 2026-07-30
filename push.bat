@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: landing page redesign, blog, SEO, share button, progress bar"
git push origin main
echo DONE
