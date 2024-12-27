-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetSugarLevel" DOUBLE PRECISION NOT NULL DEFAULT 5.5,
    "insulinSensitivityFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "carbRatio" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsulinCalculation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentSugarLevel" DOUBLE PRECISION NOT NULL,
    "targetSugarLevel" DOUBLE PRECISION NOT NULL,
    "carbAmount" DOUBLE PRECISION NOT NULL,
    "correctionDose" DOUBLE PRECISION NOT NULL,
    "mealDose" DOUBLE PRECISION NOT NULL,
    "totalDose" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsulinCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "InsulinCalculation" ADD CONSTRAINT "InsulinCalculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
