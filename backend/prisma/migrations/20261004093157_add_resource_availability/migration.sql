-- CreateTable
CREATE TABLE "ResourceAvailability" (
    "id" SERIAL NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResourceAvailability_resourceId_idx" ON "ResourceAvailability"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceAvailability_resourceId_startsAt_endsAt_idx" ON "ResourceAvailability"("resourceId", "startsAt", "endsAt");

-- AddForeignKey
ALTER TABLE "ResourceAvailability" ADD CONSTRAINT "ResourceAvailability_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "CoworkingResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
