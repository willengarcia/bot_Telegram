"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const api = process.env.TOKEN_API || "";
const bot = new telegraf_1.Telegraf(api);
