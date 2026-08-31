-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Personal',
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "excerpt" TEXT;
