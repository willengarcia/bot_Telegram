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
const findAllCategory_1 = require("../../../src/produto/categoria/findAllCategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleListCategory = new BaseScene('listCategoria');
handleListCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findAllCategory = new findAllCategory_1.FindAllCategory();
        const executeCategory = yield findAllCategory.execute();
        if (!executeCategory.find || executeCategory.find.length === 0) {
            yield ctx.reply('Nenhuma categoria encontrada no momento.', {
                reply_markup: telegraf_1.Markup.inlineKeyboard([
                    [
                        { text: 'Voltar', callback_data: 'voltar_inicial' }
                    ]
                ]).reply_markup,
            });
            ctx.scene.leave();
            yield ctx.deleteMessage();
            return;
        }
        // Gera os botões das categorias
        const categoryButtons = executeCategory.find.map((category) => [
            {
                text: category.name,
                callback_data: `categoria_options_${category.id}`,
            },
        ]);
        // Adiciona botão de voltar
        categoryButtons.push([{ text: 'Voltar', callback_data: 'voltar_inicial' }]);
        yield ctx.reply('Selecione uma Categoria', {
            reply_markup: telegraf_1.Markup.inlineKeyboard(categoryButtons).reply_markup,
        });
        ctx.scene.leave();
        yield ctx.deleteMessage();
    }
    catch (error) {
        console.error('Erro ao adicionar Listar a Categoria:', error);
        yield ctx.reply('Erro ao Listar a categoria. Tente novamente.');
        ctx.scene.leave();
    }
}));
exports.default = handleListCategory;
//# sourceMappingURL=handleListCategoryController.js.map