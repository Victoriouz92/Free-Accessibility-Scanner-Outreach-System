@echo off
cd /d "%~dp0"
git add -A
git commit -m "feat: AccessCheck scanner with i18n and Supabase integration"
git remote remove origin 2>nul
git remote add origin https://github.com/Victoriouz92/Free-Accessibility-Scanner-Outreach-System.git
git branch -M main
git push -u origin main
echo DONE
pause
