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
exports.renderInitialMenu = void 0;
const telegraf_1 = require("telegraf");
const renderInitialMenu = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = ctx.session.userName;
    const message = yield ctx.reply(`Olá ${userName !== null && userName !== void 0 ? userName : 'Usuário'}, escolha uma ação:`, {
        reply_markup: telegraf_1.Markup.inlineKeyboard([
            [
                { text: 'Add Categoria', callback_data: 'add_categoria' },
                { text: 'List Categoria', callback_data: 'list_categoria' },
            ],
        ]).reply_markup,
    });
    ctx.session.idSentMessage = message.message_id;
    ctx.scene.leave();
    yield ctx.deleteMessage();
});
exports.renderInitialMenu = renderInitialMenu;
//# sourceMappingURL=renderMenu.js.map