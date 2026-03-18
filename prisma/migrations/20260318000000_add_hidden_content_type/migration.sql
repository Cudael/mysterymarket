-- AlterTable
ALTER TABLE "Idea" ADD COLUMN "hiddenContentType" TEXT NOT NULL DEFAULT 'TEXT',
ADD COLUMN "hiddenFileUrl" TEXT,
ADD COLUMN "hiddenLinkUrl" TEXT;
