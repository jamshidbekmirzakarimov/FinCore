-- 1. Role (Rollarni saqlash uchun)
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- 2. Branch (Filiallar)
CREATE TABLE "Branch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- 3. User (Xodimlar)
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleId" UUID NOT NULL,
    "branchId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 4. Customer (Mijozlar)
CREATE TABLE "Customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Customer_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Customer_passportNumber_key" ON "Customer"("passportNumber");

-- 5. Account (Hisoblar)
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "customerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- 6. Loan (Kreditlar)
CREATE TABLE "Loan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "loanNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Loan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Loan_loanNumber_key" ON "Loan"("loanNumber");

-- 7. Transaction (Tranzaksiyalar)
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "description" TEXT,
    "fromAccountId" UUID,
    "toAccountId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Transaction_referenceNumber_key" ON "Transaction"("referenceNumber");

-- 8. AuditLog (Tizim loglari)
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 9. ComplianceReport (Xavfsizlik/Monitoring reportlari)
CREATE TABLE "ComplianceReport" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComplianceReport_pkey" PRIMARY KEY ("id")
);

-- ==========================================
-- DUMMY DATA (MOCK DATA)
-- ==========================================

-- Rollarni qo'shish
INSERT INTO "Role" (id, name, description) VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin', 'System Administrator'),
('22222222-2222-2222-2222-222222222222', 'Branch Manager', 'Manager of a Branch'),
('33333333-3333-3333-3333-333333333333', 'Teller', 'Bank Teller');

-- Filialni qo'shish
INSERT INTO "Branch" (id, name, code, address, city, country, phone) VALUES 
('44444444-4444-4444-4444-444444444444', 'Main Branch', 'B001', '123 Main St', 'Tashkent', 'Uzbekistan', '+998901234567');

-- Userni qo'shish (Parol: 'admin', bcrypt bilan hashlangan)
INSERT INTO "User" (id, email, password, "firstName", "lastName", "roleId", "branchId") VALUES 
('55555555-5555-5555-5555-555555555555', 'admin@fincore.com', '$2b$10$EP03S50N5XkYhLwF6V8fD.QYhO3u0rJ44tN8n5Q2sC2.0C4uA0Pue', 'System', 'Admin', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444');

-- Mijozni qo'shish
INSERT INTO "Customer" (id, "firstName", "lastName", email, phone, "dateOfBirth", "passportNumber", address, city, country, "kycStatus", "branchId") VALUES
('66666666-6666-6666-6666-666666666666', 'John', 'Doe', 'john@example.com', '+998901112233', '1990-01-01T00:00:00Z', 'AA1234567', '456 Side St', 'Tashkent', 'Uzbekistan', 'APPROVED', '44444444-4444-4444-4444-444444444444');

-- Hisob (Account) qo'shish
INSERT INTO "Account" (id, "accountNumber", type, balance, currency, status, "customerId") VALUES
('77777777-7777-7777-7777-777777777777', '1000200030004000', 'CHECKING', 15000.00, 'USD', 'ACTIVE', '66666666-6666-6666-6666-666666666666');

-- Tranzaksiyani qo'shish
INSERT INTO "Transaction" (id, "referenceNumber", amount, type, status, description, "fromAccountId", "toAccountId") VALUES
('88888888-8888-8888-8888-888888888888', 'TRX123456789', 5000.00, 'DEPOSIT', 'COMPLETED', 'Initial Deposit', NULL, '77777777-7777-7777-7777-777777777777');
