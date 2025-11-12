/*
  Warnings:

  - You are about to drop the column `addess` on the `Clients` table. All the data in the column will be lost.
  - Made the column `description` on table `Pieces` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "addess",
ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Devis" ALTER COLUMN "devisref" DROP DEFAULT,
ALTER COLUMN "devisref" SET DATA TYPE TEXT;
DROP SEQUENCE "Devis_devisref_seq";

-- AlterTable
ALTER TABLE "Facture" ALTER COLUMN "factureref" DROP DEFAULT,
ALTER COLUMN "factureref" SET DATA TYPE TEXT;
DROP SEQUENCE "Facture_factureref_seq";

-- AlterTable
ALTER TABLE "Pieces" ALTER COLUMN "description" SET NOT NULL;
