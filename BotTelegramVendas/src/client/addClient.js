"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddClient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AddClient {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, userId }) {
            try {
                // cliente já existe?
                const existClient = yield prisma.user.findFirst({
                    where: {
                        userId: userId,
                    }
                });
                if (existClient) {
                    console.log('Cliente já existe');
                    return {
                        userId: existClient.userId,
                        username: existClient.username,
                        saldo: existClient.balance,
                        bonus: existClient.balanceDiamonds
                    };
                }
                // Cria um novo cliente
                const createClient = yield prisma.user.create({
                    data: {
                        email: '',
                        userId: userId,
                        username: username,
                    }, select: {
                        userId: true,
                        username: true,
                        balance: true,
                        balanceDiamonds: true
                    }
                });
                return {
                    userId: createClient.userId,
                    username: createClient.username,
                    saldo: createClient.balance,
                    bonus: createClient.balanceDiamonds
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao criar cliente:", error);
            }
        });
    }
}
exports.AddClient = AddClient;
