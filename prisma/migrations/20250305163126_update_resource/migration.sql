-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "lastModifier" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
