/*
  Warnings:

  - You are about to drop the `base` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_baseID_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_crewID_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_pitID_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_positionID_fkey";

-- DropTable
DROP TABLE "base";

-- DropTable
DROP TABLE "crew";

-- DropTable
DROP TABLE "employee";

-- DropTable
DROP TABLE "pit";

-- DropTable
DROP TABLE "position";

-- CreateTable
CREATE TABLE "employees" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "positionID" INTEGER NOT NULL,
    "crewID" INTEGER,
    "baseID" INTEGER,
    "pitID" INTEGER,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pits" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "pits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bases" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "bases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crews" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_positionID_fkey" FOREIGN KEY ("positionID") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_crewID_fkey" FOREIGN KEY ("crewID") REFERENCES "crews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_baseID_fkey" FOREIGN KEY ("baseID") REFERENCES "bases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_pitID_fkey" FOREIGN KEY ("pitID") REFERENCES "pits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
