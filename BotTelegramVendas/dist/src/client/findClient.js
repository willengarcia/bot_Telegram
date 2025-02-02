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
exports.FindClient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FindClient {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            try {
                // cliente existe?
                const existClient = yield prisma.user.findFirst({
                    where: {
                        userId: userId,
                    }
                });
                if (!existClient) {
                    console.log("Cliente não existe");
                    return { alert: 'Cliente não existe!' };
                }
                // Pesquisa dados do client
                const pesquisaClient = yield prisma.user.findMany({
                    where: {
                        userId: userId
                    },
                    select: {
                        userId: true,
                        username: true,
                        balance: true,
                        balanceDiamonds: true,
                        lastBought: true,
                        isActionPending: true,
                        isBlacklisted: true,
                        sales: true,
                        purchasedItems: true
                    }
                });
                return pesquisaClient;
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao pesquisar cliente:", error);
            }
        });
    }
}
exports.FindClient = FindClient;
//# sourceMappingURL=findClient.js.map