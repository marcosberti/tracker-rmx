/*
  Warnings:

  - You are about to drop the column `icon` on the `Currency` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL
);
INSERT INTO "new_Currency" ("code", "id", "name") SELECT "code", "id", "name" FROM "Currency";
DROP TABLE "Currency";
ALTER TABLE "new_Currency" RENAME TO "Currency";
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
