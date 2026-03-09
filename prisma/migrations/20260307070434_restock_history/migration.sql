-- CreateTable
CREATE TABLE "RestockHistory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestockHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestockHistory" ADD CONSTRAINT "RestockHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
