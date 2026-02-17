# E-commerce Migration and Seed Script (PowerShell)
Write-Host "🚀 Setting up E-commerce Database Schema and Seed Data" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Users Service
Write-Host "📝 Users Service" -ForegroundColor Yellow
Set-Location ../users
Write-Host "  ↳ Generating Prisma Client..." -ForegroundColor Gray
pnpm prisma:generate
Write-Host "  ↳ Running migrations..." -ForegroundColor Gray
pnpm prisma:migrate
Write-Host "  ↳ Seeding database..." -ForegroundColor Gray
pnpm prisma:seed
Set-Location ..

# Products Service
Write-Host "📦 Products Service" -ForegroundColor Yellow
Set-Location ../products
Write-Host "  ↳ Generating Prisma Client..." -ForegroundColor Gray
pnpm prisma:generate
Write-Host "  ↳ Running migrations..." -ForegroundColor Gray
pnpm prisma:migrate
Write-Host "  ↳ Seeding database..." -ForegroundColor Gray
pnpm prisma:seed
Set-Location ..

# Orders Service
Write-Host "🛒 Orders Service" -ForegroundColor Yellow
Set-Location ../orders
Write-Host "  ↳ Generating Prisma Client..." -ForegroundColor Gray
pnpm prisma:generate
Write-Host "  ↳ Running migrations..." -ForegroundColor Gray
pnpm prisma:migrate
Write-Host "  ↳ Seeding database..." -ForegroundColor Gray
pnpm prisma:seed
Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Database Statistics:" -ForegroundColor Cyan
Write-Host "  • 50 Users (10 admins, 40 customers)"
Write-Host "  • 100 Products across 10 categories"
Write-Host "  • 200 Orders with realistic distribution"
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Start services: docker-compose up -d"
Write-Host "  2. View Prisma Studio: cd [service]; pnpm prisma:studio"
Write-Host "  3. Test APIs via Kong Gateway: http://localhost:8010"
Write-Host "  4. View API Docs (Swagger): http://localhost:9001/api/docs"
Write-Host "  5. Monitor System (SigNoz): http://localhost:8080"
