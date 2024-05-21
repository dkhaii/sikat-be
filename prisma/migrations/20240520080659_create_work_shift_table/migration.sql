-- CreateTable
CREATE TABLE "work_shift" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "startTime" TIME,
    "endTime" TIME,
    "duration" INTEGER,

    CONSTRAINT "work_shift_pkey" PRIMARY KEY ("id")
);
