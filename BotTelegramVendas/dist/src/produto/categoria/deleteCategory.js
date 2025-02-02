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
exports.DeleteCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeleteCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idCategory }) {
            try {
                // categoria existe
                const existCategory = yield prisma.category.findFirst({
                    where: {
                        id: idCategory,
                    }
                });
                if (!existCategory) {
                    console.log('Categoria não existe');
                    return {
                        categoryExist: false
                    };
                }
                // há produtos na categoria?
                const existItems = yield prisma.category.findFirst({
                    where: {
                        id: idCategory,
                        items: {
                            some: {}
                        },
                        subCategories: {
                            some: {}
                        }
                    }
                });
                if (!existItems) {
                    console.log('Há produtos nessa Categoria');
                    return {
                        sucess: false,
                        message: 'Há produtos nessa categoria!'
                    };
                }
                const deleteCategory = yield prisma.category.delete({
                    where: {
                        id: idCategory
                    }
                });
                return {
                    sucess: true,
                    isDelete: true,
                    message: 'Categoria deletada com sucesso!'
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao deletar categoria:", error);
                return {
                    'sucess': false,
                    'error': error
                };
            }
        });
    }
}
exports.DeleteCategory = DeleteCategory;
//# sourceMappingURL=deleteCategory.js.map