/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Accounts_userId_key";

-- DropIndex
DROP INDEX "Accounts_currencyId_key";

-- DropIndex
DROP INDEX "Installments_categoryId_key";

-- DropIndex
DROP INDEX "Installments_userId_key";

-- DropIndex
DROP INDEX "Installments_currencyId_key";

-- DropIndex
DROP INDEX "Installments_accountId_key";

-- DropIndex
DROP INDEX "Scheduled_categoryId_key";

-- DropIndex
DROP INDEX "Scheduled_userId_key";

-- DropIndex
DROP INDEX "Scheduled_currencyId_key";

-- DropIndex
DROP INDEX "Scheduled_accountId_key";

-- DropIndex
DROP INDEX "Transactions_categoryId_key";

-- DropIndex
DROP INDEX "Transactions_userId_key";

-- DropIndex
DROP INDEX "Transactions_currencyId_key";

-- DropIndex
DROP INDEX "Transactions_scheduledId_key";

-- DropIndex
DROP INDEX "Transactions_installmentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_name_key" ON "Accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");
