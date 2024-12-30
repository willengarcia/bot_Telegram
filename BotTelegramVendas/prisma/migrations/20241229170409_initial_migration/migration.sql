-- CreateTable
CREATE TABLE "BotConfig" (
    "id" SERIAL NOT NULL,
    "laraName" TEXT NOT NULL DEFAULT '@test',
    "laraKey" TEXT NOT NULL DEFAULT '@test',
    "botCompra" TEXT NOT NULL DEFAULT 'https://a.imagem.app/o3BDGE.jpeg',
    "mainImg" TEXT NOT NULL DEFAULT 'https://a.imagem.app/o3BDGE.jpeg',
    "supportUser" TEXT NOT NULL DEFAULT '@test',
    "channelUser" TEXT NOT NULL DEFAULT '@test',
    "isOn" BOOLEAN NOT NULL DEFAULT true,
    "payAuto" TEXT NOT NULL DEFAULT 'pagbank',
    "randomPix" TEXT,
    "randomPixPb" TEXT,
    "timeExchange" INTEGER NOT NULL DEFAULT 5,
    "dbVersion" INTEGER NOT NULL DEFAULT 9,

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "priceName" TEXT NOT NULL,
    "priceType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subCategoryId" INTEGER,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "link" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceDiamonds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agreedTos" BOOLEAN NOT NULL DEFAULT false,
    "lastBought" TIMESTAMP(3),
    "isActionPending" BOOLEAN NOT NULL DEFAULT false,
    "isBlacklisted" BOOLEAN NOT NULL DEFAULT false,
    "refer" INTEGER,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "token" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Token" (
    "typeToken" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "nameCertPem" TEXT NOT NULL,
    "nameCertKey" TEXT NOT NULL,
    "bearerTk" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("typeToken")
);

-- CreateTable
CREATE TABLE "SoldBalance" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "owner" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "addBalanceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoldBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueConfig" (
    "transactionType" TEXT NOT NULL,
    "minValue" DOUBLE PRECISION NOT NULL,
    "bonusValue" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "_UserPurchases" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserPurchases_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ValueConfig_transactionType_minValue_key" ON "ValueConfig"("transactionType", "minValue");

-- CreateIndex
CREATE INDEX "_UserPurchases_B_index" ON "_UserPurchases"("B");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPurchases" ADD CONSTRAINT "_UserPurchases_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPurchases" ADD CONSTRAINT "_UserPurchases_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
