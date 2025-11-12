-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "addess" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "Pieces" ALTER COLUMN "description" DROP NOT NULL;
