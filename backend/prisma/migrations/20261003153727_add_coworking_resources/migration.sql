-- CreateEnum
CREATE TYPE "CoworkingResourceType" AS ENUM ('DESK', 'MEETING_ROOM');

-- CreateTable
CREATE TABLE "CoworkingResource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CoworkingResourceType" NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "coworkingSpaceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoworkingResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoworkingResource" ADD CONSTRAINT "CoworkingResource_coworkingSpaceId_fkey" FOREIGN KEY ("coworkingSpaceId") REFERENCES "CoworkingSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
