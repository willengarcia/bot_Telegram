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
const telegraf_1 = require("telegraf");
const editCategory_1 = require("../../../src/produto/categoria/editCategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleEditCategory = new BaseScene('editCategory');
handleEditCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Digite o novo nome para categoria que selecionou!');
}));
handleEditCategory.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const newName = ctx.message.text;
    const idCategoryReference = ctx.session.categoryId || 1;
    if (!newName || newName.trim().length === 0) {
        yield ctx.reply('O nome da categoria não pode ser vazio. Tente novamente.');
        return;
    }
    try {
        const editCategory = new editCategory_1.EditCategory();
        yield editCategory.execute({ idCategoryReference, newName });
        yield ctx.reply(`Categoria editada com sucesso!`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Voltar', callback_data: 'voltar_inicial' },
                    ],
                ],
            },
        });
    }
    catch (error) {
        console.error('Erro ao editar categoria:', error);
        yield ctx.reply('Houve um erro ao editar a categoria. Tente novamente mais tarde.');
    }
}));
exports.default = handleEditCategory;
//# sourceMappingURL=handleEditCategoryController.js.map