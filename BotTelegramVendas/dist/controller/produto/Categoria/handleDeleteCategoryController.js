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
const deleteCategory_1 = require("../../../src/produto/categoria/deleteCategory");
const { BaseScene, Stage } = telegraf_1.Scenes;
const handleDeleteCategory = new BaseScene('deleteCategory');
handleDeleteCategory.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idCategoryReference = ctx.session.categoryId || 1;
        const deleteCategory = new deleteCategory_1.DeleteCategory();
        const execute = yield deleteCategory.execute({ idCategory: idCategoryReference });
        if (execute.sucess === false) {
            yield ctx.reply(`${execute.message}`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Voltar', callback_data: 'voltar_inicial' },
                        ],
                    ],
                },
            });
            return;
        }
        else {
            yield ctx.reply(`${execute.message}`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Voltar', callback_data: 'voltar_inicial' },
                        ],
                    ],
                },
            });
        }
    }
    catch (error) {
        yield ctx.reply('Houve um erro ao editar a subcategoria. Tente novamente mais tarde. ' + error, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Voltar', callback_data: 'voltar_inicial' },
                    ],
                ],
            },
        });
    }
}));
exports.default = handleDeleteCategory;
//# sourceMappingURL=handleDeleteCategoryController.js.map