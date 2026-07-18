var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express9 from "express";
import cors from "cors";

// src/middlewere/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Rounte Not Found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Medicines {\n  id           String         @id @default(uuid())\n  name         String         @db.VarChar(255)\n  description  String?        @db.Text\n  price        Float\n  stock        Int\n  status       MedicineStatus @default(ACTIVE)\n  manufacturer String\n  expiryDate   DateTime\n  image        String?\n  category     Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  categoryId   Int\n  seller       User           @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  sellerId     String\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  reviews      Reviews[]\n  cartItems    CartItem[]\n  orderItems   OrderItem[]\n\n  @@index([sellerId])\n  @@map("medicines")\n}\n\nmodel Category {\n  id          Int         @id @default(autoincrement())\n  name        String      @unique\n  description String?\n  userId      String?\n  user        User?       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n  Medicines   Medicines[]\n}\n\nmodel Orders {\n  id              String        @id @default(uuid())\n  customer        User          @relation(fields: [customerId], references: [id])\n  customerId      String\n  totalPrice      Float\n  paymentStatus   PaymentStatus @default(UNPAID)\n  status          OrderStatus   @default(PENDING)\n  paymentGateway  String?\n  shippingAddress String?\n  orderItems      OrderItem[]\n  orderDate       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n  payment         Payment?\n\n  @@index([customerId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String    @id @default(uuid())\n  orderId    String\n  order      Orders    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicines  Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n  price      Float\n  createdAt  DateTime  @default(now())\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid(7))\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  orderId String @unique\n  order   Orders @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([orderId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Reviews {\n  id         String       @id @default(uuid())\n  medicineId String\n  medicines  Medicines    @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  customer   User         @relation(fields: [customerId], references: [id])\n  customerId String\n  status     ReviewStatus @default(APPROVED)\n  rating     Int\n  comment    String?      @db.Text\n  createdAt  DateTime     @default(now())\n\n  @@index([medicineId])\n  @@index([customerId])\n  @@map("reviews")\n}\n\nmodel CartItem {\n  id         String    @id @default(uuid())\n  cartId     String\n  cart       Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  customer   User      @relation(fields: [customerId], references: [id])\n  customerId String\n  medicineId String\n  medicines  Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String\n  items     CartItem[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nenum MedicineStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\nenum OrderStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  PROCESSING\n  SHIPPED\n  CANCEL\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role       String?     @default("CUSTOMER")\n  phone      String?\n  status     String?     @default("ACTIVE")\n  medicines  Medicines[]\n  orders     Orders[]\n  cartItems  CartItem[]\n  reviews    Reviews[]\n  categories Category[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MedicineStatus"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicines"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"seller","kind":"object","type":"User","relationName":"MedicinesToUser"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicines"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicinesToOrderItem"}],"dbName":"medicines"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"Medicines","kind":"object","type":"Medicines","relationName":"CategoryToMedicines"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentGateway","kind":"scalar","type":"String"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"},{"name":"orderDate","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrdersToPayment"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrdersToPayment"}],"dbName":"payments"},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"customer","kind":"object","type":"User","relationName":"CartItemToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CartItemToMedicines"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToUser"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","medicines","customer","order","orderItems","payment","_count","orders","items","cart","cartItems","reviews","categories","Medicines","category","seller","Medicines.findUnique","Medicines.findUniqueOrThrow","Medicines.findFirst","Medicines.findFirstOrThrow","Medicines.findMany","data","Medicines.createOne","Medicines.createMany","Medicines.createManyAndReturn","Medicines.updateOne","Medicines.updateMany","Medicines.updateManyAndReturn","create","update","Medicines.upsertOne","Medicines.deleteOne","Medicines.deleteMany","having","_avg","_sum","_min","_max","Medicines.groupBy","Medicines.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Orders.findUnique","Orders.findUniqueOrThrow","Orders.findFirst","Orders.findFirstOrThrow","Orders.findMany","Orders.createOne","Orders.createMany","Orders.createManyAndReturn","Orders.updateOne","Orders.updateMany","Orders.updateManyAndReturn","Orders.upsertOne","Orders.deleteOne","Orders.deleteMany","Orders.groupBy","Orders.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Reviews.findUnique","Reviews.findUniqueOrThrow","Reviews.findFirst","Reviews.findFirstOrThrow","Reviews.findMany","Reviews.createOne","Reviews.createMany","Reviews.createManyAndReturn","Reviews.updateOne","Reviews.updateMany","Reviews.updateManyAndReturn","Reviews.upsertOne","Reviews.deleteOne","Reviews.deleteMany","Reviews.groupBy","Reviews.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","role","phone","status","every","some","none","cartId","customerId","medicineId","quantity","ReviewStatus","rating","comment","amount","transactionId","stripeEventId","PaymentStatus","paymentGatewayData","orderId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","price","totalPrice","paymentStatus","OrderStatus","paymentGateway","shippingAddress","orderDate","description","stock","MedicineStatus","manufacturer","expiryDate","categoryId","sellerId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "jgZ0wAEVCQAAngMAIA8AAOoCACAQAADrAgAgEwAAogMAIBQAAJYDACDdAQAAoAMAMN4BAAANABDfAQAAoAMAMOABAQAAAAHkAUAA1QIAIeUBQADVAgAh_gEBANQCACGBAgEA5QIAIYQCAAChA6UCIpsCCACCAwAhogIBAOUCACGjAgIAkgMAIaUCAQDUAgAhpgJAANUCACGnAgIAkgMAIagCAQDUAgAhAQAAAAEAIBQEAADmAgAgBQAA5wIAIAYAAOgCACAMAADpAgAgDwAA6gIAIBAAAOsCACARAADsAgAg3QEAAOMCADDeAQAAAwAQ3wEAAOMCADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACH-AQEA1AIAIf8BAQDUAgAhgAIgAOQCACGBAgEA5QIAIYICAQDlAgAhgwIBAOUCACGEAgEA5QIAIQEAAAADACAMAwAAlgMAIN0BAAClAwAw3gEAAAUAEN8BAAClAwAw4AEBANQCACHjAUAA1QIAIeQBQADVAgAh5QFAANUCACHzAQEA1AIAIfsBAQDUAgAh_AEBAOUCACH9AQEA5QIAIQMDAAC2BQAg_AEAAKsDACD9AQAAqwMAIAwDAACWAwAg3QEAAKUDADDeAQAABQAQ3wEAAKUDADDgAQEAAAAB4wFAANUCACHkAUAA1QIAIeUBQADVAgAh8wEBANQCACH7AQEAAAAB_AEBAOUCACH9AQEA5QIAIQMAAAAFACABAAAGADACAAAHACARAwAAlgMAIN0BAACjAwAw3gEAAAkAEN8BAACjAwAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAh8QEBANQCACHyAQEA1AIAIfMBAQDUAgAh9AEBAOUCACH1AQEA5QIAIfYBAQDlAgAh9wFAAKQDACH4AUAApAMAIfkBAQDlAgAh-gEBAOUCACEIAwAAtgUAIPQBAACrAwAg9QEAAKsDACD2AQAAqwMAIPcBAACrAwAg-AEAAKsDACD5AQAAqwMAIPoBAACrAwAgEQMAAJYDACDdAQAAowMAMN4BAAAJABDfAQAAowMAMOABAQAAAAHkAUAA1QIAIeUBQADVAgAh8QEBANQCACHyAQEA1AIAIfMBAQDUAgAh9AEBAOUCACH1AQEA5QIAIfYBAQDlAgAh9wFAAKQDACH4AUAApAMAIfkBAQDlAgAh-gEBAOUCACEDAAAACQAgAQAACgAwAgAACwAgFQkAAJ4DACAPAADqAgAgEAAA6wIAIBMAAKIDACAUAACWAwAg3QEAAKADADDeAQAADQAQ3wEAAKADADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACH-AQEA1AIAIYECAQDlAgAhhAIAAKEDpQIimwIIAIIDACGiAgEA5QIAIaMCAgCSAwAhpQIBANQCACGmAkAA1QIAIacCAgCSAwAhqAIBANQCACEHCQAAuQUAIA8AAPsEACAQAAD8BAAgEwAAuwUAIBQAALYFACCBAgAAqwMAIKICAACrAwAgAwAAAA0AIAEAAA4AMAIAAAEAIA8HAACWAwAgCQAAngMAIAoAAJ8DACDdAQAAnAMAMN4BAAAQABDfAQAAnAMAMOABAQDUAgAh5QFAANUCACGEAgAAnQOfAiKJAgEA1AIAIZwCCACCAwAhnQIAAIMDkwIinwIBAOUCACGgAgEA5QIAIaECQADVAgAhBQcAALYFACAJAAC5BQAgCgAAugUAIJ8CAACrAwAgoAIAAKsDACAPBwAAlgMAIAkAAJ4DACAKAACfAwAg3QEAAJwDADDeAQAAEAAQ3wEAAJwDADDgAQEAAAAB5QFAANUCACGEAgAAnQOfAiKJAgEA1AIAIZwCCACCAwAhnQIAAIMDkwIinwIBAOUCACGgAgEA5QIAIaECQADVAgAhAwAAABAAIAEAABEAMAIAABIAIAsGAACVAwAgCAAAhQMAIN0BAACbAwAw3gEAABQAEN8BAACbAwAw4AEBANQCACHkAUAA1QIAIYoCAQDUAgAhiwICAJIDACGUAgEA1AIAIZsCCACCAwAhAgYAALcFACAIAACdBQAgCwYAAJUDACAIAACFAwAg3QEAAJsDADDeAQAAFAAQ3wEAAJsDADDgAQEAAAAB5AFAANUCACGKAgEA1AIAIYsCAgCSAwAhlAIBANQCACGbAggAggMAIQMAAAAUACABAAAVADACAAAWACANCAAAhQMAIN0BAACBAwAw3gEAABgAEN8BAACBAwAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAhhAIAAIMDkwIijwIIAIIDACGQAgEAmQMAIZECAQDlAgAhkwIAAIQDACCUAgEA1AIAIQEAAAAYACABAAAAFAAgDQYAAJUDACAHAACWAwAgDgAAmAMAIN0BAACXAwAw3gEAABsAEN8BAACXAwAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAhiAIBANQCACGJAgEA1AIAIYoCAQDUAgAhiwICAJIDACEDBgAAtwUAIAcAALYFACAOAAC4BQAgDQYAAJUDACAHAACWAwAgDgAAmAMAIN0BAACXAwAw3gEAABsAEN8BAACXAwAw4AEBAAAAAeQBQADVAgAh5QFAANUCACGIAgEA1AIAIYkCAQDUAgAhigIBANQCACGLAgIAkgMAIQMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAQAAABsAIAwGAACVAwAgBwAAlgMAIN0BAACTAwAw3gEAACEAEN8BAACTAwAw4AEBANQCACHkAUAA1QIAIYQCAACUA40CIokCAQDUAgAhigIBANQCACGNAgIAkgMAIY4CAQDlAgAhAwYAALcFACAHAAC2BQAgjgIAAKsDACAMBgAAlQMAIAcAAJYDACDdAQAAkwMAMN4BAAAhABDfAQAAkwMAMOABAQAAAAHkAUAA1QIAIYQCAACUA40CIokCAQDUAgAhigIBANQCACGNAgIAkgMAIY4CAQDlAgAhAwAAACEAIAEAACIAMAIAACMAIAsDAACRAwAgEgAA6AIAIN0BAACQAwAw3gEAACUAEN8BAACQAwAw4AECAJIDACHkAUAA1QIAIeUBQADVAgAh8wEBAOUCACH-AQEA1AIAIaICAQDlAgAhBAMAALYFACASAAD5BAAg8wEAAKsDACCiAgAAqwMAIAsDAACRAwAgEgAA6AIAIN0BAACQAwAw3gEAACUAEN8BAACQAwAw4AECAAAAAeQBQADVAgAh5QFAANUCACHzAQEA5QIAIf4BAQAAAAGiAgEA5QIAIQMAAAAlACABAAAmADACAAAnACABAAAABQAgAQAAAAkAIAEAAAANACABAAAAEAAgAQAAABsAIAEAAAAhACABAAAAJQAgAwAAAA0AIAEAAA4AMAIAAAEAIAEAAAANACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAUACABAAAVADACAAAWACABAAAAIQAgAQAAABsAIAEAAAAUACABAAAAAQAgAwAAAA0AIAEAAA4AMAIAAAEAIAMAAAANACABAAAOADACAAABACADAAAADQAgAQAADgAwAgAAAQAgEgkAAJIEACAPAACRBAAgEAAAkAQAIBMAANcEACAUAACPBAAg4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABpwICAAAAAagCAQAAAAEBGgAAPAAgDeABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAGBAgEAAAABhAIAAAClAgKbAggAAAABogIBAAAAAaMCAgAAAAGlAgEAAAABpgJAAAAAAacCAgAAAAGoAgEAAAABARoAAD4AMAEaAAA-ADASCQAA4AMAIA8AAN8DACAQAADeAwAgEwAA1QQAIBQAAN0DACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIYECAQCvAwAhhAIAANsDpQIimwIIANoDACGiAgEArwMAIaMCAgDNAwAhpQIBAKkDACGmAkAAqgMAIacCAgDNAwAhqAIBAKkDACECAAAAAQAgGgAAQQAgDeABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAhgQIBAK8DACGEAgAA2wOlAiKbAggA2gMAIaICAQCvAwAhowICAM0DACGlAgEAqQMAIaYCQACqAwAhpwICAM0DACGoAgEAqQMAIQIAAAANACAaAABDACACAAAADQAgGgAAQwAgAwAAAAEAICEAADwAICIAAEEAIAEAAAABACABAAAADQAgBwsAALEFACAnAACyBQAgKAAAtQUAICkAALQFACAqAACzBQAggQIAAKsDACCiAgAAqwMAIBDdAQAAjAMAMN4BAABKABDfAQAAjAMAMOABAQDMAgAh5AFAAM0CACHlAUAAzQIAIf4BAQDMAgAhgQIBANcCACGEAgAAjQOlAiKbAggA-AIAIaICAQDXAgAhowICAPACACGlAgEAzAIAIaYCQADNAgAhpwICAPACACGoAgEAzAIAIQMAAAANACABAABJADAmAABKACADAAAADQAgAQAADgAwAgAAAQAgAQAAACcAIAEAAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACUAIAEAACYAMAIAACcAIAMAAAAlACABAAAmADACAAAnACAIAwAAsAUAIBIAAJQEACDgAQIAAAAB5AFAAAAAAeUBQAAAAAHzAQEAAAAB_gEBAAAAAaICAQAAAAEBGgAAUgAgBuABAgAAAAHkAUAAAAAB5QFAAAAAAfMBAQAAAAH-AQEAAAABogIBAAAAAQEaAABUADABGgAAVAAwAQAAAAMAIAgDAACvBQAgEgAAzwMAIOABAgDNAwAh5AFAAKoDACHlAUAAqgMAIfMBAQCvAwAh_gEBAKkDACGiAgEArwMAIQIAAAAnACAaAABYACAG4AECAM0DACHkAUAAqgMAIeUBQACqAwAh8wEBAK8DACH-AQEAqQMAIaICAQCvAwAhAgAAACUAIBoAAFoAIAIAAAAlACAaAABaACABAAAAAwAgAwAAACcAICEAAFIAICIAAFgAIAEAAAAnACABAAAAJQAgBwsAAKoFACAnAACrBQAgKAAArgUAICkAAK0FACAqAACsBQAg8wEAAKsDACCiAgAAqwMAIAndAQAAiwMAMN4BAABiABDfAQAAiwMAMOABAgDwAgAh5AFAAM0CACHlAUAAzQIAIfMBAQDXAgAh_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-gKTAiKPAggA-AIAIZACAQD5AgAhkQIBANcCACGTAgAA-wIAIJQCAQDMAgAhAwAAABgAIAEAAKUBADAmAACmAQAgAwAAABgAIAEAAJQBADACAACRAQAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAJBgAAnwQAIAcAAI0EACDgAQEAAAAB5AFAAAAAAYQCAAAAjQICiQIBAAAAAYoCAQAAAAGNAgIAAAABjgIBAAAAAQEaAACuAQAgB-ABAQAAAAHkAUAAAAABhAIAAACNAgKJAgEAAAABigIBAAAAAY0CAgAAAAGOAgEAAAABARoAALABADABGgAAsAEAMAkGAACdBAAgBwAAiwQAIOABAQCpAwAh5AFAAKoDACGEAgAAiQSNAiKJAgEAqQMAIYoCAQCpAwAhjQICAM0DACGOAgEArwMAIQIAAAAjACAaAACzAQAgB-ABAQCpAwAh5AFAAKoDACGEAgAAiQSNAiKJAgEAqQMAIYoCAQCpAwAhjQICAM0DACGOAgEArwMAIQIAAAAhACAaAAC1AQAgAgAAACEAIBoAALUBACADAAAAIwAgIQAArgEAICIAALMBACABAAAAIwAgAQAAACEAIAYLAACRBQAgJwAAkgUAICgAAJUFACApAACUBQAgKgAAkwUAII4CAACrAwAgCt0BAADzAgAw3gEAALwBABDfAQAA8wIAMOABAQDMAgAh5AFAAM0CACGEAgAA9AKNAiKJAgEAzAIAIYoCAQDMAgAhjQICAPACACGOAgEA1wIAIQMAAAAhACABAAC7AQAwJgAAvAEAIAMAAAAhACABAAAiADACAAAjACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAoGAACqBAAgBwAA_gMAIA4AAP0DACDgAQEAAAAB5AFAAAAAAeUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgIAAAABARoAAMQBACAH4AEBAAAAAeQBQAAAAAHlAUAAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwICAAAAAQEaAADGAQAwARoAAMYBADAKBgAAqAQAIAcAAPsDACAOAAD6AwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAhiAIBAKkDACGJAgEAqQMAIYoCAQCpAwAhiwICAM0DACECAAAAHQAgGgAAyQEAIAfgAQEAqQMAIeQBQACqAwAh5QFAAKoDACGIAgEAqQMAIYkCAQCpAwAhigIBAKkDACGLAgIAzQMAIQIAAAAbACAaAADLAQAgAgAAABsAIBoAAMsBACADAAAAHQAgIQAAxAEAICIAAMkBACABAAAAHQAgAQAAABsAIAULAACMBQAgJwAAjQUAICgAAJAFACApAACPBQAgKgAAjgUAIArdAQAA7wIAMN4BAADSAQAQ3wEAAO8CADDgAQEAzAIAIeQBQADNAgAh5QFAAM0CACGIAgEAzAIAIYkCAQDMAgAhigIBAMwCACGLAgIA8AIAIQMAAAAbACABAADRAQAwJgAA0gEAIAMAAAAbACABAAAcADACAAAdACAIDQAA6gIAIN0BAADuAgAw3gEAANgBABDfAQAA7gIAMOABAQAAAAHkAUAA1QIAIeUBQADVAgAh8wEBANQCACEBAAAA1QEAIAEAAADVAQAgCA0AAOoCACDdAQAA7gIAMN4BAADYAQAQ3wEAAO4CADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACHzAQEA1AIAIQENAAD7BAAgAwAAANgBACABAADZAQAwAgAA1QEAIAMAAADYAQAgAQAA2QEAMAIAANUBACADAAAA2AEAIAEAANkBADACAADVAQAgBQ0AAIsFACDgAQEAAAAB5AFAAAAAAeUBQAAAAAHzAQEAAAABARoAAN0BACAE4AEBAAAAAeQBQAAAAAHlAUAAAAAB8wEBAAAAAQEaAADfAQAwARoAAN8BADAFDQAAgQUAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIfMBAQCpAwAhAgAAANUBACAaAADiAQAgBOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIfMBAQCpAwAhAgAAANgBACAaAADkAQAgAgAAANgBACAaAADkAQAgAwAAANUBACAhAADdAQAgIgAA4gEAIAEAAADVAQAgAQAAANgBACADCwAA_gQAICkAAIAFACAqAAD_BAAgB90BAADtAgAw3gEAAOsBABDfAQAA7QIAMOABAQDMAgAh5AFAAM0CACHlAUAAzQIAIfMBAQDMAgAhAwAAANgBACABAADqAQAwJgAA6wEAIAMAAADYAQAgAQAA2QEAMAIAANUBACAUBAAA5gIAIAUAAOcCACAGAADoAgAgDAAA6QIAIA8AAOoCACAQAADrAgAgEQAA7AIAIN0BAADjAgAw3gEAAAMAEN8BAADjAgAw4AEBAAAAAeQBQADVAgAh5QFAANUCACH-AQEA1AIAIf8BAQAAAAGAAiAA5AIAIYECAQDlAgAhggIBAOUCACGDAgEA5QIAIYQCAQDlAgAhAQAAAO4BACABAAAA7gEAIAsEAAD3BAAgBQAA-AQAIAYAAPkEACAMAAD6BAAgDwAA-wQAIBAAAPwEACARAAD9BAAggQIAAKsDACCCAgAAqwMAIIMCAACrAwAghAIAAKsDACADAAAAAwAgAQAA8QEAMAIAAO4BACADAAAAAwAgAQAA8QEAMAIAAO4BACADAAAAAwAgAQAA8QEAMAIAAO4BACARBAAA8AQAIAUAAPEEACAGAADyBAAgDAAA8wQAIA8AAPQEACAQAAD1BAAgEQAA9gQAIOABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAEBGgAA9QEAIArgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABARoAAPcBADABGgAA9wEAMBEEAAC8AwAgBQAAvQMAIAYAAL4DACAMAAC_AwAgDwAAwAMAIBAAAMEDACARAADCAwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACECAAAA7gEAIBoAAPoBACAK4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACECAAAAAwAgGgAA_AEAIAIAAAADACAaAAD8AQAgAwAAAO4BACAhAAD1AQAgIgAA-gEAIAEAAADuAQAgAQAAAAMAIAcLAAC4AwAgKQAAugMAICoAALkDACCBAgAAqwMAIIICAACrAwAggwIAAKsDACCEAgAAqwMAIA3dAQAA3wIAMN4BAACDAgAQ3wEAAN8CADDgAQEAzAIAIeQBQADNAgAh5QFAAM0CACH-AQEAzAIAIf8BAQDMAgAhgAIgAOACACGBAgEA1wIAIYICAQDXAgAhgwIBANcCACGEAgEA1wIAIQMAAAADACABAACCAgAwJgAAgwIAIAMAAAADACABAADxAQAwAgAA7gEAIAEAAAAHACABAAAABwAgAwAAAAUAIAEAAAYAMAIAAAcAIAMAAAAFACABAAAGADACAAAHACADAAAABQAgAQAABgAwAgAABwAgCQMAALcDACDgAQEAAAAB4wFAAAAAAeQBQAAAAAHlAUAAAAAB8wEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQEaAACLAgAgCOABAQAAAAHjAUAAAAAB5AFAAAAAAeUBQAAAAAHzAQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABARoAAI0CADABGgAAjQIAMAkDAAC2AwAg4AEBAKkDACHjAUAAqgMAIeQBQACqAwAh5QFAAKoDACHzAQEAqQMAIfsBAQCpAwAh_AEBAK8DACH9AQEArwMAIQIAAAAHACAaAACQAgAgCOABAQCpAwAh4wFAAKoDACHkAUAAqgMAIeUBQACqAwAh8wEBAKkDACH7AQEAqQMAIfwBAQCvAwAh_QEBAK8DACECAAAABQAgGgAAkgIAIAIAAAAFACAaAACSAgAgAwAAAAcAICEAAIsCACAiAACQAgAgAQAAAAcAIAEAAAAFACAFCwAAswMAICkAALUDACAqAAC0AwAg_AEAAKsDACD9AQAAqwMAIAvdAQAA3gIAMN4BAACZAgAQ3wEAAN4CADDgAQEAzAIAIeMBQADNAgAh5AFAAM0CACHlAUAAzQIAIfMBAQDMAgAh-wEBAMwCACH8AQEA1wIAIf0BAQDXAgAhAwAAAAUAIAEAAJgCADAmAACZAgAgAwAAAAUAIAEAAAYAMAIAAAcAIAEAAAALACABAAAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgDgMAALIDACDgAQEAAAAB5AFAAAAAAeUBQAAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABARoAAKECACAN4AEBAAAAAeQBQAAAAAHlAUAAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQEaAACjAgAwARoAAKMCADAOAwAAsQMAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIfEBAQCpAwAh8gEBAKkDACHzAQEAqQMAIfQBAQCvAwAh9QEBAK8DACH2AQEArwMAIfcBQACwAwAh-AFAALADACH5AQEArwMAIfoBAQCvAwAhAgAAAAsAIBoAAKYCACAN4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh8QEBAKkDACHyAQEAqQMAIfMBAQCpAwAh9AEBAK8DACH1AQEArwMAIfYBAQCvAwAh9wFAALADACH4AUAAsAMAIfkBAQCvAwAh-gEBAK8DACECAAAACQAgGgAAqAIAIAIAAAAJACAaAACoAgAgAwAAAAsAICEAAKECACAiAACmAgAgAQAAAAsAIAEAAAAJACAKCwAArAMAICkAAK4DACAqAACtAwAg9AEAAKsDACD1AQAAqwMAIPYBAACrAwAg9wEAAKsDACD4AQAAqwMAIPkBAACrAwAg-gEAAKsDACAQ3QEAANYCADDeAQAArwIAEN8BAADWAgAw4AEBAMwCACHkAUAAzQIAIeUBQADNAgAh8QEBAMwCACHyAQEAzAIAIfMBAQDMAgAh9AEBANcCACH1AQEA1wIAIfYBAQDXAgAh9wFAANgCACH4AUAA2AIAIfkBAQDXAgAh-gEBANcCACEDAAAACQAgAQAArgIAMCYAAK8CACADAAAACQAgAQAACgAwAgAACwAgCd0BAADTAgAw3gEAALUCABDfAQAA0wIAMOABAQAAAAHhAQEA1AIAIeIBAQDUAgAh4wFAANUCACHkAUAA1QIAIeUBQADVAgAhAQAAALICACABAAAAsgIAIAndAQAA0wIAMN4BAAC1AgAQ3wEAANMCADDgAQEA1AIAIeEBAQDUAgAh4gEBANQCACHjAUAA1QIAIeQBQADVAgAh5QFAANUCACEAAwAAALUCACABAAC2AgAwAgAAsgIAIAMAAAC1AgAgAQAAtgIAMAIAALICACADAAAAtQIAIAEAALYCADACAACyAgAgBuABAQAAAAHhAQEAAAAB4gEBAAAAAeMBQAAAAAHkAUAAAAAB5QFAAAAAAQEaAAC6AgAgBuABAQAAAAHhAQEAAAAB4gEBAAAAAeMBQAAAAAHkAUAAAAAB5QFAAAAAAQEaAAC8AgAwARoAALwCADAG4AEBAKkDACHhAQEAqQMAIeIBAQCpAwAh4wFAAKoDACHkAUAAqgMAIeUBQACqAwAhAgAAALICACAaAAC_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_wEBAMwCACGAAiAA4AIAIYECAQDXAgAhggIBANcCACGDAgEA1wIAIYQCAQDXAgAhBQsAAM8CACApAADiAgAgKgAA4gIAIOYBIAAAAAHtASAA4QIAIQULAADPAgAgKQAA4gIAICoAAOICACDmASAAAAAB7QEgAOECACEC5gEgAAAAAe0BIADiAgAhFAQAAOYCACAFAADnAgAgBgAA6AIAIAwAAOkCACAPAADqAgAgEAAA6wIAIBEAAOwCACDdAQAA4wIAMN4BAAADABDfAQAA4wIAMOABAQDUAgAh5AFAANUCACHlAUAA1QIAIf4BAQDUAgAh_wEBANQCACGAAiAA5AIAIYECAQDlAgAhggIBAOUCACGDAgEA5QIAIYQCAQDlAgAhAuYBIAAAAAHtASAA4gIAIQvmAQEAAAAB5wEBAAAABegBAQAAAAXpAQEAAAAB6gEBAAAAAesBAQAAAAHsAQEAAAAB7QEBAN0CACHuAQEAAAAB7wEBAAAAAfABAQAAAAEDhQIAAAUAIIYCAAAFACCHAgAABQAgA4UCAAAJACCGAgAACQAghwIAAAkAIAOFAgAADQAghgIAAA0AIIcCAAANACADhQIAABAAIIYCAAAQACCHAgAAEAAgA4UCAAAbACCGAgAAGwAghwIAABsAIAOFAgAAIQAghgIAACEAIIcCAAAhACADhQIAACUAIIYCAAAlACCHAgAAJQAgB90BAADtAgAw3gEAAOsBABDfAQAA7QIAMOABAQDMAgAh5AFAAM0CACHlAUAAzQIAIfMBAQDMAgAhCA0AAOoCACDdAQAA7gIAMN4BAADYAQAQ3wEAAO4CADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACHzAQEA1AIAIQrdAQAA7wIAMN4BAADSAQAQ3wEAAO8CADDgAQEAzAIAIeQBQADNAgAh5QFAAM0CACGIAgEAzAIAIYkCAQDMAgAhigIBAMwCACGLAgIA8AIAIQ0LAADPAgAgJwAA8gIAICgAAM8CACApAADPAgAgKgAAzwIAIOYBAgAAAAHnAQIAAAAE6AECAAAABOkBAgAAAAHqAQIAAAAB6wECAAAAAewBAgAAAAHtAQIA8QIAIQ0LAADPAgAgJwAA8gIAICgAAM8CACApAADPAgAgKgAAzwIAIOYBAgAAAAHnAQIAAAAE6AECAAAABOkBAgAAAAHqAQIAAAAB6wECAAAAAewBAgAAAAHtAQIA8QIAIQjmAQgAAAAB5wEIAAAABOgBCAAAAATpAQgAAAAB6gEIAAAAAesBCAAAAAHsAQgAAAAB7QEIAPICACEK3QEAAPMCADDeAQAAvAEAEN8BAADzAgAw4AEBAMwCACHkAUAAzQIAIYQCAAD0Ao0CIokCAQDMAgAhigIBAMwCACGNAgIA8AIAIY4CAQDXAgAhBwsAAM8CACApAAD2AgAgKgAA9gIAIOYBAAAAjQIC5wEAAACNAgjoAQAAAI0CCO0BAAD1Ao0CIgcLAADPAgAgKQAA9gIAICoAAPYCACDmAQAAAI0CAucBAAAAjQII6AEAAACNAgjtAQAA9QKNAiIE5gEAAACNAgLnAQAAAI0CCOgBAAAAjQII7QEAAPYCjQIiDN0BAAD3AgAw3gEAAKYBABDfAQAA9wIAMOABAQDMAgAh5AFAAM0CACHlAUAAzQIAIYQCAAD6ApMCIo8CCAD4AgAhkAIBAPkCACGRAgEA1wIAIZMCAAD7AgAglAIBAMwCACENCwAAzwIAICcAAPICACAoAADyAgAgKQAA8gIAICoAAPICACDmAQgAAAAB5wEIAAAABOgBCAAAAATpAQgAAAAB6gEIAAAAAesBCAAAAAHsAQgAAAAB7QEIAIADACELCwAAzwIAICkAANICACAqAADSAgAg5gEBAAAAAecBAQAAAAToAQEAAAAE6QEBAAAAAeoBAQAAAAHrAQEAAAAB7AEBAAAAAe0BAQD_AgAhBwsAAM8CACApAAD-AgAgKgAA_gIAIOYBAAAAkwIC5wEAAACTAgjoAQAAAJMCCO0BAAD9ApMCIg8LAADaAgAgKQAA_AIAICoAAPwCACDmAYAAAAAB6QGAAAAAAeoBgAAAAAHrAYAAAAAB7AGAAAAAAe0BgAAAAAGVAgEAAAABlgIBAAAAAZcCAQAAAAGYAoAAAAABmQKAAAAAAZoCgAAAAAEM5gGAAAAAAekBgAAAAAHqAYAAAAAB6wGAAAAAAewBgAAAAAHtAYAAAAABlQIBAAAAAZYCAQAAAAGXAgEAAAABmAKAAAAAAZkCgAAAAAGaAoAAAAABBwsAAM8CACApAAD-AgAgKgAA_gIAIOYBAAAAkwIC5wEAAACTAgjoAQAAAJMCCO0BAAD9ApMCIgTmAQAAAJMCAucBAAAAkwII6AEAAACTAgjtAQAA_gKTAiILCwAAzwIAICkAANICACAqAADSAgAg5gEBAAAAAecBAQAAAAToAQEAAAAE6QEBAAAAAeoBAQAAAAHrAQEAAAAB7AEBAAAAAe0BAQD_AgAhDQsAAM8CACAnAADyAgAgKAAA8gIAICkAAPICACAqAADyAgAg5gEIAAAAAecBCAAAAAToAQgAAAAE6QEIAAAAAeoBCAAAAAHrAQgAAAAB7AEIAAAAAe0BCACAAwAhDQgAAIUDACDdAQAAgQMAMN4BAAAYABDfAQAAgQMAMOABAQDUAgAh5AFAANUCACHlAUAA1QIAIYQCAACDA5MCIo8CCACCAwAhkAIBAJkDACGRAgEA5QIAIZMCAACEAwAglAIBANQCACEI5gEIAAAAAecBCAAAAAToAQgAAAAE6QEIAAAAAeoBCAAAAAHrAQgAAAAB7AEIAAAAAe0BCADyAgAhBOYBAAAAkwIC5wEAAACTAgjoAQAAAJMCCO0BAAD-ApMCIgzmAYAAAAAB6QGAAAAAAeoBgAAAAAHrAYAAAAAB7AGAAAAAAe0BgAAAAAGVAgEAAAABlgIBAAAAAZcCAQAAAAGYAoAAAAABmQKAAAAAAZoCgAAAAAERBwAAlgMAIAkAAJ4DACAKAACfAwAg3QEAAJwDADDeAQAAEAAQ3wEAAJwDADDgAQEA1AIAIeUBQADVAgAhhAIAAJ0DnwIiiQIBANQCACGcAggAggMAIZ0CAACDA5MCIp8CAQDlAgAhoAIBAOUCACGhAkAA1QIAIakCAAAQACCqAgAAEAAgCd0BAACGAwAw3gEAAI4BABDfAQAAhgMAMOABAQDMAgAh5AFAAM0CACGKAgEAzAIAIYsCAgDwAgAhlAIBAMwCACGbAggA-AIAIQzdAQAAhwMAMN4BAAB4ABDfAQAAhwMAMOABAQDMAgAh5QFAAM0CACGEAgAAiAOfAiKJAgEAzAIAIZwCCAD4AgAhnQIAAPoCkwIinwIBANcCACGgAgEA1wIAIaECQADNAgAhBwsAAM8CACApAACKAwAgKgAAigMAIOYBAAAAnwIC5wEAAACfAgjoAQAAAJ8CCO0BAACJA58CIgcLAADPAgAgKQAAigMAICoAAIoDACDmAQAAAJ8CAucBAAAAnwII6AEAAACfAgjtAQAAiQOfAiIE5gEAAACfAgLnAQAAAJ8CCOgBAAAAnwII7QEAAIoDnwIiCd0BAACLAwAw3gEAAGIAEN8BAACLAwAw4AECAPACACHkAUAAzQIAIeUBQADNAgAh8wEBANcCACH-AQEAzAIAIaICAQDXAgAhEN0BAACMAwAw3gEAAEoAEN8BAACMAwAw4AEBAMwCACHkAUAAzQIAIeUBQADNAgAh_gEBAMwCACGBAgEA1wIAIYQCAACNA6UCIpsCCAD4AgAhogIBANcCACGjAgIA8AIAIaUCAQDMAgAhpgJAAM0CACGnAgIA8AIAIagCAQDMAgAhBwsAAM8CACApAACPAwAgKgAAjwMAIOYBAAAApQIC5wEAAAClAgjoAQAAAKUCCO0BAACOA6UCIgcLAADPAgAgKQAAjwMAICoAAI8DACDmAQAAAKUCAucBAAAApQII6AEAAAClAgjtAQAAjgOlAiIE5gEAAAClAgLnAQAAAKUCCOgBAAAApQII7QEAAI8DpQIiCwMAAJEDACASAADoAgAg3QEAAJADADDeAQAAJQAQ3wEAAJADADDgAQIAkgMAIeQBQADVAgAh5QFAANUCACHzAQEA5QIAIf4BAQDUAgAhogIBAOUCACEWBAAA5gIAIAUAAOcCACAGAADoAgAgDAAA6QIAIA8AAOoCACAQAADrAgAgEQAA7AIAIN0BAADjAgAw3gEAAAMAEN8BAADjAgAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAh_gEBANQCACH_AQEA1AIAIYACIADkAgAhgQIBAOUCACGCAgEA5QIAIYMCAQDlAgAhhAIBAOUCACGpAgAAAwAgqgIAAAMAIAjmAQIAAAAB5wECAAAABOgBAgAAAATpAQIAAAAB6gECAAAAAesBAgAAAAHsAQIAAAAB7QECAM8CACEMBgAAlQMAIAcAAJYDACDdAQAAkwMAMN4BAAAhABDfAQAAkwMAMOABAQDUAgAh5AFAANUCACGEAgAAlAONAiKJAgEA1AIAIYoCAQDUAgAhjQICAJIDACGOAgEA5QIAIQTmAQAAAI0CAucBAAAAjQII6AEAAACNAgjtAQAA9gKNAiIXCQAAngMAIA8AAOoCACAQAADrAgAgEwAAogMAIBQAAJYDACDdAQAAoAMAMN4BAAANABDfAQAAoAMAMOABAQDUAgAh5AFAANUCACHlAUAA1QIAIf4BAQDUAgAhgQIBAOUCACGEAgAAoQOlAiKbAggAggMAIaICAQDlAgAhowICAJIDACGlAgEA1AIAIaYCQADVAgAhpwICAJIDACGoAgEA1AIAIakCAAANACCqAgAADQAgFgQAAOYCACAFAADnAgAgBgAA6AIAIAwAAOkCACAPAADqAgAgEAAA6wIAIBEAAOwCACDdAQAA4wIAMN4BAAADABDfAQAA4wIAMOABAQDUAgAh5AFAANUCACHlAUAA1QIAIf4BAQDUAgAh_wEBANQCACGAAiAA5AIAIYECAQDlAgAhggIBAOUCACGDAgEA5QIAIYQCAQDlAgAhqQIAAAMAIKoCAAADACANBgAAlQMAIAcAAJYDACAOAACYAwAg3QEAAJcDADDeAQAAGwAQ3wEAAJcDADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACGIAgEA1AIAIYkCAQDUAgAhigIBANQCACGLAgIAkgMAIQoNAADqAgAg3QEAAO4CADDeAQAA2AEAEN8BAADuAgAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAh8wEBANQCACGpAgAA2AEAIKoCAADYAQAgCOYBAQAAAAHnAQEAAAAE6AEBAAAABOkBAQAAAAHqAQEAAAAB6wEBAAAAAewBAQAAAAHtAQEAmgMAIQjmAQEAAAAB5wEBAAAABOgBAQAAAATpAQEAAAAB6gEBAAAAAesBAQAAAAHsAQEAAAAB7QEBAJoDACELBgAAlQMAIAgAAIUDACDdAQAAmwMAMN4BAAAUABDfAQAAmwMAMOABAQDUAgAh5AFAANUCACGKAgEA1AIAIYsCAgCSAwAhlAIBANQCACGbAggAggMAIQ8HAACWAwAgCQAAngMAIAoAAJ8DACDdAQAAnAMAMN4BAAAQABDfAQAAnAMAMOABAQDUAgAh5QFAANUCACGEAgAAnQOfAiKJAgEA1AIAIZwCCACCAwAhnQIAAIMDkwIinwIBAOUCACGgAgEA5QIAIaECQADVAgAhBOYBAAAAnwIC5wEAAACfAgjoAQAAAJ8CCO0BAACKA58CIgOFAgAAFAAghgIAABQAIIcCAAAUACAPCAAAhQMAIN0BAACBAwAw3gEAABgAEN8BAACBAwAw4AEBANQCACHkAUAA1QIAIeUBQADVAgAhhAIAAIMDkwIijwIIAIIDACGQAgEAmQMAIZECAQDlAgAhkwIAAIQDACCUAgEA1AIAIakCAAAYACCqAgAAGAAgFQkAAJ4DACAPAADqAgAgEAAA6wIAIBMAAKIDACAUAACWAwAg3QEAAKADADDeAQAADQAQ3wEAAKADADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACH-AQEA1AIAIYECAQDlAgAhhAIAAKEDpQIimwIIAIIDACGiAgEA5QIAIaMCAgCSAwAhpQIBANQCACGmAkAA1QIAIacCAgCSAwAhqAIBANQCACEE5gEAAAClAgLnAQAAAKUCCOgBAAAApQII7QEAAI8DpQIiDQMAAJEDACASAADoAgAg3QEAAJADADDeAQAAJQAQ3wEAAJADADDgAQIAkgMAIeQBQADVAgAh5QFAANUCACHzAQEA5QIAIf4BAQDUAgAhogIBAOUCACGpAgAAJQAgqgIAACUAIBEDAACWAwAg3QEAAKMDADDeAQAACQAQ3wEAAKMDADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACHxAQEA1AIAIfIBAQDUAgAh8wEBANQCACH0AQEA5QIAIfUBAQDlAgAh9gEBAOUCACH3AUAApAMAIfgBQACkAwAh-QEBAOUCACH6AQEA5QIAIQjmAUAAAAAB5wFAAAAABegBQAAAAAXpAUAAAAAB6gFAAAAAAesBQAAAAAHsAUAAAAAB7QFAANsCACEMAwAAlgMAIN0BAAClAwAw3gEAAAUAEN8BAAClAwAw4AEBANQCACHjAUAA1QIAIeQBQADVAgAh5QFAANUCACHzAQEA1AIAIfsBAQDUAgAh_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_gEBAKkDACGBAgEArwMAIYQCAADbA6UCIpsCCADaAwAhogIBAK8DACGjAgIAzQMAIaUCAQCpAwAhpgJAAKoDACGoAgEAqQMAIQWuAggAAAABtAIIAAAAAbUCCAAAAAG2AggAAAABtwIIAAAAAQGuAgAAAKUCAhAJAADgAwAgDwAA3wMAIBAAAN4DACAUAADdAwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACGBAgEArwMAIYQCAADbA6UCIpsCCADaAwAhogIBAK8DACGjAgIAzQMAIaUCAQCpAwAhpgJAAKoDACGoAgEAqQMAIQUhAADnBQAgIgAAgQYAIKsCAADoBQAgrAIAAIAGACCxAgAA7gEAIAshAAD_AwAwIgAAhAQAMKsCAACABAAwrAIAAIEEADCtAgAAggQAIK4CAACDBAAwrwIAAIMEADCwAgAAgwQAMLECAACDBAAwsgIAAIUEADCzAgAAhgQAMAshAADvAwAwIgAA9AMAMKsCAADwAwAwrAIAAPEDADCtAgAA8gMAIK4CAADzAwAwrwIAAPMDADCwAgAA8wMAMLECAADzAwAwsgIAAPUDADCzAgAA9gMAMAshAADhAwAwIgAA5gMAMKsCAADiAwAwrAIAAOMDADCtAgAA5AMAIK4CAADlAwAwrwIAAOUDADCwAgAA5QMAMLECAADlAwAwsgIAAOcDADCzAgAA6AMAMAYIAADuAwAg4AEBAAAAAeQBQAAAAAGLAgIAAAABlAIBAAAAAZsCCAAAAAECAAAAFgAgIQAA7QMAIAMAAAAWACAhAADtAwAgIgAA6wMAIAEaAAD_BQAwCwYAAJUDACAIAACFAwAg3QEAAJsDADDeAQAAFAAQ3wEAAJsDADDgAQEAAAAB5AFAANUCACGKAgEA1AIAIYsCAgCSAwAhlAIBANQCACGbAggAggMAIQIAAAAWACAaAADrAwAgAgAAAOkDACAaAADqAwAgCd0BAADoAwAw3gEAAOkDABDfAQAA6AMAMOABAQDUAgAh5AFAANUCACGKAgEA1AIAIYsCAgCSAwAhlAIBANQCACGbAggAggMAIQndAQAA6AMAMN4BAADpAwAQ3wEAAOgDADDgAQEA1AIAIeQBQADVAgAhigIBANQCACGLAgIAkgMAIZQCAQDUAgAhmwIIAIIDACEF4AEBAKkDACHkAUAAqgMAIYsCAgDNAwAhlAIBAKkDACGbAggA2gMAIQYIAADsAwAg4AEBAKkDACHkAUAAqgMAIYsCAgDNAwAhlAIBAKkDACGbAggA2gMAIQUhAAD6BQAgIgAA_QUAIKsCAAD7BQAgrAIAAPwFACCxAgAAEgAgBggAAO4DACDgAQEAAAAB5AFAAAAAAYsCAgAAAAGUAgEAAAABmwIIAAAAAQMhAAD6BQAgqwIAAPsFACCxAgAAEgAgCAcAAP4DACAOAAD9AwAg4AEBAAAAAeQBQAAAAAHlAUAAAAABiAIBAAAAAYkCAQAAAAGLAgIAAAABAgAAAB0AICEAAPwDACADAAAAHQAgIQAA_AMAICIAAPkDACABGgAA-QUAMA0GAACVAwAgBwAAlgMAIA4AAJgDACDdAQAAlwMAMN4BAAAbABDfAQAAlwMAMOABAQAAAAHkAUAA1QIAIeUBQADVAgAhiAIBANQCACGJAgEA1AIAIYoCAQDUAgAhiwICAJIDACECAAAAHQAgGgAA-QMAIAIAAAD3AwAgGgAA-AMAIArdAQAA9gMAMN4BAAD3AwAQ3wEAAPYDADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACGIAgEA1AIAIYkCAQDUAgAhigIBANQCACGLAgIAkgMAIQrdAQAA9gMAMN4BAAD3AwAQ3wEAAPYDADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACGIAgEA1AIAIYkCAQDUAgAhigIBANQCACGLAgIAkgMAIQbgAQEAqQMAIeQBQACqAwAh5QFAAKoDACGIAgEAqQMAIYkCAQCpAwAhiwICAM0DACEIBwAA-wMAIA4AAPoDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACGIAgEAqQMAIYkCAQCpAwAhiwICAM0DACEFIQAA8QUAICIAAPcFACCrAgAA8gUAIKwCAAD2BQAgsQIAANUBACAFIQAA7wUAICIAAPQFACCrAgAA8AUAIKwCAADzBQAgsQIAAO4BACAIBwAA_gMAIA4AAP0DACDgAQEAAAAB5AFAAAAAAeUBQAAAAAGIAgEAAAABiQIBAAAAAYsCAgAAAAEDIQAA8QUAIKsCAADyBQAgsQIAANUBACADIQAA7wUAIKsCAADwBQAgsQIAAO4BACAHBwAAjQQAIOABAQAAAAHkAUAAAAABhAIAAACNAgKJAgEAAAABjQICAAAAAY4CAQAAAAECAAAAIwAgIQAAjAQAIAMAAAAjACAhAACMBAAgIgAAigQAIAEaAADuBQAwDAYAAJUDACAHAACWAwAg3QEAAJMDADDeAQAAIQAQ3wEAAJMDADDgAQEAAAAB5AFAANUCACGEAgAAlAONAiKJAgEA1AIAIYoCAQDUAgAhjQICAJIDACGOAgEA5QIAIQIAAAAjACAaAACKBAAgAgAAAIcEACAaAACIBAAgCt0BAACGBAAw3gEAAIcEABDfAQAAhgQAMOABAQDUAgAh5AFAANUCACGEAgAAlAONAiKJAgEA1AIAIYoCAQDUAgAhjQICAJIDACGOAgEA5QIAIQrdAQAAhgQAMN4BAACHBAAQ3wEAAIYEADDgAQEA1AIAIeQBQADVAgAhhAIAAJQDjQIiiQIBANQCACGKAgEA1AIAIY0CAgCSAwAhjgIBAOUCACEG4AEBAKkDACHkAUAAqgMAIYQCAACJBI0CIokCAQCpAwAhjQICAM0DACGOAgEArwMAIQGuAgAAAI0CAgcHAACLBAAg4AEBAKkDACHkAUAAqgMAIYQCAACJBI0CIokCAQCpAwAhjQICAM0DACGOAgEArwMAIQUhAADpBQAgIgAA7AUAIKsCAADqBQAgrAIAAOsFACCxAgAA7gEAIAcHAACNBAAg4AEBAAAAAeQBQAAAAAGEAgAAAI0CAokCAQAAAAGNAgIAAAABjgIBAAAAAQMhAADpBQAgqwIAAOoFACCxAgAA7gEAIBAJAACSBAAgDwAAkQQAIBAAAJAEACAUAACPBAAg4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABqAIBAAAAAQMhAADnBQAgqwIAAOgFACCxAgAA7gEAIAQhAAD_AwAwqwIAAIAEADCtAgAAggQAILECAACDBAAwBCEAAO8DADCrAgAA8AMAMK0CAADyAwAgsQIAAPMDADAEIQAA4QMAMKsCAADiAwAwrQIAAOQDACCxAgAA5QMAMAYSAACUBAAg4AECAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAaICAQAAAAEEIQAA0AMAMKsCAADRAwAwrQIAANMDACCxAgAA1AMAMAcGAACfBAAg4AEBAAAAAeQBQAAAAAGEAgAAAI0CAooCAQAAAAGNAgIAAAABjgIBAAAAAQIAAAAjACAhAACeBAAgAwAAACMAICEAAJ4EACAiAACcBAAgARoAAOYFADACAAAAIwAgGgAAnAQAIAIAAACHBAAgGgAAmwQAIAbgAQEAqQMAIeQBQACqAwAhhAIAAIkEjQIiigIBAKkDACGNAgIAzQMAIY4CAQCvAwAhBwYAAJ0EACDgAQEAqQMAIeQBQACqAwAhhAIAAIkEjQIiigIBAKkDACGNAgIAzQMAIY4CAQCvAwAhBSEAAOEFACAiAADkBQAgqwIAAOIFACCsAgAA4wUAILECAAABACAHBgAAnwQAIOABAQAAAAHkAUAAAAABhAIAAACNAgKKAgEAAAABjQICAAAAAY4CAQAAAAEDIQAA4QUAIKsCAADiBQAgsQIAAAEAIAgGAACqBAAgDgAA_QMAIOABAQAAAAHkAUAAAAAB5QFAAAAAAYgCAQAAAAGKAgEAAAABiwICAAAAAQIAAAAdACAhAACpBAAgAwAAAB0AICEAAKkEACAiAACnBAAgARoAAOAFADACAAAAHQAgGgAApwQAIAIAAAD3AwAgGgAApgQAIAbgAQEAqQMAIeQBQACqAwAh5QFAAKoDACGIAgEAqQMAIYoCAQCpAwAhiwICAM0DACEIBgAAqAQAIA4AAPoDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACGIAgEAqQMAIYoCAQCpAwAhiwICAM0DACEFIQAA2wUAICIAAN4FACCrAgAA3AUAIKwCAADdBQAgsQIAAAEAIAgGAACqBAAgDgAA_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_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABpwICAAAAAQIAAAABACAhAADWBAAgAwAAAAEAICEAANYEACAiAADUBAAgARoAANMFADACAAAAAQAgGgAA1AQAIAIAAADYAwAgGgAA0wQAIAzgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIYECAQCvAwAhhAIAANsDpQIimwIIANoDACGiAgEArwMAIaMCAgDNAwAhpQIBAKkDACGmAkAAqgMAIacCAgDNAwAhEAkAAOADACAPAADfAwAgEAAA3gMAIBMAANUEACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIYECAQCvAwAhhAIAANsDpQIimwIIANoDACGiAgEArwMAIaMCAgDNAwAhpQIBAKkDACGmAkAAqgMAIacCAgDNAwAhBSEAAM4FACAiAADRBQAgqwIAAM8FACCsAgAA0AUAILECAAAnACAQCQAAkgQAIA8AAJEEACAQAACQBAAgEwAA1wQAIOABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAGBAgEAAAABhAIAAAClAgKbAggAAAABogIBAAAAAaMCAgAAAAGlAgEAAAABpgJAAAAAAacCAgAAAAEDIQAAzgUAIKsCAADPBQAgsQIAACcAIAzgAQEAAAAB5AFAAAAAAeUBQAAAAAHxAQEAAAAB8gEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAfoBAQAAAAECAAAACwAgIQAA4wQAIAMAAAALACAhAADjBAAgIgAA4gQAIAEaAADNBQAwEQMAAJYDACDdAQAAowMAMN4BAAAJABDfAQAAowMAMOABAQAAAAHkAUAA1QIAIeUBQADVAgAh8QEBANQCACHyAQEA1AIAIfMBAQDUAgAh9AEBAOUCACH1AQEA5QIAIfYBAQDlAgAh9wFAAKQDACH4AUAApAMAIfkBAQDlAgAh-gEBAOUCACECAAAACwAgGgAA4gQAIAIAAADgBAAgGgAA4QQAIBDdAQAA3wQAMN4BAADgBAAQ3wEAAN8EADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACHxAQEA1AIAIfIBAQDUAgAh8wEBANQCACH0AQEA5QIAIfUBAQDlAgAh9gEBAOUCACH3AUAApAMAIfgBQACkAwAh-QEBAOUCACH6AQEA5QIAIRDdAQAA3wQAMN4BAADgBAAQ3wEAAN8EADDgAQEA1AIAIeQBQADVAgAh5QFAANUCACHxAQEA1AIAIfIBAQDUAgAh8wEBANQCACH0AQEA5QIAIfUBAQDlAgAh9gEBAOUCACH3AUAApAMAIfgBQACkAwAh-QEBAOUCACH6AQEA5QIAIQzgAQEAqQMAIeQBQACqAwAh5QFAAKoDACHxAQEAqQMAIfIBAQCpAwAh9AEBAK8DACH1AQEArwMAIfYBAQCvAwAh9wFAALADACH4AUAAsAMAIfkBAQCvAwAh-gEBAK8DACEM4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh8QEBAKkDACHyAQEAqQMAIfQBAQCvAwAh9QEBAK8DACH2AQEArwMAIfcBQACwAwAh-AFAALADACH5AQEArwMAIfoBAQCvAwAhDOABAQAAAAHkAUAAAAAB5QFAAAAAAfEBAQAAAAHyAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAAB-gEBAAAAAQfgAQEAAAAB4wFAAAAAAeQBQAAAAAHlAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABAgAAAAcAICEAAO8EACADAAAABwAgIQAA7wQAICIAAO4EACABGgAAzAUAMAwDAACWAwAg3QEAAKUDADDeAQAABQAQ3wEAAKUDADDgAQEAAAAB4wFAANUCACHkAUAA1QIAIeUBQADVAgAh8wEBANQCACH7AQEAAAAB_AEBAOUCACH9AQEA5QIAIQIAAAAHACAaAADuBAAgAgAAAOwEACAaAADtBAAgC90BAADrBAAw3gEAAOwEABDfAQAA6wQAMOABAQDUAgAh4wFAANUCACHkAUAA1QIAIeUBQADVAgAh8wEBANQCACH7AQEA1AIAIfwBAQDlAgAh_QEBAOUCACEL3QEAAOsEADDeAQAA7AQAEN8BAADrBAAw4AEBANQCACHjAUAA1QIAIeQBQADVAgAh5QFAANUCACHzAQEA1AIAIfsBAQDUAgAh_AEBAOUCACH9AQEA5QIAIQfgAQEAqQMAIeMBQACqAwAh5AFAAKoDACHlAUAAqgMAIfsBAQCpAwAh_AEBAK8DACH9AQEArwMAIQfgAQEAqQMAIeMBQACqAwAh5AFAAKoDACHlAUAAqgMAIfsBAQCpAwAh_AEBAK8DACH9AQEArwMAIQfgAQEAAAAB4wFAAAAAAeQBQAAAAAHlAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABBCEAAOQEADCrAgAA5QQAMK0CAADnBAAgsQIAAOgEADAEIQAA2AQAMKsCAADZBAAwrQIAANsEACCxAgAA3AQAMAQhAADNBAAwqwIAAM4EADCtAgAA0AQAILECAADUAwAwBCEAAKsEADCrAgAArAQAMK0CAACuBAAgsQIAAK8EADAEIQAAoAQAMKsCAAChBAAwrQIAAKMEACCxAgAA8wMAMAQhAACVBAAwqwIAAJYEADCtAgAAmAQAILECAACDBAAwBCEAAMMDADCrAgAAxAMAMK0CAADGAwAgsQIAAMcDADAAAAAAAAAAAAAACyEAAIIFADAiAACGBQAwqwIAAIMFADCsAgAAhAUAMK0CAACFBQAgrgIAAPMDADCvAgAA8wMAMLACAADzAwAwsQIAAPMDADCyAgAAhwUAMLMCAAD2AwAwCAYAAKoEACAHAAD-AwAg4AEBAAAAAeQBQAAAAAHlAUAAAAABiQIBAAAAAYoCAQAAAAGLAgIAAAABAgAAAB0AICEAAIoFACADAAAAHQAgIQAAigUAICIAAIkFACABGgAAywUAMAIAAAAdACAaAACJBQAgAgAAAPcDACAaAACIBQAgBuABAQCpAwAh5AFAAKoDACHlAUAAqgMAIYkCAQCpAwAhigIBAKkDACGLAgIAzQMAIQgGAACoBAAgBwAA-wMAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIYkCAQCpAwAhigIBAKkDACGLAgIAzQMAIQgGAACqBAAgBwAA_gMAIOABAQAAAAHkAUAAAAAB5QFAAAAAAYkCAQAAAAGKAgEAAAABiwICAAAAAQQhAACCBQAwqwIAAIMFADCtAgAAhQUAILECAADzAwAwAAAAAAAAAAAAAAAAAAAABSEAAMYFACAiAADJBQAgqwIAAMcFACCsAgAAyAUAILECAAASACADIQAAxgUAIKsCAADHBQAgsQIAABIAIAUHAAC2BQAgCQAAuQUAIAoAALoFACCfAgAAqwMAIKACAACrAwAgAAAAAAAAAAAAAAUhAADBBQAgIgAAxAUAIKsCAADCBQAgrAIAAMMFACCxAgAA7gEAIAMhAADBBQAgqwIAAMIFACCxAgAA7gEAIAAAAAAAByEAALwFACAiAAC_BQAgqwIAAL0FACCsAgAAvgUAIK8CAAADACCwAgAAAwAgsQIAAO4BACADIQAAvAUAIKsCAAC9BQAgsQIAAO4BACAAAAAAAAsEAAD3BAAgBQAA-AQAIAYAAPkEACAMAAD6BAAgDwAA-wQAIBAAAPwEACARAAD9BAAggQIAAKsDACCCAgAAqwMAIIMCAACrAwAghAIAAKsDACAHCQAAuQUAIA8AAPsEACAQAAD8BAAgEwAAuwUAIBQAALYFACCBAgAAqwMAIKICAACrAwAgAQ0AAPsEACAAAwgAAJ0FACCRAgAAqwMAIJMCAACrAwAgBAMAALYFACASAAD5BAAg8wEAAKsDACCiAgAAqwMAIBAEAADwBAAgBQAA8QQAIAYAAPIEACAMAADzBAAgDwAA9AQAIBAAAPUEACDgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABAgAAAO4BACAhAAC8BQAgAwAAAAMAICEAALwFACAiAADABQAgEgAAAAMAIAQAALwDACAFAAC9AwAgBgAAvgMAIAwAAL8DACAPAADAAwAgEAAAwQMAIBoAAMAFACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAEAAC8AwAgBQAAvQMAIAYAAL4DACAMAAC_AwAgDwAAwAMAIBAAAMEDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAEAADwBAAgBQAA8QQAIAYAAPIEACAPAAD0BAAgEAAA9QQAIBEAAPYEACDgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABAgAAAO4BACAhAADBBQAgAwAAAAMAICEAAMEFACAiAADFBQAgEgAAAAMAIAQAALwDACAFAAC9AwAgBgAAvgMAIA8AAMADACAQAADBAwAgEQAAwgMAIBoAAMUFACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAEAAC8AwAgBQAAvQMAIAYAAL4DACAPAADAAwAgEAAAwQMAIBEAAMIDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIQsHAACpBQAgCQAAywQAIOABAQAAAAHlAUAAAAABhAIAAACfAgKJAgEAAAABnAIIAAAAAZ0CAAAAkwICnwIBAAAAAaACAQAAAAGhAkAAAAABAgAAABIAICEAAMYFACADAAAAEAAgIQAAxgUAICIAAMoFACANAAAAEAAgBwAAqAUAIAkAALgEACAaAADKBQAg4AEBAKkDACHlAUAAqgMAIYQCAAC2BJ8CIokCAQCpAwAhnAIIANoDACGdAgAAtQSTAiKfAgEArwMAIaACAQCvAwAhoQJAAKoDACELBwAAqAUAIAkAALgEACDgAQEAqQMAIeUBQACqAwAhhAIAALYEnwIiiQIBAKkDACGcAggA2gMAIZ0CAAC1BJMCIp8CAQCvAwAhoAIBAK8DACGhAkAAqgMAIQbgAQEAAAAB5AFAAAAAAeUBQAAAAAGJAgEAAAABigIBAAAAAYsCAgAAAAEH4AEBAAAAAeMBQAAAAAHkAUAAAAAB5QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQzgAQEAAAAB5AFAAAAAAeUBQAAAAAHxAQEAAAAB8gEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAfoBAQAAAAEHAwAAsAUAIOABAgAAAAHkAUAAAAAB5QFAAAAAAfMBAQAAAAH-AQEAAAABogIBAAAAAQIAAAAnACAhAADOBQAgAwAAACUAICEAAM4FACAiAADSBQAgCQAAACUAIAMAAK8FACAaAADSBQAg4AECAM0DACHkAUAAqgMAIeUBQACqAwAh8wEBAK8DACH-AQEAqQMAIaICAQCvAwAhBwMAAK8FACDgAQIAzQMAIeQBQACqAwAh5QFAAKoDACHzAQEArwMAIf4BAQCpAwAhogIBAK8DACEM4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABpwICAAAAAREPAACRBAAgEAAAkAQAIBMAANcEACAUAACPBAAg4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABpwICAAAAAagCAQAAAAECAAAAAQAgIQAA1AUAIAMAAAANACAhAADUBQAgIgAA2AUAIBMAAAANACAPAADfAwAgEAAA3gMAIBMAANUEACAUAADdAwAgGgAA2AUAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAhgQIBAK8DACGEAgAA2wOlAiKbAggA2gMAIaICAQCvAwAhowICAM0DACGlAgEAqQMAIaYCQACqAwAhpwICAM0DACGoAgEAqQMAIREPAADfAwAgEAAA3gMAIBMAANUEACAUAADdAwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACGBAgEArwMAIYQCAADbA6UCIpsCCADaAwAhogIBAK8DACGjAgIAzQMAIaUCAQCpAwAhpgJAAKoDACGnAgIAzQMAIagCAQCpAwAhBeABAQAAAAHkAUAAAAABigIBAAAAAYsCAgAAAAGbAggAAAABCOABAQAAAAHlAUAAAAABhAIAAACfAgKcAggAAAABnQIAAACTAgKfAgEAAAABoAIBAAAAAaECQAAAAAERCQAAkgQAIBAAAJAEACATAADXBAAgFAAAjwQAIOABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAGBAgEAAAABhAIAAAClAgKbAggAAAABogIBAAAAAaMCAgAAAAGlAgEAAAABpgJAAAAAAacCAgAAAAGoAgEAAAABAgAAAAEAICEAANsFACADAAAADQAgIQAA2wUAICIAAN8FACATAAAADQAgCQAA4AMAIBAAAN4DACATAADVBAAgFAAA3QMAIBoAAN8FACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIYECAQCvAwAhhAIAANsDpQIimwIIANoDACGiAgEArwMAIaMCAgDNAwAhpQIBAKkDACGmAkAAqgMAIacCAgDNAwAhqAIBAKkDACERCQAA4AMAIBAAAN4DACATAADVBAAgFAAA3QMAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAhgQIBAK8DACGEAgAA2wOlAiKbAggA2gMAIaICAQCvAwAhowICAM0DACGlAgEAqQMAIaYCQACqAwAhpwICAM0DACGoAgEAqQMAIQbgAQEAAAAB5AFAAAAAAeUBQAAAAAGIAgEAAAABigIBAAAAAYsCAgAAAAERCQAAkgQAIA8AAJEEACATAADXBAAgFAAAjwQAIOABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAGBAgEAAAABhAIAAAClAgKbAggAAAABogIBAAAAAaMCAgAAAAGlAgEAAAABpgJAAAAAAacCAgAAAAGoAgEAAAABAgAAAAEAICEAAOEFACADAAAADQAgIQAA4QUAICIAAOUFACATAAAADQAgCQAA4AMAIA8AAN8DACATAADVBAAgFAAA3QMAIBoAAOUFACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIYECAQCvAwAhhAIAANsDpQIimwIIANoDACGiAgEArwMAIaMCAgDNAwAhpQIBAKkDACGmAkAAqgMAIacCAgDNAwAhqAIBAKkDACERCQAA4AMAIA8AAN8DACATAADVBAAgFAAA3QMAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAhgQIBAK8DACGEAgAA2wOlAiKbAggA2gMAIaICAQCvAwAhowICAM0DACGlAgEAqQMAIaYCQACqAwAhpwICAM0DACGoAgEAqQMAIQbgAQEAAAAB5AFAAAAAAYQCAAAAjQICigIBAAAAAY0CAgAAAAGOAgEAAAABEAQAAPAEACAFAADxBAAgDAAA8wQAIA8AAPQEACAQAAD1BAAgEQAA9gQAIOABAQAAAAHkAUAAAAAB5QFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAECAAAA7gEAICEAAOcFACAQBAAA8AQAIAUAAPEEACAGAADyBAAgDAAA8wQAIA8AAPQEACARAAD2BAAg4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIBAAAAAQIAAADuAQAgIQAA6QUAIAMAAAADACAhAADpBQAgIgAA7QUAIBIAAAADACAEAAC8AwAgBQAAvQMAIAYAAL4DACAMAAC_AwAgDwAAwAMAIBEAAMIDACAaAADtBQAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACEQBAAAvAMAIAUAAL0DACAGAAC-AwAgDAAAvwMAIA8AAMADACARAADCAwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACEG4AEBAAAAAeQBQAAAAAGEAgAAAI0CAokCAQAAAAGNAgIAAAABjgIBAAAAARAEAADwBAAgBQAA8QQAIAYAAPIEACAMAADzBAAgEAAA9QQAIBEAAPYEACDgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABAgAAAO4BACAhAADvBQAgBOABAQAAAAHkAUAAAAAB5QFAAAAAAfMBAQAAAAECAAAA1QEAICEAAPEFACADAAAAAwAgIQAA7wUAICIAAPUFACASAAAAAwAgBAAAvAMAIAUAAL0DACAGAAC-AwAgDAAAvwMAIBAAAMEDACARAADCAwAgGgAA9QUAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAh_wEBAKkDACGAAiAAuwMAIYECAQCvAwAhggIBAK8DACGDAgEArwMAIYQCAQCvAwAhEAQAALwDACAFAAC9AwAgBgAAvgMAIAwAAL8DACAQAADBAwAgEQAAwgMAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIf4BAQCpAwAh_wEBAKkDACGAAiAAuwMAIYECAQCvAwAhggIBAK8DACGDAgEArwMAIYQCAQCvAwAhAwAAANgBACAhAADxBQAgIgAA-AUAIAYAAADYAQAgGgAA-AUAIOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIfMBAQCpAwAhBOABAQCpAwAh5AFAAKoDACHlAUAAqgMAIfMBAQCpAwAhBuABAQAAAAHkAUAAAAAB5QFAAAAAAYgCAQAAAAGJAgEAAAABiwICAAAAAQsHAACpBQAgCgAAzAQAIOABAQAAAAHlAUAAAAABhAIAAACfAgKJAgEAAAABnAIIAAAAAZ0CAAAAkwICnwIBAAAAAaACAQAAAAGhAkAAAAABAgAAABIAICEAAPoFACADAAAAEAAgIQAA-gUAICIAAP4FACANAAAAEAAgBwAAqAUAIAoAALkEACAaAAD-BQAg4AEBAKkDACHlAUAAqgMAIYQCAAC2BJ8CIokCAQCpAwAhnAIIANoDACGdAgAAtQSTAiKfAgEArwMAIaACAQCvAwAhoQJAAKoDACELBwAAqAUAIAoAALkEACDgAQEAqQMAIeUBQACqAwAhhAIAALYEnwIiiQIBAKkDACGcAggA2gMAIZ0CAAC1BJMCIp8CAQCvAwAhoAIBAK8DACGhAkAAqgMAIQXgAQEAAAAB5AFAAAAAAYsCAgAAAAGUAgEAAAABmwIIAAAAAQMAAAADACAhAADnBQAgIgAAggYAIBIAAAADACAEAAC8AwAgBQAAvQMAIAwAAL8DACAPAADAAwAgEAAAwQMAIBEAAMIDACAaAACCBgAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACEQBAAAvAMAIAUAAL0DACAMAAC_AwAgDwAAwAMAIBAAAMEDACARAADCAwAg4AEBAKkDACHkAUAAqgMAIeUBQACqAwAh_gEBAKkDACH_AQEAqQMAIYACIAC7AwAhgQIBAK8DACGCAgEArwMAIYMCAQCvAwAhhAIBAK8DACEM4AEBAAAAAeQBQAAAAAHlAUAAAAAB_gEBAAAAAYECAQAAAAGEAgAAAKUCApsCCAAAAAGiAgEAAAABowICAAAAAaUCAQAAAAGmAkAAAAABqAIBAAAAAQXgAQIAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAABogIBAAAAARAFAADxBAAgBgAA8gQAIAwAAPMEACAPAAD0BAAgEAAA9QQAIBEAAPYEACDgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABAgAAAO4BACAhAACFBgAgAwAAAAMAICEAAIUGACAiAACJBgAgEgAAAAMAIAUAAL0DACAGAAC-AwAgDAAAvwMAIA8AAMADACAQAADBAwAgEQAAwgMAIBoAAIkGACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAFAAC9AwAgBgAAvgMAIAwAAL8DACAPAADAAwAgEAAAwQMAIBEAAMIDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAEAADwBAAgBgAA8gQAIAwAAPMEACAPAAD0BAAgEAAA9QQAIBEAAPYEACDgAQEAAAAB5AFAAAAAAeUBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABAgAAAO4BACAhAACKBgAgAwAAAAMAICEAAIoGACAiAACOBgAgEgAAAAMAIAQAALwDACAGAAC-AwAgDAAAvwMAIA8AAMADACAQAADBAwAgEQAAwgMAIBoAAI4GACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIRAEAAC8AwAgBgAAvgMAIAwAAL8DACAPAADAAwAgEAAAwQMAIBEAAMIDACDgAQEAqQMAIeQBQACqAwAh5QFAAKoDACH-AQEAqQMAIf8BAQCpAwAhgAIgALsDACGBAgEArwMAIYICAQCvAwAhgwIBAK8DACGEAgEArwMAIQYJNAcLABAPMwoQMg0TAAIUAAMDAwQDCwAPEjABCAQIBAUMBQYPAQsADgwTBg8eChAkDREoAgEDAAMBAwADBAcAAwkXBwoZCAsACQIGAAEIAAYBCAAGAQkaAAMGAAEHAAMOAAsCCwAMDR8KAQ0gAAIGAAEHAAMHBCkABSoABisADCwADy0AEC4AES8AARIxAAMJNwAPNgAQNQAAAhMAAhQAAwITAAIUAAMFCwAVJwAWKAAXKQAYKgAZAAAAAAAFCwAVJwAWKAAXKQAYKgAZAQNXAwEDXQMFCwAeJwAfKAAgKQAhKgAiAAAAAAAFCwAeJwAfKAAgKQAhKgAiAQcAAwEHAAMFCwAnJwAoKAApKQAqKgArAAAAAAAFCwAnJwAoKAApKQAqKgArAgYAAQgABgIGAAEIAAYFCwAwJwAxKAAyKQAzKgA0AAAAAAAFCwAwJwAxKAAyKQAzKgA0AQgABgEIAAYFCwA5JwA6KAA7KQA8KgA9AAAAAAAFCwA5JwA6KAA7KQA8KgA9AgYAAQcAAwIGAAEHAAMFCwBCJwBDKABEKQBFKgBGAAAAAAAFCwBCJwBDKABEKQBFKgBGAwYAAQcAAw4ACwMGAAEHAAMOAAsFCwBLJwBMKABNKQBOKgBPAAAAAAAFCwBLJwBMKABNKQBOKgBPAAADCwBUKQBVKgBWAAAAAwsAVCkAVSoAVgAAAwsAWykAXCoAXQAAAAMLAFspAFwqAF0BAwADAQMAAwMLAGIpAGMqAGQAAAADCwBiKQBjKgBkAQMAAwEDAAMDCwBpKQBqKgBrAAAAAwsAaSkAaioAawAAAAMLAHEpAHIqAHMAAAADCwBxKQByKgBzFQIBFjgBFzkBGDoBGTsBGz0BHD8RHUASHkIBH0QRIEUTI0YBJEcBJUgRK0sULEwaLU0CLk4CL08CMFACMVECMlMCM1URNFYbNVkCNlsRN1wcOF4COV8COmARO2MdPGQjPWUGPmYGP2cGQGgGQWkGQmsGQ20RRG4kRXAGRnIRR3MlSHQGSXUGSnYRS3kmTHosTXsHTnwHT30HUH4HUX8HUoEBB1ODARFUhAEtVYYBB1aIARFXiQEuWIoBB1mLAQdajAERW48BL1yQATVdkgEIXpMBCF-VAQhglgEIYZcBCGKZAQhjmwERZJwBNmWeAQhmoAERZ6EBN2iiAQhpowEIaqQBEWunAThsqAE-bakBDW6qAQ1vqwENcKwBDXGtAQ1yrwENc7EBEXSyAT91tAENdrYBEXe3AUB4uAENebkBDXq6ARF7vQFBfL4BR32_AQp-wAEKf8EBCoABwgEKgQHDAQqCAcUBCoMBxwERhAHIAUiFAcoBCoYBzAERhwHNAUmIAc4BCokBzwEKigHQARGLAdMBSowB1AFQjQHWAQuOAdcBC48B2gELkAHbAQuRAdwBC5IB3gELkwHgARGUAeEBUZUB4wELlgHlARGXAeYBUpgB5wELmQHoAQuaAekBEZsB7AFTnAHtAVedAe8BA54B8AEDnwHyAQOgAfMBA6EB9AEDogH2AQOjAfgBEaQB-QFYpQH7AQOmAf0BEacB_gFZqAH_AQOpAYACA6oBgQIRqwGEAlqsAYUCXq0BhgIErgGHAgSvAYgCBLABiQIEsQGKAgSyAYwCBLMBjgIRtAGPAl-1AZECBLYBkwIRtwGUAmC4AZUCBLkBlgIEugGXAhG7AZoCYbwBmwJlvQGcAgW-AZ0CBb8BngIFwAGfAgXBAaACBcIBogIFwwGkAhHEAaUCZsUBpwIFxgGpAhHHAaoCZ8gBqwIFyQGsAgXKAa0CEcsBsAJozAGxAmzNAbMCbc4BtAJtzwG3Am3QAbgCbdEBuQJt0gG7Am3TAb0CEdQBvgJu1QHAAm3WAcICEdcBwwJv2AHEAm3ZAcUCbdoBxgIR2wHJAnDcAcoCdA"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MedicinesScalarFieldEnum: () => MedicinesScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrdersScalarFieldEnum: () => OrdersScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Medicines: "Medicines",
  Category: "Category",
  Orders: "Orders",
  OrderItem: "OrderItem",
  Payment: "Payment",
  Reviews: "Reviews",
  CartItem: "CartItem",
  Cart: "Cart",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var MedicinesScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stock: "stock",
  status: "status",
  manufacturer: "manufacturer",
  expiryDate: "expiryDate",
  image: "image",
  categoryId: "categoryId",
  sellerId: "sellerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrdersScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  totalPrice: "totalPrice",
  paymentStatus: "paymentStatus",
  status: "status",
  paymentGateway: "paymentGateway",
  shippingAddress: "shippingAddress",
  orderDate: "orderDate",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  status: "status",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  orderId: "orderId"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  medicineId: "medicineId",
  customerId: "customerId",
  status: "status",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  customerId: "customerId",
  medicineId: "medicineId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  CANCEL: "CANCEL"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.role = user.role;
      return session;
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/modules/Category/category.route.ts
import express from "express";

// src/modules/Category/category.service.ts
var createCategory = async (data, userId) => {
  const res = await prisma.category.create({
    data: {
      ...data,
      userId
    }
  });
  return res;
};
var getAllCategory = async () => {
  const res = await prisma.category.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: {
          Medicines: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return res;
};
var getCategoryById = async (id) => {
  const res = await prisma.category.findMany({
    where: {
      id
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: {
          Medicines: true
        }
      }
    }
  });
  return res;
};
var updateCategory = async (categoryId, data, userId, isAdmin) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId
    },
    include: {
      user: true
    }
  });
  if (!isAdmin && categoryData.userId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.category.update({
    where: {
      id: categoryData.id
    },
    data
  });
  return result;
};
var deleteCategory = async (categoryId) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId
    }
  });
  return await prisma.category.delete({
    where: {
      id: categoryData.id
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/middlewere/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Your are not authorlized"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "forbiden"
        });
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};
var auth_default = auth2;

// src/modules/Category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to create a category"
      });
    }
    const result = await categoryService.createCategory(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Created failed",
      details: error
    });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategory();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Find failed",
      details: error
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const id = Number(categoryId);
    const result = await categoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid category id",
      details: error
    });
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await categoryService.updateCategory(
      id,
      req.body,
      user?.id,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }
    const result = await categoryService.deleteCategory(id);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "post delete failed",
      details: error
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/Category/category.route.ts
var router = express.Router();
router.post("/", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  categoryController.getCategoryById
);
router.patch(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
router.delete(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var CategoryRouter = router;

// src/modules/medicine/medicine.route.ts
import express2 from "express";

// src/modules/medicine/medicine.service.ts
var createMedicine = async (data) => {
  const medicineData = {
    ...data
  };
  const res = await prisma.medicines.create({
    data: medicineData
  });
  return res;
};
var getAllMedicine = async (payload) => {
  const addCondition = [];
  if (payload.search) {
    addCondition.push({
      OR: [
        {
          name: {
            contains: payload.search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: payload.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (payload.category) {
    addCondition.push({
      categoryId: Number(payload.category)
    });
  }
  if (payload.status) {
    addCondition.push({
      status: payload.status
    });
  }
  const res = await prisma.medicines.findMany({
    where: {
      AND: addCondition
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      category: {
        select: { name: true }
      },
      reviews: true,
      seller: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: { orderItems: true, reviews: true }
      }
    }
  });
  return res;
};
var getMedicineById = async (medicineid) => {
  const res = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineid
    },
    include: {
      category: {
        select: { name: true, id: true }
      },
      reviews: {
        select: {
          comment: true,
          createdAt: true,
          id: true,
          customer: {
            select: {
              name: true,
              id: true
            }
          }
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true
        }
      },
      _count: {
        select: { reviews: true, orderItems: true }
      }
    }
  });
  return res;
};
var getMedicineBySeller = async (sellerId) => {
  const medicineData = await prisma.medicines.findMany({
    where: {
      sellerId
    },
    include: {
      category: {
        select: { name: true }
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true
        }
      }
    }
  });
  return medicineData;
};
var updateMedicine = async (medicineId, data, userId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    include: {
      seller: true
    }
  });
  if (medicineData.sellerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.medicines.update({
    where: {
      id: medicineData.id
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    }
  });
  return await prisma.medicines.delete({
    where: {
      id: medicineData.id
    }
  });
};
var medicineService = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  getMedicineBySeller,
  updateMedicine,
  deleteMedicine
};

// src/modules/medicine/medicineController.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (user?.role !== "ADMIN" /* ADMIN */ && user?.role !== "SELLER" /* SELLER */) {
      return res.status(403).json({
        success: false,
        details: "You are not authorized to create medicine"
      });
    }
    const result = await medicineService.createMedicine(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Created failed",
      details: error
    });
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const category = req.query.category;
    const status = req.query.status;
    const result = await medicineService.getAllMedicine({
      search: searchString,
      category,
      status
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { medicineid } = req.params;
    if (!medicineid) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    const result = await medicineService.getMedicineById(medicineid);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var getMedicineBySeller2 = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const user = req.user;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    if (user?.id !== sellerId && user?.role !== "ADMIN" /* ADMIN */) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource"
      });
    }
    const result = await medicineService.getMedicineBySeller(
      sellerId
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    const result = await medicineService.updateMedicine(
      medicineId,
      req.body,
      user?.id
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    const result = await medicineService.deleteMedicine(medicineId);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "post delete failed",
      details: error
    });
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicine: getAllMedicine2,
  getMedicineById: getMedicineById2,
  getMedicineBySeller: getMedicineBySeller2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2
};

// src/modules/medicine/medicine.route.ts
var router2 = express2.Router();
router2.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.createMedicine
);
router2.get("/", medicineController.getAllMedicine);
router2.get("/:medicineid", medicineController.getMedicineById);
router2.patch(
  "/:medicineId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.updateMedicine
);
router2.get(
  "/seller/:sellerId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.getMedicineBySeller
);
router2.delete(
  "/:medicineId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.deleteMedicine
);
var MedicinesRouter = router2;

// src/modules/reviews/review.route.ts
import express3 from "express";

// src/modules/reviews/review.service.ts
var createReview = async (payload) => {
  return await prisma.reviews.create({
    data: payload
  });
};
var reviewAll = async () => {
  return await prisma.reviews.findMany({
    include: {
      medicines: {
        select: {
          name: true,
          id: true
        }
      },
      customer: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });
};
var reviewById = async (id) => {
  return await prisma.reviews.findUnique({
    where: {
      id
    },
    include: {
      medicines: {
        select: {
          name: true,
          id: true
        }
      },
      customer: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });
};
var reviewUpdate = async (reviewId, data, userId) => {
  const reviewData = await prisma.reviews.findUniqueOrThrow({
    where: {
      id: reviewId
    },
    include: {
      customer: true
    }
  });
  if (reviewData.customerId !== userId) {
    throw new Error("your are not owner in this review");
  }
  const result = await prisma.reviews.update({
    where: {
      id: reviewData.id
    },
    data
  });
  return result;
};
var reviewDelete = async (reviewId, userId, isAdmin) => {
  const reviewData = await prisma.reviews.findUnique({
    where: {
      id: reviewId
    },
    include: {
      customer: true
    }
  });
  if (!reviewData) {
    throw new Error("Review not found");
  }
  if (!isAdmin && reviewData.customerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.reviews.delete({
    where: {
      id: reviewId
    }
  });
  return result;
};
var reviewService = {
  createReview,
  reviewAll,
  reviewById,
  reviewUpdate,
  reviewDelete
};

// src/modules/reviews/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review created failed",
      details: error
    });
  }
};
var reviewAll2 = async (req, res) => {
  try {
    const result = await reviewService.reviewAll();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Finds failed",
      details: error
    });
  }
};
var reviewById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reviewService.reviewById(id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Find failed",
      details: error
    });
  }
};
var reviewUpdate2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await reviewService.reviewUpdate(
      id,
      req.body,
      user?.id
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var reviewDelete2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await reviewService.reviewDelete(
      id,
      user?.id,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  reviewAll: reviewAll2,
  reviewById: reviewById2,
  reviewUpdate: reviewUpdate2,
  reviewDelete: reviewDelete2
};

// src/modules/reviews/review.route.ts
var router3 = express3.Router();
router3.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.createReview
);
router3.get("/", reviewController.reviewAll);
router3.get("/:id", reviewController.reviewById);
router3.patch(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.reviewUpdate
);
router3.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.reviewDelete
);
var ReviewRouter = router3;

// src/modules/cart/cart.route.ts
import express4 from "express";

// src/modules/cart/cart.service.ts
var createCart = async (data, userId) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId }
  });
  if (!cartData) {
    return prisma.cart.create({
      data: {
        ...data
      }
    });
  }
  return cartData;
};
var getMyCart = async (userId) => {
  let cart = await prisma.cart.findMany({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          medicines: {
            select: {
              name: true,
              price: true,
              id: true,
              image: true,
              description: true
            }
          }
        }
      }
    }
  });
  return cart;
};
var getCartById = async (id) => {
  const cart = await prisma.cart.findFirst({
    where: { id },
    include: {
      items: true
    }
  });
  return cart;
};
var deleteCartById = async (id, userId) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId }
  });
  if (cartData?.userId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cart.delete({
    where: { id }
  });
};
var CartService = {
  createCart,
  getCartById,
  getMyCart,
  deleteCartById
};

// src/modules/cart/cart.controller.ts
var createCart2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await CartService.createCart(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart created failed",
      details: error
    });
  }
};
var getMyCart2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await CartService.getMyCart(user?.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var getCartById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CartService.getCartById(id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var deleteCartById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartService.deleteCartById(
      id,
      user?.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var cartController = {
  createCart: createCart2,
  getCartById: getCartById2,
  getMyCart: getMyCart2,
  deleteCartById: deleteCartById2
};

// src/modules/cart/cart.route.ts
var router4 = express4.Router();
router4.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.createCart
);
router4.get(
  "/myCart",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.getMyCart
);
router4.get(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.getCartById
);
router4.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.deleteCartById
);
var CartRouter = router4;

// src/modules/cartItem/cartItem.route.ts
import express5 from "express";

// src/modules/cartItem/cartItem.service.ts
var createCartItem = async (payload) => {
  let cart = null;
  if (payload.cartId) {
    cart = await prisma.cart.findUnique({
      where: { id: payload.cartId },
      include: { items: true }
    });
  } else {
    cart = await prisma.cart.findFirst({
      where: { userId: payload.customerId },
      include: { items: true }
    });
  }
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: payload.customerId },
      include: { items: true }
    });
  }
  const existingItem = cart.items.find(
    (item) => item.medicineId === payload.medicineId
  );
  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: {
          increment: payload.quantity
        }
      }
    });
    return updatedItem;
  }
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      customerId: payload.customerId,
      medicineId: payload.medicineId,
      quantity: payload.quantity
    }
  });
  return cartItem;
};
var getCartItem = async () => {
  const cart = await prisma.cartItem.findMany({
    include: {
      medicines: {
        select: {
          id: true,
          name: true,
          description: true,
          stock: true,
          price: true,
          sellerId: true,
          categoryId: true,
          image: true
        }
      }
    }
  });
  const cartWithTotal = cart.map((item) => {
    const totalPrice = item.quantity * item.medicines.price;
    return {
      ...item,
      totalPrice
    };
  });
  return cartWithTotal;
};
var updateCartItem = async (cartItemId, quantity) => {
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: quantity,
    include: { medicines: true }
  });
  return updatedCartItem;
};
var deleteCartItemById = async (id, userId) => {
  const cartData = await prisma.cartItem.findFirst({
    where: { customerId: userId }
  });
  if (cartData?.customerId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cartItem.delete({
    where: { id }
  });
};
var CartItemService = {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItemById
};

// src/modules/cartItem/cartItem.controller.ts
var createCartItem2 = async (req, res) => {
  try {
    const result = await CartItemService.createCartItem(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart created failed",
      details: error
    });
  }
};
var getCartItem2 = async (req, res) => {
  try {
    const result = await CartItemService.getCartItem();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var updateCartItem2 = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const result = await CartItemService.updateCartItem(
      cartItemId,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart update failed",
      details: error
    });
  }
};
var deleteCartItemById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartItemService.deleteCartItemById(
      id,
      user?.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var cartItemController = {
  createCartItem: createCartItem2,
  getCartItem: getCartItem2,
  updateCartItem: updateCartItem2,
  deleteCartItemById: deleteCartItemById2
};

// src/modules/cartItem/cartItem.route.ts
var router5 = express5.Router();
router5.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.createCartItem
);
router5.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.getCartItem
);
router5.patch(
  "/:cartItemId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.updateCartItem
);
router5.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.deleteCartItemById
);
var CartItemRouter = router5;

// src/modules/order/order.route.ts
import express6 from "express";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
var stripe_config_default = stripe;

// src/modules/order/order.service.ts
import { v7 as uuidv7 } from "uuid";
var createOrder = async (data, userId) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: userId },
      include: { medicines: true }
    });
    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.medicines.price,
      0
    );
    const paymentGateway = data.paymentGateway ?? "COD";
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          customerId: userId,
          totalPrice,
          shippingAddress: data.shippingAddress,
          paymentGateway,
          paymentStatus: PaymentStatus.UNPAID,
          orderItems: {
            create: cartItems.map((item) => ({
              medicineId: item.medicineId,
              quantity: item.quantity,
              price: item.medicines.price
            }))
          }
        },
        include: {
          orderItems: {
            include: {
              medicines: true
            }
          },
          customer: true
        }
      });
      for (const item of cartItems) {
        await tx.medicines.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      await tx.cartItem.deleteMany({
        where: { customerId: userId }
      });
      let paymentUrl = null;
      if (paymentGateway === "STRIPE") {
        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.totalPrice,
            transactionId: uuidv7(),
            status: PaymentStatus.UNPAID
          }
        });
        const session = await stripe_config_default.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Medicine Order #${order.id}`
                },
                unit_amount: Math.round(order.totalPrice * 100)
              },
              quantity: 1
            }
          ],
          metadata: {
            orderId: order.id,
            paymentId: payment.id
          },
          success_url: `${process.env.FRONTEND_URL}/customer-dashboard/order/${order.id}`,
          cancel_url: `${process.env.FRONTEND_URL}/`
        });
        paymentUrl = session.url;
      }
      return {
        order,
        paymentUrl
      };
    });
    return result;
  } catch (err) {
    console.error("Order creation failed:", err);
    throw new Error("Could not complete order");
  }
};
var getAllOrders = async (user) => {
  let whereCondition = {};
  if (user.role === "ADMIN" /* ADMIN */) {
    whereCondition = {};
  } else if (user.role === "CUSTOMER" /* CUSTOMER */) {
    whereCondition = { customerId: user.id };
  } else if (user.role === "SELLER" /* SELLER */) {
    whereCondition = {
      orderItems: {
        some: {
          medicines: {
            sellerId: user.id
          }
        }
      }
    };
  }
  return await prisma.orders.findMany({
    where: whereCondition,
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
          role: true,
          phone: true
        }
      },
      orderItems: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: {
                  name: true,
                  categories: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      orderDate: "desc"
    }
  });
};
var getOrderById = async (orderId, user) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      orderItems: {
        include: {
          medicines: {
            include: {
              seller: true
            }
          }
        }
      }
    }
  });
  if (!order) throw new Error("Order not found");
  if (user.role === "CUSTOMER" /* CUSTOMER */ && order.customerId !== user.id) {
    throw new Error("Not authorized");
  }
  if (user.role === "SELLER" /* SELLER */) {
    const sellerItems = order.orderItems.filter(
      (item) => item.medicines.sellerId === user.id
    );
    if (!sellerItems.length) {
      throw new Error("Not authorized to view this order");
    }
    const sellerSubtotal = sellerItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    return {
      orderId: order.id,
      status: order.paymentStatus,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      customer: order.customer,
      items: sellerItems,
      sellerSubtotal
    };
  }
  return order;
};
var updateOrderStatus = async (orderId, userId, userRoles, newStatus) => {
  if (!Object.values(OrderStatus).includes(newStatus)) {
    throw new Error("Invalid status value");
  }
  const order = await prisma.orders.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (userRoles.includes("CUSTOMER" /* CUSTOMER */)) {
    if (newStatus !== OrderStatus.CANCEL) {
      throw new Error("Customer can only cancel order");
    }
    if (order.customerId !== userId) throw new Error("Not authorized");
    return prisma.orders.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCEL, updatedAt: /* @__PURE__ */ new Date() }
      // ✅ status field e likhcho
    });
  }
  if (userRoles.includes("ADMIN" /* ADMIN */)) {
    return prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus, updatedAt: /* @__PURE__ */ new Date() }
      // ✅ admin je status pathay, sheita e set hoy
    });
  }
  if (userRoles.includes("SELLER" /* SELLER */)) {
    const sellerItems = await prisma.orderItem.findMany({
      where: { orderId, medicines: { sellerId: userId } }
    });
    if (!sellerItems.length) throw new Error("Not authorized");
    if (newStatus === OrderStatus.CANCEL) {
      throw new Error("Sellers cannot cancel an order");
    }
    return prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus, updatedAt: /* @__PURE__ */ new Date() }
    });
  }
  throw new Error("Not authorized");
};
var orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await orderService.createOrder(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order created failed",
      details: error
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(401).json({
        error: "Unauthorized: user information missing"
      });
    }
    const result = await orderService.getAllOrders({
      id: user.id,
      role: user.role
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error
    });
  }
};
var getOrdersById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const result = await orderService.getOrderById(orderId, user);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error
    });
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const newStatus = req.body.status ?? req.body.paymentStatus;
    if (!user) {
      return res.status(401).json({ success: false, details: "Unauthorized" });
    }
    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      user.id,
      user.role,
      newStatus
    );
    res.status(200).json({ success: true, result: updatedOrder });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    res.status(403).json({ success: false, details });
  }
};
var orderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  getOrdersById,
  updateOrderStatus: updateOrderStatus2
};

// src/modules/order/order.route.ts
var router6 = express6.Router();
router6.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.createOrder
);
router6.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.getAllOrders
);
router6.get(
  "/:orderId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.getOrdersById
);
router6.patch(
  "/:orderId",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */),
  orderController.updateOrderStatus
);
var orderRouter = router6;

// src/middlewere/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "internal  server error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "your provide incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found. {cause}";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field: {field_name}";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "This is a non-recoverable error which probably happened inside the Prisma Query Engine";
  }
  if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "authocation filed.plase check your info";
    }
    if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "can't reach database server ";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: err
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/user/user.route.ts
import express7 from "express";

// src/modules/user/user.service.ts
var getAlluser = async () => {
  const res = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true, medicines: true, reviews: true }
      }
    }
  });
  return res;
};
var getAlluserById = async (userId) => {
  const res = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cartItems: true,
      _count: {
        select: { orders: true, medicines: true, reviews: true }
      }
    }
  });
  return res;
};
var updateUserData = async (userId, data) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const result = await prisma.user.update({
    where: {
      id: userData.id
    },
    data
  });
  return result;
};
var updateUser = async (userId, data, isAdmin) => {
  const postData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    select: {
      id: true
    }
  });
  if (!isAdmin && postData.id !== userId) {
    throw new Error("your are not owner in this user");
  }
  if (!isAdmin) {
    delete data.role;
  }
  const result = await prisma.user.update({
    where: {
      id: postData.id
    },
    data
  });
  return result;
};
var deleteUser = async (userId) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  return await prisma.user.delete({
    where: {
      id: userData.id
    }
  });
};
var userService = {
  getAlluser,
  getAlluserById,
  updateUserData,
  updateUser,
  deleteUser
};

// src/modules/user/uesr.controller.ts
var getAllUser = async (req, res) => {
  try {
    const result = await userService.getAlluser();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error
    });
  }
};
var getAlluserById2 = async (req, res) => {
  try {
    const authUser = req.user;
    const { userId } = req.params;
    let result;
    if (userId) {
      if (authUser?.role !== "ADMIN" /* ADMIN */) {
        return res.status(403).json({
          success: false,
          error: "Only admin can view other users' info"
        });
      }
      result = await userService.getAlluserById(userId);
    } else {
      result = await userService.getAlluserById(authUser?.id);
    }
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error
    });
  }
};
var updateUserData2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await userService.updateUserData(
      user?.id,
      req.body
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var updateUser2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await userService.updateUser(
      userId,
      req.body,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const result = await userService.deleteUser(userId);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "user stats get failed",
      details: error
    });
  }
};
var userController = {
  getAllUser,
  getAlluserById: getAlluserById2,
  updateUserData: updateUserData2,
  updateUser: updateUser2,
  deleteUser: deleteUser2
};

// src/modules/user/user.route.ts
var router7 = express7.Router();
router7.get("/", auth_default("ADMIN" /* ADMIN */), userController.getAllUser);
router7.get(
  "/me",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  userController.getAlluserById
);
router7.patch(
  "/updateProfile",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  userController.updateUserData
);
router7.get("/:userId", auth_default("ADMIN" /* ADMIN */), userController.getAlluserById);
router7.patch("/:userId", auth_default("ADMIN" /* ADMIN */), userController.updateUser);
router7.delete("/:userId", auth_default("ADMIN" /* ADMIN */), userController.deleteUser);
var UserRouter = router7;

// src/modules/payment/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  try {
    const existingEvent = await prisma.payment.findFirst({
      where: {
        stripeEventId: event.id
      }
    });
    if (existingEvent) {
      return { message: "Event already processed" };
    }
    switch (event.type) {
      /**
       * ✅ SUCCESS PAYMENT
       */
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const paymentId = session.metadata?.paymentId;
        if (!orderId || !paymentId) {
          return { message: "Missing metadata" };
        }
        await prisma.$transaction(async (tx) => {
          await tx.orders.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID
            }
          });
          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.PAID,
              stripeEventId: event.id,
              paymentGatewayData: session
            }
          });
        });
        return { message: "Payment completed successfully" };
      }
      /**
       * ❌ EXPIRED SESSION
       */
      case "checkout.session.expired": {
        const session = event.data.object;
        console.log("Session expired:", session.id);
        return { message: "Session expired" };
      }
      /**
       * ❌ PAYMENT FAILED
       */
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("Payment failed:", paymentIntent.id);
        return { message: "Payment failed" };
      }
      default:
        return { message: `Unhandled event: ${event.type}` };
    }
  } catch (error) {
    console.error("Webhook error:", error);
    throw new Error("Webhook processing failed");
  }
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      res.status(400).json({
        success: false,
        message: "Missing Stripe signature or webhook secret",
        data: null,
        meta: null
      });
    }
    let event;
    try {
      event = stripe_config_default.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Error constructing Stripe webhook event:", error);
      res.status(400).json({
        success: false,
        message: "Invalid Stripe webhook signature"
      });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(
        event
      );
      res.status(200).json({
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      res.status(500).json({
        success: false,
        message: "Error handling Stripe webhook event"
      });
    }
  } catch (error) {
    next(error);
  }
};
var PaymentController = {
  handleStripeWebhookEvent
};

// src/modules/analytics/analytics.route.ts
import express8 from "express";

// src/modules/analytics/analytics.service.ts
var getDashboardStatsData = async (user) => {
  switch (user.role) {
    case "ADMIN" /* ADMIN */:
      return getAdminStatsData();
    case "SELLER" /* SELLER */:
      return getSellerStatsData(user.id);
    case "CUSTOMER" /* CUSTOMER */:
      return getCustomerStatsData(user.id);
    default:
      throw new Error("Invalid user role");
  }
};
var getAdminStatsData = async () => {
  const orderCount = await prisma.orders.count();
  const medicineCount = await prisma.medicines.count();
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const totalRevenue = await prisma.orders.aggregate({
    _sum: { totalPrice: true },
    where: { paymentStatus: "PAID" }
  });
  const pieChartData = await getOrderStatusPieChart();
  const allOrders = await prisma.orders.findMany({
    select: { orderDate: true }
  });
  const barChartData = bucketByMonth(allOrders.map((o) => o.orderDate));
  return {
    orderCount,
    medicineCount,
    userCount,
    categoryCount,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    pieChartData,
    barChartData
  };
};
var getSellerStatsData = async (sellerId) => {
  const medicineCount = await prisma.medicines.count({
    where: { sellerId }
  });
  const sellerOrderFilter = {
    orderItems: {
      some: {
        medicines: { sellerId }
      }
    }
  };
  const orderCount = await prisma.orders.count({
    where: sellerOrderFilter
  });
  const paidItems = await prisma.orderItem.findMany({
    where: {
      medicines: { sellerId },
      order: { paymentStatus: "PAID" }
    },
    select: { price: true, quantity: true }
  });
  const totalRevenue = paidItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const pieChartData = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true },
    where: sellerOrderFilter
  });
  const sellerOrders = await prisma.orders.findMany({
    where: sellerOrderFilter,
    select: { orderDate: true }
  });
  const barChartData = bucketByMonth(sellerOrders.map((o) => o.orderDate));
  return {
    medicineCount,
    orderCount,
    totalRevenue,
    pieChartData: pieChartData.map(({ status, _count }) => ({
      status,
      count: _count.id
    })),
    barChartData
  };
};
var getCustomerStatsData = async (customerId) => {
  const orderCount = await prisma.orders.count({ where: { customerId } });
  const totalSpent = await prisma.orders.aggregate({
    _sum: { totalPrice: true },
    where: { customerId, paymentStatus: "PAID" }
  });
  const pieChartData = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { customerId }
  });
  return {
    orderCount,
    totalSpent: totalSpent._sum.totalPrice || 0,
    pieChartData: pieChartData.map(({ status, _count }) => ({
      status,
      count: _count.id
    }))
  };
};
var getOrderStatusPieChart = async () => {
  const distribution = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true }
  });
  return distribution.map(({ status, _count }) => ({
    status,
    count: _count.id
  }));
};
var bucketByMonth = (dates) => {
  const counts = /* @__PURE__ */ new Map();
  for (const date of dates) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month));
};
var StatsService = { getDashboardStatsData };

// src/modules/analytics/analytics.controller.ts
var getDashboardStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await StatsService.getDashboardStatsData(req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      details: error instanceof Error ? error.message : "Something went wrongs"
    });
  }
};
var analyticsController = { getDashboardStats };

// src/modules/analytics/analytics.route.ts
var router8 = express8.Router();
router8.get(
  "/dashboard",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */),
  analyticsController.getDashboardStats
);
var analyticsRouter = router8;

// src/app.ts
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.FRONTEND_URL,
  // Production frontend URL
  "http://localhost:4000",
  "http://localhost:5000"
].filter(Boolean);
var app = express9();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express9.json());
app.post(
  "/webhook",
  express9.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", UserRouter);
app.use("/admin/category", CategoryRouter);
app.use("/medicine", MedicinesRouter);
app.use("/review", ReviewRouter);
app.use("/cart", CartRouter);
app.use("/cartItem", CartItemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/analytics", analyticsRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
