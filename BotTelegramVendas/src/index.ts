import { Telegraf, Context } from 'telegraf';
import { AddClient } from './client/addClient';
import { AddCategory } from './produto/categoria/addCategory';
import { FindAllCategory } from './produto/categoria/findAllCategory';
import { AddSubCategory } from './produto/subcategoria/addSubCategory';

const api = process.env.TOKEN_API || "";
const bot = new Telegraf(api);
let idCategoryReference = null
let username = null
let userId = null

// Comando /start
bot.start(async (ctx: Context) => {
  userId = String(ctx.from?.id);
  username = String(ctx.from?.first_name);

  const addClient = new AddClient();
  const execute = await addClient.execute({ userId, username });
  if (userId === process.env.ID_USER || userId === 1000026242){
    await ctx.reply(`Olá ${username} escolha uma ação. Escolha uma opção:`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Add Categoria', callback_data: 'add_categoria' },
            { text: 'List Categoria', callback_data: 'list_categoria' },
          ]
        ]
      }
    });
  } else {
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
      <b>├💸 Saldo: R$${execute?.saldo}</b>
      <b>├💎 Pontos: R$${execute?.bonus}</b>
      <b>└💸 Saldo Em Dobro: 25.00%</b>`;

    await ctx.reply(messageWelcome, { parse_mode: 'HTML' });

    const imageUrl = 'https://imgur.com/a/DKxJgp6';
    await ctx.replyWithPhoto(imageUrl, {});
    await ctx.reply('Escolha uma opção:', {
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
});

// Ação - Adicionar categoria
bot.action('add_categoria', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  const sentMessage = await ctx.reply('Por favor, envie o nome da nova categoria.');
  bot.on('text', async (textCtx: Context) => {
    const name = (textCtx.message as any).text;

    try {
      const addCategory = new AddCategory();
      const execute = await addCategory.execute({ name });
      await ctx.deleteMessage(sentMessage.message_id);
      await textCtx.reply(`Categoria "${name}" adicionada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'voltar_inicial' }
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      await textCtx.reply('Houve um erro ao adicionar a categoria. Tente novamente mais tarde.');
    }
  });
});

// Ação - Listar categoria
bot.action('list_categoria', async (ctx) => {
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  try {
    const findAllCategory = new FindAllCategory();
    const executeCategory = await findAllCategory.execute();

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
    await ctx.reply('Escolha uma categoria:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (error) {
    console.error('Erro ao recuperar categorias:', error);
    await ctx.reply('Houve um erro ao listar as categorias. Tente novamente mais tarde.');
  }
});

// Ação - Adicionar subcategoria
bot.action(/add_subcategoria_(\d+)/, async (ctx) => {
  idCategoryReference = ctx.match[1];
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  await ctx.reply('Por favor, envie o nome da nova subcategoria.');
  bot.on('text', async (textCtx: Context) => {
    const subCategoryName = (textCtx.message as any).text;


    try {
      const addSubCategory = new AddSubCategory();
      const execute = await addSubCategory.execute({
        nameSubCategory: subCategoryName,
        idCategoryReference: Number(idCategoryReference),
      });
      await textCtx.reply(`Subcategoria "${subCategoryName}" adicionada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'list_categoria' }
            ],
          ],
        },
      });
      idCategoryReference = null
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      await textCtx.reply('Houve um erro ao adicionar a subcategoria. Tente novamente mais tarde.');
    }
  });
});

// Ação - Listar subcategoria com base na categoria
bot.action(/categoria_(\d+)/, async (ctx) => {
  const categoryId = ctx.match[1];
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  try {
    await ctx.reply('Escolha uma ação:', {
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
  } catch (error) {
    console.error('Erro ao mostrar opções da categoria:', error);
    await ctx.reply('Houve um erro ao mostrar as opções da categoria. Tente novamente mais tarde.');
  }
});

// Ação - Voltar (limpar categoriaId da sessão)
bot.action('voltar_inicial', async (ctx) => {
  idCategoryReference = null;
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  await ctx.reply(`Olá ${username} escolha uma ação. Escolha uma opção:`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Add Categoria', callback_data: 'add_categoria' },
          { text: 'List Categoria', callback_data: 'list_categoria' },
        ]
      ]
    }
  });
});

// Iniciar o bot
console.log('Bot rodando...');
bot.launch();
