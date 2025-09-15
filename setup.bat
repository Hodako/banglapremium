@echo off
echo Installing dependencies...
call npm install

echo Pushing database schema...
call npx prisma db push --accept-data-loss

echo Seeding database...
call npm run db:seed

echo.
echo Setup complete! You can now start the application using start.bat
pause
