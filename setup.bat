@echo off
echo Installing dependencies...
call npm install

echo Creating database migration...
call npx prisma migrate dev --name init --accept-data-loss

echo Seeding database...
call npm run db:seed

echo.
echo Setup complete! You can now start the application using start.bat
pause
