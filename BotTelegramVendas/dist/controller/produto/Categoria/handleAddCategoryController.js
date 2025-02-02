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
const addCategory_1 = require("../../../src/produto/categoria/addCategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
// Define a cena para adicionar categoria
const handleAddCategory = new BaseScene('addCategoria');
handleAddCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield ctx.reply('Por favor, envie o nome da nova categoria:');
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ctx.deleteMessage(message.message_id);
        }
        catch (error) {
            console.error('Erro ao deletar a mensagem:', error);
        }
    }), 5000);
}));
handleAddCategory.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const name = ctx.message.text.trim();
    try {
        const addCategory = new addCategory_1.AddCategory();
        yield addCategory.execute({ name });
        yield ctx.reply(`Categoria "${name}" adicionada com sucesso!`, {
            reply_markup: telegraf_1.Markup.inlineKeyboard([
                [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
            ]).reply_markup,
        });
        ctx.scene.leave();
    }
    catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        yield ctx.reply('Erro ao adicionar a categoria. Tente novamente.');
        ctx.scene.leave();
    }
}));
exports.default = handleAddCategory;
//# sourceMappingURL=handleAddCategoryController.js.map