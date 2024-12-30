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
const addCategory_1 = require("./produto/categoria/addCategory");
const findAllCategory_1 = require("./produto/categoria/findAllCategory");
const addSubCategory_1 = require("./produto/subcategoria/addSubCategory");
const api = process.env.TOKEN_API || "";
const bot = new telegraf_1.Telegraf(api);
let idCategoryReference = null;
let username = null;
let userId = null;
// Comando /start
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    userId = String((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id);
    username = String((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name);
    const addClient = new addClient_1.AddClient();
    const execute = yield addClient.execute({ userId, username });
    if (userId === process.env.ID_USER || userId === 1000026242) {
        yield ctx.reply(`Olá ${username} escolha uma ação. Escolha uma opção:`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Add Categoria', callback_data: 'add_categoria' },
                        { text: 'List Categoria', callback_data: 'list_categoria' },
                    ]
                ]
            }
        });
    }
    else {
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
      <b>└💸 Saldo Em Dobro: 25.00%</b>`;
        yield ctx.reply(messageWelcome, { parse_mode: 'HTML' });
        const imageUrl = 'https://imgur.com/a/DKxJgp6';
        yield ctx.replyWithPhoto(imageUrl, {});
        yield ctx.reply('Escolha uma opção:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📦 COMPRAR', callback_data: 'comprar' },
                        { text: '💸 ADD SALDO', callback_data: 'add_saldo' }
                    ]
                ]
            }
        });
    }
}));
// Ação - Adicionar categoria
bot.action('add_categoria', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.deleteMessage();
    yield ctx.answerCbQuery();
    const sentMessage = yield ctx.reply('Por favor, envie o nome da nova categoria.');
    bot.on('text', (textCtx) => __awaiter(void 0, void 0, void 0, function* () {
        const name = textCtx.message.text;
        try {
            const addCategory = new addCategory_1.AddCategory();
            const execute = yield addCategory.execute({ name });
            yield ctx.deleteMessage(sentMessage.message_id);
            yield textCtx.reply(`Categoria "${name}" adicionada com sucesso!`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Voltar', callback_data: 'voltar_inicial' }
                        ],
                    ],
                },
            });
        }
        catch (error) {
            console.error('Erro ao adicionar categoria:', error);
            yield textCtx.reply('Houve um erro ao adicionar a categoria. Tente novamente mais tarde.');
        }
    }));
}));
// Ação - Listar categoria
bot.action('list_categoria', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.deleteMessage();
    yield ctx.answerCbQuery();
    try {
        const findAllCategory = new findAllCategory_1.FindAllCategory();
        const executeCategory = yield findAllCategory.execute();
        const categoryButtons = executeCategory.find.map((category) => [
            {
                text: category.name,
                callback_data: `categoria_${category.id}`,
            },
        ]);
        const inlineKeyboard = [
            ...categoryButtons,
            [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ];
        yield ctx.reply('Escolha uma categoria:', {
            reply_markup: {
                inline_keyboard: inlineKeyboard,
            },
        });
    }
    catch (error) {
        console.error('Erro ao recuperar categorias:', error);
        yield ctx.reply('Houve um erro ao listar as categorias. Tente novamente mais tarde.');
    }
}));
// Ação - Adicionar subcategoria
bot.action(/add_subcategoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    idCategoryReference = ctx.match[1];
    yield ctx.deleteMessage();
    yield ctx.answerCbQuery();
    yield ctx.reply('Por favor, envie o nome da nova subcategoria.');
    bot.on('text', (textCtx) => __awaiter(void 0, void 0, void 0, function* () {
        const subCategoryName = textCtx.message.text;
        try {
            const addSubCategory = new addSubCategory_1.AddSubCategory();
            const execute = yield addSubCategory.execute({
                nameSubCategory: subCategoryName,
                idCategoryReference: Number(idCategoryReference),
            });
            yield textCtx.reply(`Subcategoria "${subCategoryName}" adicionada com sucesso!`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Voltar', callback_data: 'list_categoria' }
                        ],
                    ],
                },
            });
            idCategoryReference = null;
        }
        catch (error) {
            console.error('Erro ao adicionar subcategoria:', error);
            yield textCtx.reply('Houve um erro ao adicionar a subcategoria. Tente novamente mais tarde.');
        }
    }));
}));
// Ação - Listar subcategoria com base na categoria
bot.action(/categoria_(\d+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = ctx.match[1];
    yield ctx.deleteMessage();
    yield ctx.answerCbQuery();
    try {
        yield ctx.reply('Escolha uma ação:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Adicionar Subcategoria', callback_data: `add_subcategoria_${categoryId}` },
                        { text: 'Listar Subcategorias', callback_data: `list_subcategoria_${categoryId}` },
                        { text: 'Voltar', callback_data: `list_categoria` }
                    ],
                ],
            }
        });
    }
    catch (error) {
        console.error('Erro ao mostrar opções da categoria:', error);
        yield ctx.reply('Houve um erro ao mostrar as opções da categoria. Tente novamente mais tarde.');
    }
}));
// Ação - Voltar (limpar categoriaId da sessão)
bot.action('voltar_inicial', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    idCategoryReference = null;
    yield ctx.deleteMessage();
    yield ctx.answerCbQuery();
    yield ctx.reply(`Olá ${username} escolha uma ação. Escolha uma opção:`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Add Categoria', callback_data: 'add_categoria' },
                    { text: 'List Categoria', callback_data: 'list_categoria' },
                ]
            ]
        }
    });
}));
// Iniciar o bot
console.log('Bot rodando...');
bot.launch();
//# sourceMappingURL=index.js.map