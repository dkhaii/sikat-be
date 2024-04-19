/*
  Warnings:

  - Added the required column `created_at` to the `emp_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `emp_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `emp_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `emp_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emp_details" ADD COLUMN     "created_at" TIMESTAMP NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "emp_positions" ADD COLUMN     "created_at" TIMESTAMP NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "created_at" TIMESTAMP NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;
