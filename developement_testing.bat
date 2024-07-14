call npm install
start npm run start
start cmd /c "set /p ngrok_token=<.env_ngrok_token && npm run config"
start cmd /c "timeout /t 2 && start npm run httpsrvr"