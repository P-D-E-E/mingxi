/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PREMIUM', 'TRIAL');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "authenticity" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TRIAL';
