import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying seeded data...');

  // 1️⃣ Users
  const users = await prisma.user.findMany();
  if (users.length === 0) console.warn('⚠️ No users found!');
  console.log('\n👤 Users:');
  users.forEach((u) => console.log(`- ${u.name} (ID: ${u.userId})`));

  // 2️⃣ Clients with relations
  const clients = await prisma.clients.findMany({
    include: {
      devis: {
        include: {
          pieces: {
            include: { piece: true },
          },
        },
      },
      factures: {
        include: {
          pieces: {
            include: { piece: true },
          },
        },
      },
    },
  });

  if (clients.length === 0) console.warn('⚠️ No clients found!');

  console.log('\n🏢 Clients and their data:');
  for (const client of clients) {
    console.log(`\nClient: ${client.name} (ID: ${client.clientId})`);

    // Devis
    if (client.devis.length === 0)
      console.warn(`⚠️ Client ${client.name} has no Devis.`);
    console.log('  Devis:');
    for (const d of client.devis) {
      console.log(`    - ${d.devisref} | Total: ${d.total}`);
      if (d.pieces.length === 0)
        console.warn(`      ⚠️ Devis ${d.devisref} has no pieces!`);
      for (const dp of d.pieces) {
        if (!dp.piece)
          console.warn(`      ⚠️ Piece not found for DevisPiece ID: ${dp.id}`);
        else
          console.log(
            `      * ${dp.piece.name} x${dp.quantity} | Subtotal: ${dp.subtotal}`
          );
      }
    }

    // Factures
    if (client.factures.length === 0)
      console.warn(`⚠️ Client ${client.name} has no Factures.`);
    console.log('  Factures:');
    for (const f of client.factures) {
      console.log(`    - ${f.factureref} | Total: ${f.total}`);
      if (f.pieces.length === 0)
        console.warn(`      ⚠️ Facture ${f.factureref} has no pieces!`);
      for (const fp of f.pieces) {
        if (!fp.piece)
          console.warn(
            `      ⚠️ Piece not found for FacturePiece ID: ${fp.id}`
          );
        else
          console.log(
            `      * ${fp.piece.name} x${fp.quantity} | Subtotal: ${fp.subtotal}`
          );
      }
    }
  }

  // 3️⃣ Pieces
  const pieces = await prisma.pieces.findMany();
  if (pieces.length === 0) console.warn('⚠️ No pieces found!');
  console.log('\n📦 Pieces inventory:');
  pieces.forEach((p) =>
    console.log(`- ${p.name} (Ref: ${p.reference}) | Quantity: ${p.quantity}`)
  );

  console.log('\n✅ Verification complete!');
}

main()
  .catch((e) => console.error('❌ Test script error:', e))
  .finally(async () => await prisma.$disconnect());
