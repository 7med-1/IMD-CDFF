import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function deleteAllData() {
  console.log('🧹 Clearing all tables...');
  await prisma.facturePiece.deleteMany({});
  await prisma.devisPiece.deleteMany({});
  await prisma.facture.deleteMany({});
  await prisma.devis.deleteMany({});
  await prisma.piecesSummary.deleteMany({});
  await prisma.pieces.deleteMany({});
  await prisma.clients.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ All tables cleared.');
}

async function seedJsonFile(filePath: string) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    console.error(`❌ Failed to parse JSON file: ${filePath}`, error);
    return [];
  }
}

async function main() {
  const dataDir = path.join(__dirname, 'seedData');

  await deleteAllData();

  // Helper function to format references like "N°:00001"
  const formatRef = (num: number) => `N°:${num.toString().padStart(5, '0')}`;

  // Internal counters for auto-increment references
  let devisCounter = 78;
  let factureCounter = 1;

  // 1️⃣ Seed Users
  const users = await seedJsonFile(path.join(dataDir, 'Users.json'));
  if (users.length > 0) {
    await prisma.user.createMany({ data: users, skipDuplicates: true });
    console.log(`✅ Seeded Users: ${users.length}`);
  }

  // 2️⃣ Seed Clients
  const clients = await seedJsonFile(path.join(dataDir, 'Clients.json'));
  if (clients.length > 0) {
    await prisma.clients.createMany({ data: clients, skipDuplicates: true });
    console.log(`✅ Seeded Clients: ${clients.length}`);
  }

  // 3️⃣ Seed Pieces
  const pieces = await seedJsonFile(path.join(dataDir, 'Pieces.json'));
  if (pieces.length > 0) {
    await prisma.pieces.createMany({ data: pieces, skipDuplicates: true });
    console.log(`✅ Seeded Pieces: ${pieces.length}`);
  }

  // 4️⃣ Seed PiecesSummary
  const summaries = await seedJsonFile(
    path.join(dataDir, 'PiecesSummary.json')
  );
  if (summaries.length > 0) {
    await prisma.piecesSummary.createMany({
      data: summaries,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded PiecesSummary: ${summaries.length}`);
  }

  // 5️⃣ Seed Devis
  const devisList = await seedJsonFile(path.join(dataDir, 'Devis.json'));
  for (const d of devisList) {
    const client = await prisma.clients.findFirst({
      where: { name: d.clientName },
    });
    if (!client) {
      console.warn(
        `⚠️ Client not found for Devis: ${d.devisref} (name: ${d.clientName})`
      );
      continue;
    }

    await prisma.devis.create({
      data: {
        devisref: formatRef(devisCounter++), // Auto-generate like N°:00001
        clientId: client.clientId,
        nbrPieces: d.nbrPieces,
        total: d.total,
      },
    });
  }

  // 6️⃣ Seed DevisPieces
  const devisPieces = await seedJsonFile(
    path.join(dataDir, 'DevisPieces.json')
  );
  for (const dp of devisPieces) {
    const devis = await prisma.devis.findFirst({
      where: { devisref: dp.devisRef },
    });
    const piece = await prisma.pieces.findFirst({
      where: { reference: dp.pieceRef },
    });

    if (!devis) {
      console.warn(`⚠️ Devis not found: ${dp.devisRef}`);
      continue;
    }
    if (!piece) {
      console.warn(`⚠️ Piece not found: ${dp.pieceRef}`);
      continue;
    }

    await prisma.devisPiece.create({
      data: {
        devisId: devis.devisId,
        pieceId: piece.pieceId,
        quantity: dp.quantity,
        subtotal: dp.subtotal,
      },
    });
  }

  // 7️⃣ Seed Factures
  const factures = await seedJsonFile(path.join(dataDir, 'Factures.json'));
  for (const f of factures) {
    const client = await prisma.clients.findFirst({
      where: { name: f.clientName },
    });
    if (!client) {
      console.warn(`⚠️ Client not found for Facture: ${f.factureref}`);
      continue;
    }

    await prisma.facture.create({
      data: {
        factureref: formatRef(factureCounter++), // Auto-generate like N°:00001
        clientId: client.clientId,
        nbrPieces: f.nbrPieces,
        total: f.total,
      },
    });
  }

  // 8️⃣ Seed FacturePieces
  const facturePieces = await seedJsonFile(
    path.join(dataDir, 'FacturePieces.json')
  );
  for (const fp of facturePieces) {
    const facture = await prisma.facture.findFirst({
      where: { factureref: fp.factureRef },
    });
    const piece = await prisma.pieces.findFirst({
      where: { reference: fp.pieceRef },
    });

    if (!facture) {
      console.warn(`⚠️ Facture not found: ${fp.factureRef}`);
      continue;
    }
    if (!piece) {
      console.warn(`⚠️ Piece not found: ${fp.pieceRef}`);
      continue;
    }

    await prisma.facturePiece.create({
      data: {
        factureId: facture.factureId,
        pieceId: piece.pieceId,
        quantity: fp.quantity,
        subtotal: fp.subtotal,
      },
    });
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => console.error('❌ Error during seeding:', e))
  .finally(async () => await prisma.$disconnect());
