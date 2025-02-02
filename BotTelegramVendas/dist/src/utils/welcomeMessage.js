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
exports.welcomeMessage = void 0;
const telegraf_1 = require("telegraf");
const renderMenu_1 = require("./renderMenu");
const welcomeMessage = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = String((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id);
    const username = String((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name);
    ctx.session.userName = username;
    ctx.session.idUser = userId;
    if (userId === process.env.ID_USER || userId === '1000026242') {
        yield (0, renderMenu_1.renderInitialMenu)(ctx);
    }
    else {
        const welcomeMsg = `
      <b>Olá, ${username}! Seja bem-vindo(a)!</b>
      <b>Você está no Sua Loja Aqui Bot</b>
      <b>Garantimos Acesso em Todos os Logins ✅</b>`;
        yield ctx.reply(welcomeMsg, { parse_mode: 'HTML' });
        yield ctx.replyWithPhoto('https://imgur.com/a/DKxJgp6');
        yield ctx.reply('Escolha uma opção:', {
            reply_markup: telegraf_1.Markup.inlineKeyboard([
                [
                    { text: '📦 COMPRAR', callback_data: 'comprar' },
                    { text: '💸 ADD SALDO', callback_data: 'add_saldo' },
                ],
            ]).reply_markup,
        });
    }
});
exports.welcomeMessage = welcomeMessage;
//# sourceMappingURL=welcomeMessage.js.map