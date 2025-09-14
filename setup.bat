@echo off
echo Installing dependencies...
call npm install

echo Generating Prisma client...
call npx prisma generate

echo Pushing database schema...
call npx prisma db push

echo Seeding database...
call npx prisma db seed

echo.
echo Setup complete. You can now start the application using start.bat
pause
