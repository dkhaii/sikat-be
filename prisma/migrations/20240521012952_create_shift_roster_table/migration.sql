-- CreateTable
CREATE TABLE "shift_roster" (
    "id" SERIAL NOT NULL,
    "workShiftID" INTEGER NOT NULL,
    "crewID" INTEGER NOT NULL,

    CONSTRAINT "shift_roster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shift_roster" ADD CONSTRAINT "shift_roster_workShiftID_fkey" FOREIGN KEY ("workShiftID") REFERENCES "work_shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_roster" ADD CONSTRAINT "shift_roster_crewID_fkey" FOREIGN KEY ("crewID") REFERENCES "crews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
