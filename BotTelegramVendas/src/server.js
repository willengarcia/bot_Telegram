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
const addClient_1 = require("./client/addClient");
const api = process.env.TOKEN_API || "";
const bot = new telegraf_1.Telegraf(api);
// Comando /start
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Envia a mensagem de "Oi" assim que o bot for iniciado
    const userId = String((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id);
    const username = String((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name);
    const addClient = new addClient_1.AddClient();
    const execute = yield addClient.execute({ userId, username });
    if (userId === process.env.ID_USER) {
        const messageAdmin = `Olá ${username} escolha uma ação`;
        console.log(messageAdmin);
        // Falta criar a classe admin, e chamar as funções referente a esse nível hierarquico.
    }
    // caixa de botões e mensagem de boas-vindas
    const messageWelcome = `
    <b>Olá, ${username} seja bem-vindo</b>
    <b>Você está no sua loja aqui Bot</b>
    <b>Garantimos Acesso em Todos os Logins ✅</b>
    <b>Logins De Alta Qualidade Para Aprovação ✅</b>
    <b>Garantia de Pedidos No Login ou Reembolso do Login ✅</b>
    <b>Canal: @njfnsjdnf</b>
    <b>Suporte: @seulink</b>
    <b>🧾 Seu perfil:</b>
    <b>├👤 ID:</b> <code>${userId}</code>
    <b>├💸 Saldo: R$${execute === null || execute === void 0 ? void 0 : execute.saldo}</b>
    <b>├💎 Pontos: R$${execute === null || execute === void 0 ? void 0 : execute.bonus}</b>
    <b>└💸 Saldo Em Dobro: 25.00%</b>
  `;
    // mensagem com formatação HTML
    yield ctx.reply(messageWelcome, { parse_mode: 'HTML' });
    const imageUrl = 'https://imgur.com/a/DKxJgp6'; // Coloque a URL da sua imagem aqui
    yield ctx.replyWithPhoto(imageUrl, {});
    // botões pra o usuário interagir
    yield ctx.reply('Escolha uma opção:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📦 COMPRAR', callback_data: 'comprar' },
                    { text: '💸 ADD SALDO', callback_data: 'add saldo' }
                ]
            ]
        }
    });
}));
// Ações -  implementar banco de dados aqui.
bot.action('comprar', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Escolha uma opção de serviço:', {
        reply_markup: {
            inline_keyboard: [
                // Fazer um map da categoria e exibir os resultados
                [
                    { text: 'Streaming', callback_data: 'streaming' },
                    { text: 'IPTV', callback_data: 'iptv' },
                    { text: 'Games', callback_data: 'games' }
                ]
            ]
        }
    });
}));
bot.action('streaming', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Nossos Serviços de Streaming incluem: ', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Deezer', callback_data: 'deezer' },
                    { text: 'Spotify', callback_data: 'spotify' }
                ]
            ]
        }
    });
}));
// Iniciar o bot
console.log('Bot rodando...');
bot.launch();
