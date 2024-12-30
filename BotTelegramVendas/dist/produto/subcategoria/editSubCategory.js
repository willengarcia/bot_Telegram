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
exports.EditSubCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EditSubCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nameSubCategory, idSubCategory }) {
            try {
                // categoria existe
                const existSubCategory = yield prisma.subCategory.findFirst({
                    where: {
                        name: nameSubCategory,
                    }
                });
                // Possível erro de lógica.
                if (existSubCategory) {
                    console.log('Categoria já existe');
                    return {
                        sucess: false,
                        idCategory: existSubCategory.id,
                        name: existSubCategory.name
                    };
                }
                // Editar Categoria
                const editCategory = yield prisma.subCategory.update({
                    where: {
                        id: idSubCategory,
                    },
                    data: {
                        name: nameSubCategory
                    }
                });
                return {
                    sucess: true,
                    nameCategory: editCategory.name,
                    idCategory: editCategory.id
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao editar SubCategoria:", error);
                return {
                    'sucess': false,
                    'error': error.message
                };
            }
        });
    }
}
exports.EditSubCategory = EditSubCategory;
//# sourceMappingURL=editSubCategory.js.map