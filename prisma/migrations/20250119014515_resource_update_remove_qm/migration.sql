/*
  Warnings:

  - You are about to drop the column `image` on the `Resource` table. All the data in the column will be lost.
  - Made the column `name` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `path` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "image",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "path" SET NOT NULL;
