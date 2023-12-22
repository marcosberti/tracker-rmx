/*
  Warnings:

  - Added the required column `title` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstPaymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Installments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Installments_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Installments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Installments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scheduled" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "accountId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Scheduled_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installmentId" TEXT,
    "scheduledId" TEXT,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Transactions_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transactions_scheduledId_fkey" FOREIGN KEY ("scheduledId") REFERENCES "Scheduled" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transactions_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("amount", "categoryId", "createdAt", "currencyId", "description", "id", "type", "userId") SELECT "amount", "categoryId", "createdAt", "currencyId", "description", "id", "type", "userId" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
CREATE UNIQUE INDEX "Transactions_installmentId_key" ON "Transactions"("installmentId");
CREATE UNIQUE INDEX "Transactions_scheduledId_key" ON "Transactions"("scheduledId");
CREATE UNIQUE INDEX "Transactions_currencyId_key" ON "Transactions"("currencyId");
CREATE UNIQUE INDEX "Transactions_userId_key" ON "Transactions"("userId");
CREATE UNIQUE INDEX "Transactions_categoryId_key" ON "Transactions"("categoryId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Installments_accountId_key" ON "Installments"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Installments_currencyId_key" ON "Installments"("currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Installments_userId_key" ON "Installments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Installments_categoryId_key" ON "Installments"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_accountId_key" ON "Scheduled"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_currencyId_key" ON "Scheduled"("currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_userId_key" ON "Scheduled"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_categoryId_key" ON "Scheduled"("categoryId");
