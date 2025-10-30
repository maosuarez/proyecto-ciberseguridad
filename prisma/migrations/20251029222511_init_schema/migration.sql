/*
  Warnings:

  - Added the required column `hash` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "description" TEXT,
    "expires_at" DATETIME,
    "discount" INTEGER NOT NULL,
    "valid_until" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "new_user_only" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Coupon" ("active", "code", "created_at", "description", "discount", "expires_at", "id", "maxUses", "new_user_only", "updated_at", "usedCount", "valid_until") SELECT "active", "code", "created_at", "description", "discount", "expires_at", "id", "maxUses", "new_user_only", "updated_at", "usedCount", "valid_until" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE UNIQUE INDEX "Coupon_hash_key" ON "Coupon"("hash");
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");
CREATE INDEX "Coupon_active_idx" ON "Coupon"("active");
CREATE INDEX "Coupon_expires_at_idx" ON "Coupon"("expires_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
