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
const botConfig_1 = require("../config/botConfig");
const renderMenu_1 = require("../utils/renderMenu");
// =================== Ações do Bot ===================
// Adiciona Categoria
botConfig_1.bot.action('add_categoria', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.session.idSentMessage) {
        yield ctx.deleteMessage(ctx.session.idSentMessage);
    }
    ctx.scene.enter('addCategoria');
}));
// Lista a Categoria
botConfig_1.bot.action('list_categoria', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.enter('listCategoria');
}));
// Mostra as opções da Categoria
botConfig_1.bot.action(/categoria_options_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.match[1];
    if (!idCategoryReference) {
        console.error('ID da categoria não encontrado.');
        return;
    }
    ctx.session.categoryId = Number(idCategoryReference);
    ctx.scene.enter('categoryOptions');
}));
// Adiciona Subcategoria
botConfig_1.bot.action(/add_subcategoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.match[1];
    if (!idCategoryReference) {
        console.error('ID da categoria não encontrado.');
        return;
    }
    ctx.session.categoryId = Number(idCategoryReference);
    ctx.scene.enter('addSubcategory');
}));
// Lista Subcategoria
botConfig_1.bot.action(/list_subcategoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.match[1];
    if (!idCategoryReference) {
        console.error('ID da categoria não encontrado.');
        return;
    }
    ctx.session.categoryId = Number(idCategoryReference);
    ctx.scene.enter('listSubcategory');
}));
// Mostrar opções da Subcategoria
botConfig_1.bot.action(/option_subcategoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idSubCategoryReference = ctx.match[1];
    if (!idSubCategoryReference) {
        console.error('ID da subcategoria não encontrado.');
        return;
    }
    ctx.session.subcategoryId = Number(idSubCategoryReference);
    ctx.scene.enter('subcategoryOptions');
}));
// Editar Categoria
botConfig_1.bot.action(/edit_categoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.match[1];
    if (!idCategoryReference) {
        console.error('ID da categoria não encontrado.');
        return;
    }
    ctx.session.categoryId = Number(idCategoryReference);
    ctx.scene.enter('editCategory');
}));
// Editar Subcategoria
botConfig_1.bot.action(/edit_subcategoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idSubCategoryReference = ctx.match[1];
    if (!idSubCategoryReference) {
        console.error('ID da subcategoria não encontrada.');
        return;
    }
    ctx.session.subcategoryId = Number(idSubCategoryReference);
    ctx.scene.enter('editSubcategory');
}));
// Deletar Categoria
botConfig_1.bot.action(/delete_category_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.match[1];
    if (!idCategoryReference) {
        console.error('ID da categoria não encontrado.');
        return;
    }
    ctx.session.categoryId = Number(idCategoryReference);
    ctx.scene.enter('deleteCategory');
}));
// Deletar Subcategoria
botConfig_1.bot.action(/delete_subcategory_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idSubCategory = ctx.match[1];
    if (!idSubCategory) {
        console.error('ID da subcategoria não encontrado.');
        return;
    }
    ctx.session.subcategoryId = Number(idSubCategory);
    ctx.scene.enter('deleteSubcategory');
}));
// Voltar ao menu Inicial
botConfig_1.bot.action('voltar_inicial', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ctx.answerCbQuery();
        yield (0, renderMenu_1.renderInitialMenu)(ctx);
    }
    catch (error) {
        console.error('Erro ao voltar ao menu inicial:', error);
    }
}));
//# sourceMappingURL=actionsBot.js.map