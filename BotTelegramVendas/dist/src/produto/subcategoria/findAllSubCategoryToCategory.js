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
exports.FindAllSubCategoryToCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FindAllSubCategoryToCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idCategoryReference }) {
            try {
                const existSubCategory = yield prisma.subCategory.findFirst();
                if (!existSubCategory) {
                    console.log('Não há nenhuma subcategoria cadastrada');
                    return {
                        success: false,
                        message: 'Não há nenhuma subcategoria para listar!'
                    };
                }
                // Pesquisa todas as Subcategorias
                const findAllSubCategory = yield prisma.subCategory.findMany({
                    where: {
                        categoryId: idCategoryReference
                    },
                    select: {
                        id: true,
                        name: true,
                        items: true,
                    }
                });
                return {
                    sucess: true,
                    find: findAllSubCategory
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao pesquisar subcategorias:", error);
                return {
                    'sucess': false,
                    'error': error.message
                };
            }
        });
    }
}
exports.FindAllSubCategoryToCategory = FindAllSubCategoryToCategory;
//# sourceMappingURL=findAllSubCategoryToCategory.js.map