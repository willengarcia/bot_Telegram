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
exports.AddSubCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AddSubCategory {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nameSubCategory, idCategoryReference }) {
            try {
                // Subcategoria existe
                const existSubCategory = yield prisma.subCategory.findFirst({
                    where: {
                        name: nameSubCategory,
                    }
                });
                if (existSubCategory) {
                    console.log('SubCategoria já existe');
                    return {
                        sucess: false,
                        idSubCategory: existSubCategory.id,
                        name: existSubCategory.name,
                    };
                }
                // Cria uma nova categoria
                const createSubCategory = yield prisma.subCategory.create({
                    data: {
                        name: nameSubCategory,
                        categoryId: idCategoryReference,
                    }, select: {
                        name: true,
                        id: true
                    }
                });
                return {
                    sucess: true,
                    nameCategory: createSubCategory.name,
                    idCategory: createSubCategory.id
                };
            }
            catch (error) {
                // Tratamento de erro
                console.error("Erro ao criar cliente:", error);
                return {
                    sucess: false,
                    error: error.message
                };
            }
        });
    }
}
exports.AddSubCategory = AddSubCategory;
//# sourceMappingURL=addSubcategory.js.map