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
exports.DeleteSubCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeleteSubCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idSubCategory, }) {
            try {
                // há produtos na subcategoria?
                const existItems = yield prisma.subCategory.findFirst({
                    where: {
                        id: idSubCategory,
                        items: {
                            some: {}
                        }
                    }
                });
                if (existItems) {
                    console.log('Há produtos nessa Subcategoria');
                    return {
                        sucess: false,
                        message: 'Há produtos nessa subcategoria!'
                    };
                }
                // deleta subcategoria
                const deleteSubCategory = yield prisma.category.delete({
                    where: {
                        id: idSubCategory
                    }
                });
                return {
                    sucess: true,
                    isDelete: true,
                    message: 'Subcategoria deletada com sucesso!'
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao deletar SubCategoria:", error);
                return {
                    'sucess': false,
                    'error': error.message
                };
            }
        });
    }
}
exports.DeleteSubCategory = DeleteSubCategory;
//# sourceMappingURL=deleteSubCategory.js.map