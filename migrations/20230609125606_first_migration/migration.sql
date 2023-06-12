-- CreateTable
CREATE TABLE "Properties" (
    "id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "ImageURL" TEXT NOT NULL,

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("id")
);
