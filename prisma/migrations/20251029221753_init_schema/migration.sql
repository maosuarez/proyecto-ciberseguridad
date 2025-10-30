-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
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
INSERT INTO "new_Coupon" ("code", "created_at", "description", "discount", "id", "new_user_only", "updated_at", "valid_until") SELECT "code", "created_at", "description", "discount", "id", "new_user_only", "updated_at", "valid_until" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");
CREATE INDEX "Coupon_active_idx" ON "Coupon"("active");
CREATE INDEX "Coupon_expires_at_idx" ON "Coupon"("expires_at");
CREATE TABLE "new_CouponUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupon_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "used_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CouponUsage_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CouponUsage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CouponUsage" ("coupon_id", "id", "used_at", "user_id") SELECT "coupon_id", "id", "used_at", "user_id" FROM "CouponUsage";
DROP TABLE "CouponUsage";
ALTER TABLE "new_CouponUsage" RENAME TO "CouponUsage";
CREATE INDEX "CouponUsage_user_id_idx" ON "CouponUsage"("user_id");
CREATE INDEX "CouponUsage_coupon_id_idx" ON "CouponUsage"("coupon_id");
CREATE UNIQUE INDEX "CouponUsage_coupon_id_user_id_key" ON "CouponUsage"("coupon_id", "user_id");
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "total_amount_in_cents" INTEGER NOT NULL,
    "discount" DECIMAL,
    "coupon_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stripe_payment_intent_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("created_at", "id", "status", "stripe_payment_intent_id", "total_amount_in_cents", "updated_at", "user_id") SELECT "created_at", "id", "status", "stripe_payment_intent_id", "total_amount_in_cents", "updated_at", "user_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE INDEX "Order_user_id_idx" ON "Order"("user_id");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_stripe_payment_intent_id_idx" ON "Order"("stripe_payment_intent_id");
CREATE INDEX "Order_coupon_id_idx" ON "Order"("coupon_id");
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatar_url" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Profile" ("avatar_url", "created_at", "email", "emailVerified", "full_name", "id", "is_admin", "is_approved", "password", "updated_at") SELECT "avatar_url", "created_at", "email", "emailVerified", "full_name", "id", "is_admin", "is_approved", "password", "updated_at" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
CREATE INDEX "Profile_email_idx" ON "Profile"("email");
CREATE INDEX "Profile_status_idx" ON "Profile"("status");
CREATE INDEX "Profile_role_idx" ON "Profile"("role");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CartItem_cart_id_idx" ON "CartItem"("cart_id");

-- CreateIndex
CREATE INDEX "CartItem_product_id_idx" ON "CartItem"("product_id");

-- CreateIndex
CREATE INDEX "OrderItem_order_id_idx" ON "OrderItem"("order_id");

-- CreateIndex
CREATE INDEX "OrderItem_product_id_idx" ON "OrderItem"("product_id");

-- CreateIndex
CREATE INDEX "Review_product_id_idx" ON "Review"("product_id");

-- CreateIndex
CREATE INDEX "Review_user_id_idx" ON "Review"("user_id");
