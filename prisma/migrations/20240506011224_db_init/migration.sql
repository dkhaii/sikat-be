-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL,
    "role_name" VARCHAR NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "profile_picture" VARCHAR,
    "date_of_birth" DATE NOT NULL,
    "date_of_hire" DATE NOT NULL,
    "position_id" INTEGER NOT NULL,
    "crew_id" INTEGER,
    "pit_id" INTEGER,
    "base_id" INTEGER,
    "is_archived" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pits" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "pits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bases" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "bases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crews" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_status" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "leave_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_plan" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "leave_status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "leave_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rotation" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR NOT NULL,
    "effective_date" DATE,
    "end_date" DATE,
    "position_id" INTEGER,
    "crew_id" INTEGER,
    "pit_id" INTEGER,
    "base_id" INTEGER,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "rotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_log" (
    "id" SERIAL NOT NULL,
    "employee_id" VARCHAR NOT NULL,
    "position" VARCHAR NOT NULL,
    "crew" VARCHAR,
    "pit" VARCHAR,
    "base" VARCHAR,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "employee_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_id_key" ON "employees"("id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_plan_leave_status_id_key" ON "leave_plan"("leave_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "rotation_employee_id_key" ON "rotation"("employee_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_pit_id_fkey" FOREIGN KEY ("pit_id") REFERENCES "pits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_plan" ADD CONSTRAINT "leave_plan_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_plan" ADD CONSTRAINT "leave_plan_leave_status_id_fkey" FOREIGN KEY ("leave_status_id") REFERENCES "leave_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_pit_id_fkey" FOREIGN KEY ("pit_id") REFERENCES "pits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_base_id_fkey" FOREIGN KEY ("base_id") REFERENCES "bases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_log" ADD CONSTRAINT "employee_log_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
