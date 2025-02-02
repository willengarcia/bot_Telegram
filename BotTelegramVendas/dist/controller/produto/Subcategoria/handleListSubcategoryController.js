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
const findAllSubCategoryToCategory_1 = require("../../../src/produto/subcategoria/findAllSubCategoryToCategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleListSubCategory = new BaseScene('listSubcategory');
handleListSubCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idCategoryReference = ctx.session.categoryId || 1;
        const findAllSubToCategory = new findAllSubCategoryToCategory_1.FindAllSubCategoryToCategory();
        const executeCategory = yield findAllSubToCategory.execute({ idCategoryReference });
        if (!executeCategory.find || executeCategory.find.length === 0) {
            yield ctx.reply('Nenhuma categoria encontrada no momento.', {
                reply_markup: telegraf_1.Markup.inlineKeyboard([
                    [
                        { text: 'Voltar', callback_data: 'voltar_inicial' }
                    ]
                ]).reply_markup,
            });
            ctx.scene.leave();
            return;
        }
        // Gera os botões das categorias
        const categoryButtons = executeCategory.find.map((category) => [
            {
                text: category.name,
                callback_data: `option_subcategoria_${category.id}`,
            },
        ]);
        // Adiciona botão de voltar
        categoryButtons.push([{ text: 'Voltar', callback_data: 'voltar_inicial' }]);
        yield ctx.reply('Selecione uma Subcategoria', {
            reply_markup: telegraf_1.Markup.inlineKeyboard([...categoryButtons]).reply_markup,
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
exports.default = handleListSubCategory;
//# sourceMappingURL=handleListSubcategoryController.js.map