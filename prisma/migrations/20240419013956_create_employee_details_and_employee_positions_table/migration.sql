/*
  Warnings:

  - You are about to drop the column `baseID` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `crewID` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `pitID` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `positionID` on the `employees` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_baseID_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_crewID_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_pitID_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_positionID_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "baseID",
DROP COLUMN "crewID",
DROP COLUMN "pitID",
DROP COLUMN "positionID",
ADD COLUMN     "date_of_birth" DATE NOT NULL,
ALTER COLUMN "profile_picture" DROP NOT NULL;

-- CreateTable
CREATE TABLE "emp_details" (
    "id" SERIAL NOT NULL,
    "badge_number" VARCHAR(100) NOT NULL,
    "date_of_hire" DATE,
    "emp_positions" INTEGER,
    "crew_id" INTEGER,
    "base_id" INTEGER,
    "pit_id" INTEGER,

    CONSTRAINT "emp_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_positions" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR(100) NOT NULL,
    "position_id" INTEGER NOT NULL,

    CONSTRAINT "emp_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emp_details_badge_number_key" ON "emp_details"("badge_number");

-- AddForeignKey
ALTER TABLE "emp_details" ADD CONSTRAINT "emp_details_badge_number_fkey" FOREIGN KEY ("badge_number") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_details" ADD CONSTRAINT "emp_details_emp_positions_fkey" FOREIGN KEY ("emp_positions") REFERENCES "emp_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_details" ADD CONSTRAINT "emp_details_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_details" ADD CONSTRAINT "emp_details_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_details" ADD CONSTRAINT "emp_details_pit_id_fkey" FOREIGN KEY ("pit_id") REFERENCES "pits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_positions" ADD CONSTRAINT "emp_positions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_positions" ADD CONSTRAINT "emp_positions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
