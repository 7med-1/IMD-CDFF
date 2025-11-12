/*
  Warnings:

  - A unique constraint covering the columns `[devisref]` on the table `Devis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[factureref]` on the table `Facture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Devis" ALTER COLUMN "devisref" DROP DEFAULT,
ALTER COLUMN "devisref" SET DATA TYPE TEXT;
DROP SEQUENCE "Devis_devisref_seq";

-- AlterTable
ALTER TABLE "Facture" ALTER COLUMN "factureref" DROP DEFAULT,
ALTER COLUMN "factureref" SET DATA TYPE TEXT;
DROP SEQUENCE "Facture_factureref_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Devis_devisref_key" ON "Devis"("devisref");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_factureref_key" ON "Facture"("factureref");
