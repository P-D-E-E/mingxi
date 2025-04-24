-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SELECTED', 'NONSELECTED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventType" NOT NULL DEFAULT 'NONSELECTED';
