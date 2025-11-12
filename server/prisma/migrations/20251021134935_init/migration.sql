/*
  Warnings:

  - The `devisref` column on the `Devis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `factureref` column on the `Facture` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Devis" DROP COLUMN "devisref",
ADD COLUMN     "devisref" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "factureref",
ADD COLUMN     "factureref" SERIAL NOT NULL;
