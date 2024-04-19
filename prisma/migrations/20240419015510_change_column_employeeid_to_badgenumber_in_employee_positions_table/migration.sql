/*
  Warnings:

  - You are about to drop the column `employee_id` on the `emp_positions` table. All the data in the column will be lost.
  - Added the required column `badge_number` to the `emp_positions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "emp_positions" DROP CONSTRAINT "emp_positions_employee_id_fkey";

-- AlterTable
ALTER TABLE "emp_positions" DROP COLUMN "employee_id",
ADD COLUMN     "badge_number" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "emp_positions" ADD CONSTRAINT "emp_positions_badge_number_fkey" FOREIGN KEY ("badge_number") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
