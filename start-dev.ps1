Write-Host "Starting PostgreSQL and Redis via Docker..."
docker compose up -d postgres redis

# Give docker a few seconds to initialize databases
Start-Sleep -Seconds 5

Write-Host "Applying database migrations..."
cd backend
& .venv\Scripts\Activate.ps1
alembic upgrade head
cd ..

Write-Host "Starting Backend API (uvicorn)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; & .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload"

Write-Host "Starting Celery Worker..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; & .\.venv\Scripts\Activate.ps1; celery -A app.core.celery_app:celery_app worker --loglevel=info"

Write-Host "Starting Frontend (Next.js)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All services started!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:8000/docs"
