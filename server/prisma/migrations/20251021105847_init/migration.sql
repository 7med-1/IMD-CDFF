-- CreateTable
CREATE TABLE "Clients" (
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "nbrFacturs" INTEGER NOT NULL,
    "nbrDevis" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "Devis" (
    "devisId" TEXT NOT NULL,
    "devisref" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "nbrPieces" INTEGER NOT NULL,
    "total" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Devis_pkey" PRIMARY KEY ("devisId")
);

-- CreateTable
CREATE TABLE "DevisPiece" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION,

    CONSTRAINT "DevisPiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "factureId" TEXT NOT NULL,
    "factureref" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "nbrPieces" INTEGER NOT NULL,
    "total" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("factureId")
);

-- CreateTable
CREATE TABLE "FacturePiece" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION,

    CONSTRAINT "FacturePiece_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DevisPiece_devisId_pieceId_key" ON "DevisPiece"("devisId", "pieceId");

-- CreateIndex
CREATE UNIQUE INDEX "FacturePiece_factureId_pieceId_key" ON "FacturePiece"("factureId", "pieceId");

-- AddForeignKey
ALTER TABLE "Devis" ADD CONSTRAINT "Devis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevisPiece" ADD CONSTRAINT "DevisPiece_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "Devis"("devisId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevisPiece" ADD CONSTRAINT "DevisPiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Pieces"("pieceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturePiece" ADD CONSTRAINT "FacturePiece_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("factureId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturePiece" ADD CONSTRAINT "FacturePiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Pieces"("pieceId") ON DELETE CASCADE ON UPDATE CASCADE;
