/*
  Warnings:

  - Added the required column `accountId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentTransactionId" TEXT,
    "installmentId" TEXT,
    "scheduledId" TEXT,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    CONSTRAINT "Transactions_parentTransactionId_fkey" FOREIGN KEY ("parentTransactionId") REFERENCES "Transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transactions_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transactions_scheduledId_fkey" FOREIGN KEY ("scheduledId") REFERENCES "Scheduled" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transactions_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("amount", "categoryId", "createdAt", "currencyId", "description", "id", "installmentId", "parentTransactionId", "scheduledId", "title", "type", "userId") SELECT "amount", "categoryId", "createdAt", "currencyId", "description", "id", "installmentId", "parentTransactionId", "scheduledId", "title", "type", "userId" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
