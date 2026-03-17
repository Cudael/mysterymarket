ALTER TABLE "Idea"
ADD COLUMN "originalityConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "whatYoullGet" TEXT,
ADD COLUMN "bestFitFor" TEXT,
ADD COLUMN "implementationNotes" TEXT;
