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
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleCategoryOptions = new BaseScene('categoryOptions');
handleCategoryOptions.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = ctx.session.userName;
    try {
        const idCategoryReference = ctx.session.categoryId;
        yield ctx.reply(`Olá ${userName !== null && userName !== void 0 ? userName : 'Usuário'}, escolha uma ação:`, {
            reply_markup: telegraf_1.Markup.inlineKeyboard([
                [
                    { text: 'Adicionar Subcategoria', callback_data: `add_subcategoria_${idCategoryReference}` },
                    { text: 'Listar Subcategorias', callback_data: `list_subcategoria_${idCategoryReference}` },
                    { text: 'Editar Categoria', callback_data: `edit_categoria_${idCategoryReference}` },
                    { text: 'Deletar Categoria', callback_data: `delete_category_${idCategoryReference}` }
                ],
            ]).reply_markup,
        });
        ctx.scene.leave();
        yield ctx.deleteMessage();
    }
    catch (error) {
        console.error('Erro ao listar opções:', error);
        yield ctx.reply('Erro ao listar as opções. Tente novamente.');
        ctx.scene.leave();
    }
}));
exports.default = handleCategoryOptions;
//# sourceMappingURL=handleCategoryOptionsController.js.map