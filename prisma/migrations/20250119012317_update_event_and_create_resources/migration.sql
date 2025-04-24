-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "path" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resources_name_key" ON "Resources"("name");
