import { Telegraf, Context } from 'telegraf';
import { AddClient } from './client/addClient';
import { AddCategory } from './produto/categoria/addCategory';
import { FindAllCategory } from './produto/categoria/findAllCategory';
import { AddSubCategory } from './produto/subcategoria/addSubCategory';
import { FindAllSubCategoryToCategory } from './produto/subcategoria/findAllSubCategoryToCategory';
import { text } from 'stream/consumers';
import { callback } from 'telegraf/typings/button';
import { EditCategory } from './produto/categoria/editCategory';
import { inlineKeyboard } from 'telegraf/typings/markup';
import { EditSubCategory } from './produto/subcategoria/editSubCategory';

const api = process.env.TOKEN_API || "";
const bot = new Telegraf(api);
let idCategoryReference = null;
let idSubCategory = null
let username = null;
let userId = null;

const renderInitialMenu = async (ctx) =>{
  await ctx.reply(`Olá ${username}, escolha uma ação:`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Add Categoria', callback_data: 'add_categoria' },
          { text: 'List Categoria', callback_data: 'list_categoria' },
        ],
      ],
    },
  });
};

const handleStartCommand = async (ctx) =>{
  userId = String(ctx.from?.id);
  username = String(ctx.from?.first_name);

  const addClient = new AddClient();
  const execute = await addClient.execute({ userId, username });

  if (userId === process.env.ID_USER || userId === '1000026242') {
    await renderInitialMenu(ctx);
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
    await ctx.replyWithPhoto(imageUrl);
    await ctx.reply('Escolha uma opção:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📦 COMPRAR', callback_data: 'comprar' },
            { text: '💸 ADD SALDO', callback_data: 'add_saldo' },
          ],
        ],
      },
    });
  }
};

const handleAddCategory = async (ctx) =>{
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  const sentMessage = await ctx.reply('Por favor, envie o nome da nova categoria.');

  const listener = bot.on('text', async (textCtx: Context) => {
    const name = (textCtx.message as any).text;

    try {
      const addCategory = new AddCategory();
      await addCategory.execute({ name });
      await textCtx.reply(`Categoria "${name}" adicionada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'voltar_inicial' },
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      await textCtx.reply('Houve um erro ao adicionar a categoria. Tente novamente mais tarde.');
    }
  });
};

const handleListCategory = async (ctx) =>{
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  try {
    const findAllCategory = new FindAllCategory();
    const executeCategory = await findAllCategory.execute();

    const categoryButtons = executeCategory.find.map((category) => [
      {
        text: category.name,
        callback_data: `categoria_options_${category.id}`,
      },
    ]);

    await ctx.reply('Escolha uma categoria:', {
      reply_markup: {
        inline_keyboard: [
          ...categoryButtons,
          [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ],
      },
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    await ctx.reply('Houve um erro ao listar as categorias. Tente novamente mais tarde.');
  }
};

const handleAddSubCategory = async (ctx) =>{
  console.log('cat: '+idCategoryReference)
  idCategoryReference = Number(ctx.match[1]);
  await ctx.deleteMessage();
  await ctx.answerCbQuery();
  const sentMessage = await ctx.reply('Por favor, envie o nome da nova subcategoria.');

  const listener = bot.on('text', async (textCtx: Context) => {
    const nameSubCategory = (textCtx.message as any).text;
    try {
      const addSubCategory = new AddSubCategory();
      const execute = await addSubCategory.execute({ nameSubCategory, idCategoryReference,
      });

      const message = execute.sucess
        ? `Subcategoria "${nameSubCategory}" adicionada com sucesso!`
        : `Subcategoria já existe. Nome: ${execute.name}`;

      await textCtx.reply(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'list_categoria' },
            ],
          ],
        },
      });
      console.log(idCategoryReference)
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      await textCtx.reply('Houve um erro ao adicionar a subcategoria. Tente novamente mais tarde.');
    } 
  });
};

const handleListSubCategory = async (ctx) =>{
  idCategoryReference = Number(ctx.match[1]);
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  try {
    const findAllSubCategory = new FindAllSubCategoryToCategory();
    const executeSubCategory = await findAllSubCategory.execute({ idCategoryReference });

    const subCategoryButtons = executeSubCategory.find.map((subCategory) => [
      {
        text: subCategory.name,
        callback_data: `subcategoria_options_${subCategory.id}`,
      },
    ]);

    await ctx.reply('Escolha uma subcategoria:', {
      reply_markup: {
        inline_keyboard: [
          ...subCategoryButtons,
          [{ text: 'Voltar', callback_data: 'list_categoria' }],
        ],
      },
    });
  } catch (error) {
    console.error('Erro ao listar subcategorias:', error);
    await ctx.reply('Houve um erro ao listar as subcategorias. Tente novamente mais tarde.');
  }
};

const handleCategoryOptions = async (ctx) =>{
  idCategoryReference = ctx.match[1];
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  await ctx.reply('Escolha uma ação:', {
    reply_markup: {
      inline_keyboard: [
          [{ text: 'Adicionar Subcategoria', callback_data: `add_subcategoria_${idCategoryReference}` }],
          [{ text: 'Listar Subcategorias', callback_data: `list_subcategoria_${idCategoryReference}` }],
          [{text: 'Editar Categoria', callback_data: `edit_categoria_${idCategoryReference}`}],
          [{ text: 'Voltar', callback_data: 'list_categoria' }],
      ],
    },
  });
  console.log(idCategoryReference)
};

const handleSubCategoryOptions = async (ctx) =>{
  idSubCategory = ctx.match[1];
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  await ctx.reply('Escolha uma ação:', {
    reply_markup: {
      inline_keyboard: [
          [{ text: 'Adicionar Produto', callback_data: `add_produto_${idSubCategory}` }],
          [{ text: 'Listar Produtos', callback_data: `list_produto_${idSubCategory}` }],
          [{text: 'Editar Subcategoria', callback_data: `edit_subcategoria_${idSubCategory}`}],
          [{ text: 'Voltar', callback_data: 'list_categoria' }],
      ],
    },
  });
  console.log(idSubCategory)
};

const handleEditCategory =  async (ctx) =>{
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  const sentMessage = await ctx.reply(`Por favor, envie o novo nome para a categoria que selecionou:`);

  const listener = bot.on('text', async (textCtx: Context) => {
    const newName = (textCtx.message as any).text;

    try {
      const editCategory = new EditCategory();
      await editCategory.execute({idCategoryReference, newName});
      await ctx.deleteMessage(sentMessage.message_id);
      await textCtx.reply(`Categoria editada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'voltar_inicial' },
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      await textCtx.reply('Houve um erro ao adicionar a categoria. Tente novamente mais tarde.');
    }
  });
}

const handleEditSubCategory = async (ctx) => {
  idSubCategory = Number(ctx.match[1]);
  console.log('Cat selecionada: '+idSubCategory)
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  const sentMessage = await ctx.reply(
    'Por favor, envie o novo nome para a subcategoria selecionada.'
  );

  const listener = bot.on('text', async (textCtx: Context) => {
    const nameSubCategory = (textCtx.message as any).text;

    // Verifica se o nome fornecido é válido
    if (!nameSubCategory || nameSubCategory.trim().length === 0) {
      await textCtx.reply('O nome não pode estar vazio. Tente novamente.');
      return;
    }

    try {
      // Chama a lógica para editar a subcategoria
      const editSubCategory = new EditSubCategory(); // Substitua com o método apropriado
      await editSubCategory.execute({ idSubCategory, nameSubCategory });

      // Confirma ao usuário que a edição foi concluída
      await textCtx.reply(`Subcategoria "${nameSubCategory}" editada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
          ],
        },
      });
      console.log('Cat alterada: '+idSubCategory)
    } catch (error) {
      console.error('Erro ao editar a subcategoria:', error);

      // Informa ao usuário sobre o erro
      await textCtx.reply(
        'Houve um erro ao editar a subcategoria. Tente novamente mais tarde.'
      );
    }
  });
};

const handleBackToInitialMenu = async (ctx) => {
  idCategoryReference = null;
  idSubCategory = null
  await ctx.deleteMessage();
  await renderInitialMenu(ctx);
};

// ========================= Ações =====================
// Inicia o Bot
bot.start(handleStartCommand);
// Adiciona Categoria
bot.action('add_categoria', handleAddCategory);
// Lista as Categorias
bot.action('list_categoria', handleListCategory);
// Adiciona a Subcategoria
bot.action(/add_subcategoria_(\d+)/, handleAddSubCategory);
// Lista a Subcategoria
bot.action(/list_subcategoria_(\d+)/, handleListSubCategory);

// Edita a Categoria selecionada
bot.action(/edit_categoria_(\d+)/, handleEditCategory)
// Edita a Subcategoria selecionada
bot.action(/edit_subcategoria_(\d+)/, handleEditSubCategory)

// ================ middallware ===============

// Lista as opçoes da Subcategoria clicada
bot.action(/subcategoria_options_(\d+)/, handleSubCategoryOptions);
// Lista as opçoes da categoria
bot.action(/categoria_options_(\d+)/, handleCategoryOptions);
bot.action('voltar_inicial', handleBackToInitialMenu);
bot.launch();