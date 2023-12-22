/*
  Warnings:

  - Added the required column `userId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Currencies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Categories" ("color", "createdAt", "icon", "id", "name") SELECT "color", "createdAt", "icon", "id", "name" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");
CREATE TABLE "new_Currencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Currencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Currencies" ("code", "createdAt", "id", "name") SELECT "code", "createdAt", "id", "name" FROM "Currencies";
DROP TABLE "Currencies";
ALTER TABLE "new_Currencies" RENAME TO "Currencies";
CREATE UNIQUE INDEX "Currencies_name_key" ON "Currencies"("name");
CREATE UNIQUE INDEX "Currencies_code_key" ON "Currencies"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
