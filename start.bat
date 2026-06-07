@echo off
set "SCRIPT_DIR=c:\work\StartClaude"
set "SCRIPT_NAME=cc_deepseek.bat"

if not exist "%SCRIPT_DIR%\%SCRIPT_NAME%" (
    echo Ошибка: файл не найден!
    pause
    exit /b 1
)

pushd "%SCRIPT_DIR%"
call "%SCRIPT_NAME%"
popd

echo Готово.
pause