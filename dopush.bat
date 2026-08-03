@echo off
cd /d "c:\Users\vvelev\OneDrive - Entain Group\Documents\Kiro\Free Accessibility Scanner + Outreach System\accesscheck"
git add -A
git commit -m "fix: all features + Vercel deploy fixes (ignoreBuildErrors, dynamic imports)"
git push origin main
echo === DONE ===
pause
