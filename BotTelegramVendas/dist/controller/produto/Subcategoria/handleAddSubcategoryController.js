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
const addSubcategory_1 = require("../../../src/produto/subcategoria/addSubcategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleAddSubCategory = new BaseScene('addSubcategory');
handleAddSubCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield ctx.reply('Por favor, envie o nome da nova subcategoria:');
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ctx.deleteMessage(message.message_id);
        }
        catch (error) {
            console.error('Erro ao deletar a mensagem:', error);
        }
    }), 5000);
}));
handleAddSubCategory.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategoryReference = ctx.session.categoryId || 1;
    const nameSubCategory = ctx.message.text.trim();
    try {
        // Lógica para adicionar subcategoria
        const addSubCategory = new addSubcategory_1.AddSubCategory();
        const execute = yield addSubCategory.execute({
            nameSubCategory,
            idCategoryReference,
        });
        // Envia a resposta ao usuário
        const message = execute.sucess
            ? `Subcategoria "${nameSubCategory}" adicionada com sucesso!`
            : `Subcategoria já existe. Nome: ${execute.name}`;
        yield ctx.reply(message, {
            reply_markup: telegraf_1.Markup.inlineKeyboard([
                [
                    { text: 'Voltar', callback_data: 'voltar_inicial' }
                ]
            ]).reply_markup,
        });
        ctx.scene.leave();
        yield ctx.deleteMessage();
    }
    catch (error) {
        console.error('Erro ao adicionar subcategoria:', error);
        yield ctx.reply('Erro ao adicionar a subcategoria. Tente novamente.');
        ctx.scene.leave();
    }
}));
exports.default = handleAddSubCategory;
//# sourceMappingURL=handleAddSubcategoryController.js.map