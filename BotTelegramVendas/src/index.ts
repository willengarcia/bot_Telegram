import { Telegraf, Scenes, session, Markup, Context, Middleware } from 'telegraf';
import { AddClient } from './client/addClient';
import { AddCategory } from './produto/categoria/addCategory';
import { FindAllCategory } from './produto/categoria/findAllCategory';
import { AddSubCategory } from './produto/subcategoria/addSubCategory';
import { FindAllSubCategoryToCategory } from './produto/subcategoria/findAllSubCategoryToCategory';
import { EditCategory } from './produto/categoria/editCategory';
import { EditSubCategory } from './produto/subcategoria/editSubCategory';
import { stringify, StringifyOptions } from 'querystring';
import { waitForDebugger } from 'inspector';

const api = process.env.TOKEN_API || "";
// Defina o tipo correto para a sessão
interface MySessionData {
  categoryId?: number;
  subcategoryId?:number;
  userName?: string;
  idUser?:string;
  idSentMessage?:number;
}

// Ajuste a interface MyContext para herdar do SceneContext corretamente
interface MyContext extends Scenes.SceneContext {
  session: MySessionData & Scenes.SceneSession;
  match?:RegExpMatchArray
}
const bot = new Telegraf<MyContext>(api);

// Definindo o Stage
const { BaseScene, Stage } = Scenes;

// Criação do Stage e registro das cenas
const stage = new Stage<MyContext>(); // Criação do Stage tipado

// Use o middleware do Stage
bot.use(session());
bot.use(stage.middleware());
// ====================== Utilitários ==========================
const renderInitialMenu = async (ctx: MyContext) => {
  const userName = ctx.session.userName
  const message = await ctx.reply(`Olá ${userName ?? 'Usuário'}, escolha uma ação:`, {
    reply_markup: Markup.inlineKeyboard([
      [
        { text: 'Add Categoria', callback_data: 'add_categoria' },
        { text: 'List Categoria', callback_data: 'list_categoria' },
      ],
    ]).reply_markup,
  });
  ctx.session.idSentMessage = message.message_id
  ctx.scene.leave()
  await ctx.deleteMessage()
};

const welcomeMessage = async (ctx: MyContext) => {
  const userId = String(ctx.from?.id);
  const username = String(ctx.from?.first_name);
  ctx.session.userName = username
  ctx.session.idUser = userId

  const addClient = new AddClient();
  const clientData = await addClient.execute({ userId, username });

  if (userId === process.env.ID_USER || userId === '1000026242') {
    await renderInitialMenu(ctx);
  } else {
    const welcomeMessage = `
    <b>Olá, ${username}! Seja bem-vindo(a)!</b>
    <b>Você está no Sua Loja Aqui Bot</b>
    <b>Garantimos Acesso em Todos os Logins ✅</b>`;

    await ctx.reply(welcomeMessage, { parse_mode: 'HTML' });
    await ctx.replyWithPhoto('https://imgur.com/a/DKxJgp6');
    await ctx.reply('Escolha uma opção:', {
      reply_markup: Markup.inlineKeyboard([
        [
          { text: '📦 COMPRAR', callback_data: 'comprar' },
          { text: '💸 ADD SALDO', callback_data: 'add_saldo' },
        ],
      ]).reply_markup,
    });
  }
};

// ====================== Cenas ==========================
const handleAddCategory = new BaseScene<MyContext>('addCategoria');
handleAddCategory.enter(async (ctx) => {
  const message = await ctx.reply('Por favor, envie o nome da nova categoria:');
  // Apaga a mensagem após 5 segundos
  setTimeout(async () => {
    try {
      await ctx.deleteMessage(message.message_id);
    } catch (error) {
      console.error('Erro ao deletar a mensagem:', error);
    }
  }, 5000);
});
handleAddCategory.on('text', async (ctx) => {
  const name = ctx.message.text.trim();
  try {
    const addCategory = new AddCategory();
    await addCategory.execute({ name });
    await ctx.reply(`Categoria "${name}" adicionada com sucesso!`, {
      reply_markup: Markup.inlineKeyboard([
        [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
      ]).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    await ctx.reply('Erro ao adicionar a categoria. Tente novamente.');
    ctx.scene.leave(); // Sempre saia da cena para evitar loops
  }
});

const handleListCategory = new BaseScene<MyContext>('listCategoria');
handleListCategory.enter(async (ctx) =>{
  try {
    const findAllCategory = new FindAllCategory();
    const executeCategory = await findAllCategory.execute();
    if (!executeCategory.find || executeCategory.find.length === 0) {
      await ctx.reply('Nenhuma categoria encontrada no momento.', {
        reply_markup: Markup.inlineKeyboard([
          [
            {text: 'Voltar', callback_data:'voltar_inicial'}
          ]
        ]).reply_markup,
      });
      ctx.scene.leave();
      await ctx.deleteMessage()
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
    await ctx.reply('Selecione uma Categoria',  {
      reply_markup: Markup.inlineKeyboard(categoryButtons).reply_markup,
    })
    ctx.scene.leave();
    await ctx.deleteMessage()
  } catch (error) {
    console.error('Erro ao adicionar Listar a Categoria:', error);
    await ctx.reply('Erro ao Listar a categoria. Tente novamente.');
    ctx.scene.leave();
  }
})

const handleCategoryOptions = new BaseScene<MyContext>('categoryOptions');
handleCategoryOptions.enter(async (ctx) => {
  const userName = ctx.session.userName
  try {
    const idCategoryReference = ctx.session.categoryId; 
    await ctx.reply(`Olá ${userName ?? 'Usuário'}, escolha uma ação:`, {
      reply_markup: Markup.inlineKeyboard([
        [
          { text: 'Adicionar Subcategoria', callback_data: `add_subcategoria_${idCategoryReference}` },
          { text: 'Listar Subcategorias', callback_data: `list_subcategoria_${idCategoryReference}` },
          { text: 'Editar Categoria', callback_data: `edit_categoria_${idCategoryReference}` }
        ],
      ]).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao listar opções:', error);
    await ctx.reply('Erro ao listar as opções. Tente novamente.');
    ctx.scene.leave();
  }
});

const handleAddSubCategory = new BaseScene<MyContext>('addSubcategory');
handleAddSubCategory.enter(async (ctx) => {
  const message = await ctx.reply('Por favor, envie o nome da nova subcategoria:');
  setTimeout(async () => {
    try {
      await ctx.deleteMessage(message.message_id);
    } catch (error) {
      console.error('Erro ao deletar a mensagem:', error);
    }
  }, 5000);
});
handleAddSubCategory.on('text', async (ctx) =>{
  const idCategoryReference = ctx.session.categoryId;
  const nameSubCategory = ctx.message.text.trim();
  try {
    // Lógica para adicionar subcategoria
    const addSubCategory = new AddSubCategory();
    const execute = await addSubCategory.execute({
      nameSubCategory,
      idCategoryReference,
    });

    // Envia a resposta ao usuário
    const message = execute.sucess
      ? `Subcategoria "${nameSubCategory}" adicionada com sucesso!`
      : `Subcategoria já existe. Nome: ${execute.name}`;

    await ctx.reply(message, {
      reply_markup: Markup.inlineKeyboard([
        [
          {text: 'Voltar', callback_data: 'voltar_inicial'}
        ]
      ]).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar subcategoria:', error);
    await ctx.reply('Erro ao adicionar a subcategoria. Tente novamente.');
    ctx.scene.leave();
  }
});

const handleListSubCategory = new BaseScene<MyContext>('listSubcategory');
handleListSubCategory.enter(async (ctx) => {
  try {
    const idCategoryReference = ctx.session.categoryId;
    const findAllSubToCategory  = new FindAllSubCategoryToCategory();
    const executeCategory = await findAllSubToCategory.execute({idCategoryReference});
    if (!executeCategory.find || executeCategory.find.length === 0) {
      await ctx.reply('Nenhuma categoria encontrada no momento.', {
        reply_markup: Markup.inlineKeyboard([
          [
            {text: 'Voltar', callback_data:'voltar_inicial'}
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
    await ctx.reply('Selecione uma Subcategoria',  {
      reply_markup: Markup.inlineKeyboard([...categoryButtons]).reply_markup,
    })
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar Listar a Categoria:', error);
    await ctx.reply('Erro ao Listar a categoria. Tente novamente.');
    ctx.scene.leave();
  }
})

const handleSubcategoryOptions = new BaseScene<MyContext>('subcategoryOptions');
handleSubcategoryOptions.enter(async (ctx) => {
  try {
    const idSubCategoryReference = ctx.session.subcategoryId; 
    await ctx.reply(`Olá ${ctx.session?.userName ?? 'Usuário'}, escolha uma ação para subcategoria:`, {
      reply_markup: Markup.inlineKeyboard([
        [
          { text: 'Adicionar Produto', callback_data: `add_produto_${idSubCategoryReference}` },
          { text: 'Listar produto', callback_data: `list_Produto_${idSubCategoryReference}` },
          { text: 'Editar subcategoria', callback_data: `edit_subcategoria_${idSubCategoryReference}` },
        ],
      ]).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao listar opções:', error);
    await ctx.reply('Erro ao listar as opções. Tente novamente.');
    ctx.scene.leave();
  }
});

const handleEditCategory = new BaseScene<MyContext>('editCategory');
handleEditCategory.enter(async (ctx) =>{
  await ctx.reply('Digite o novo nome para categoria que selecionou!')
})
handleEditCategory.on('text', async (ctx) =>{
  const newName = (ctx.message as any).text;
  const idCategoryReference = ctx.session.categoryId;
  
  if (!newName || newName.trim().length === 0) {
    await ctx.reply('O nome da categoria não pode ser vazio. Tente novamente.');
    return;
  }

  try {
    const editCategory = new EditCategory();
    await editCategory.execute({ idCategoryReference, newName });
    await ctx.reply(`Categoria editada com sucesso!`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Voltar', callback_data: 'voltar_inicial' },
          ],
        ],
      },
    });
  } catch (error) {
    console.error('Erro ao editar categoria:', error);
    await ctx.reply('Houve um erro ao editar a categoria. Tente novamente mais tarde.');
  }
})

const handleEditSubcategory = new BaseScene<MyContext>('editSubcategory');
handleEditSubcategory.enter(async (ctx) =>{
  await ctx.reply('Digite o novo nome para subcategoria que selecionou!')
})
handleEditSubcategory.on('text', async (ctx) =>{
  const nameSubCategory = (ctx.message as any).text;
  const idSubCategory = ctx.session.subcategoryId;
  // Verifica se o nome da subcategoria é válido
  if (!nameSubCategory || nameSubCategory.trim().length === 0) {
    await ctx.reply('O nome não pode estar vazio. Tente novamente.');
    return;
  }

  try {
    // Chama o método para editar a subcategoria
    const editSubCategory = new EditSubCategory();
    await editSubCategory.execute({ idSubCategory, nameSubCategory })

    // Responde com a confirmação de sucesso
    await ctx.reply(`Subcategoria "${nameSubCategory}" editada com sucesso!`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ],
      },
    });

    console.log('Subcategoria alterada: ' + idSubCategory);
  } catch (error) {
    console.error('Erro ao editar a subcategoria:', error);
    await ctx.reply(
      'Houve um erro ao editar a subcategoria. Tente novamente mais tarde.'
    );
  }
})

stage.register(handleAddCategory);
stage.register(handleListCategory);
stage.register(handleCategoryOptions);
stage.register(handleAddSubCategory);
stage.register(handleListSubCategory)
stage.register(handleSubcategoryOptions)
stage.register(handleEditCategory)
stage.register(handleEditSubcategory)

// ========================= Ações =====================
// Inicia o Bot
bot.start(welcomeMessage);
// Adiciona Categoria
bot.action('add_categoria', async (ctx:MyContext) =>{
  // Excluir a mensagem anterior
  if (ctx.session.idSentMessage) {
    await ctx.deleteMessage(ctx.session.idSentMessage);
  }
  ctx.scene.enter('addCategoria')
})
// Lista a Categoria
bot.action('list_categoria', async (ctx:MyContext) =>{
  ctx.scene.enter('listCategoria')
}) 
// Mostra as opções da Categoria
bot.action(/categoria_options_(\d+)/, (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  if (!idCategoryReference) {
    console.error("ID da categoria não encontrado.");
    return;
  }

  // Armazenar o idCategoryReference na sessão
  ctx.session.categoryId = Number(idCategoryReference);

  // Entra na cena 'categoryOptions' e a sessão já contém o idCategoryReference
  ctx.scene.enter('categoryOptions');
});
// Adiciona Subcategoria
bot.action(/add_subcategoria_(\d+)/, (ctx: MyContext) =>{
  const idCategoryReference = ctx.match[1];
  if (!idCategoryReference) {
    console.error("ID da categoria não encontrado.");
    return;
  }

  // Armazenar o idCategoryReference na sessão
  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('addSubcategory')
})
// List Subcategory
bot.action(/list_subcategoria_(\d+)/, (ctx: MyContext) =>{
  const idCategoryReference = ctx.match[1];
  if (!idCategoryReference) {
    console.error("ID da categoria não encontrado.");
    return;
  }

  // Armazenar o idCategoryReference na sessão
  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('listSubcategory')
})
// Mostrar opções da subcategoria
bot.action(/option_subcategoria_(\d+)/, (ctx: MyContext) =>{
  const idSubCategoryReference = ctx.match[1]
  if(!idSubCategoryReference){
    console.error("ID da subcategoria não encontrado")
    return;
  }
  ctx.session.subcategoryId = Number(idSubCategoryReference);
  ctx.scene.enter('subcategoryOptions')
})
// Editar Categoria
bot.action(/edit_categoria_(\d+)/, async (ctx:MyContext) =>{
  // Excluir a mensagem anterior
  const idCategoryReference = ctx.match[1];
  if (!idCategoryReference) {
    console.error("ID da categoria não encontrado.");
    return;
  }

  // Armazenar o idCategoryReference na sessão
  ctx.session.categoryId = Number(idCategoryReference);

  ctx.scene.enter('editCategory')
})
bot.action(/edit_subcategoria_(\d+)/, async (ctx:MyContext) =>{
  // Excluir a mensagem anterior
  const idSubCategoryReference = ctx.match[1];
  if (!idSubCategoryReference) {
    console.error("ID da categoria não encontrado.");
    return;
  }

  // Armazenar o idCategoryReference na sessão
  ctx.session.subcategoryId = Number(idSubCategoryReference);

  ctx.scene.enter('editSubcategory')
})
// Voltar ao menu Inicial
bot.action('voltar_inicial', async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Confirma o callback
    await renderInitialMenu(ctx); // Retorna ao menu inicial
  } catch (error) {
    console.error('Erro ao voltar ao menu inicial:', error);
  }
});



// ================ middallware ===============

// bot.action('voltar_inicial', handleBackToInitialMenu);
bot.launch();