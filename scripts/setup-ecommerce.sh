#!/bin/bash

# E-commerce Migration and Seed Script
echo "🚀 Setting up E-commerce Database Schema and Seed Data"
echo "======================================================="

# Colors for output
GREEN='\033[0.32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to users service
echo -e "${YELLOW}📝 Users Service${NC}"
cd ../users || exit
echo "  ↳ Generating Prisma Client..."
pnpm prisma:generate
echo "  ↳ Running migrations..."
pnpm prisma:migrate
echo "  ↳ Seeding database..."
pnpm prisma:seed
cd ..

# Navigate to products service
echo -e "${YELLOW}📦 Products Service${NC}"
cd ../products || exit
echo "  ↳ Generating Prisma Client..."
pnpm prisma:generate
echo "  ↳ Running migrations..."
pnpm prisma:migrate
echo "  ↳ Seeding database..."
pnpm prisma:seed
cd ..

# Navigate to orders service
echo -e "${YELLOW}🛒 Orders Service${NC}"
cd ../orders || exit
echo "  ↳ Generating Prisma Client..."
pnpm prisma:generate
echo "  ↳ Running migrations..."
pnpm prisma:migrate
echo "  ↳ Seeding database..."
pnpm prisma:seed
cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📊 Database Statistics:"
echo "  • 50 Users (10 admins, 40 customers)"
echo "  • 100 Products across 10 categories"
echo "  • 200 Orders with realistic distribution"
echo ""
echo "🎯 Next Steps:"
echo "  1. Start services: docker-compose up -d"
echo "  2. View Prisma Studio: cd [service] && pnpm prisma:studio"
echo "  3. Test APIs via Kong Gateway: http://localhost:8010"
echo "  4. View API Docs (Swagger): http://localhost:9001/api/docs"
echo "  5. Monitor System (SigNoz): http://localhost:8080"
