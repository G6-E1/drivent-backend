/*
  Warnings:

  - Added the required column `name` to the `Local` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Local" ADD COLUMN     "name" TEXT NOT NULL;
