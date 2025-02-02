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
exports.FindAllCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FindAllCategory {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existCategory = yield prisma.category.findFirst();
                if (!existCategory) {
                    console.log('Não há nenhuma categoria cadastrada');
                    return {
                        success: false,
                        message: 'Não há nenhuma categoria para listar!'
                    };
                }
                // Pesquisa todas as categorias
                const findAllCategory = yield prisma.category.findMany({
                    select: {
                        id: true,
                        name: true,
                        items: true,
                    }
                });
                return {
                    sucess: true,
                    find: findAllCategory
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao pesquisar categorias:", error);
                return {
                    'sucess': false,
                    'error': error.messsage
                };
            }
        });
    }
}
exports.FindAllCategory = FindAllCategory;
//# sourceMappingURL=findAllCategory.js.map