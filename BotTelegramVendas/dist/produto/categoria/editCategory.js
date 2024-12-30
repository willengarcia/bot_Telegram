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
exports.EditCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EditCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nameCategory, idCategory }) {
            try {
                // categoria existe
                const existCategory = yield prisma.category.findFirst({
                    where: {
                        name: nameCategory,
                    }
                });
                // Possível erro de lógica.
                if (existCategory) {
                    console.log('Categoria já existe');
                    return {
                        idCategory: existCategory.id,
                        name: existCategory.name
                    };
                }
                // Editar Categoria
                const editCategory = yield prisma.category.update({
                    where: {
                        id: idCategory,
                    },
                    data: {
                        name: nameCategory
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
                console.error("Erro ao editar Categoria:", error);
                return {
                    'sucess': false,
                    'error': error
                };
            }
        });
    }
}
exports.EditCategory = EditCategory;
//# sourceMappingURL=editCategory.js.map