import { Telegraf, Context, session } from 'telegraf';
import { AddClient } from './client/addClient';
import { AddCategory } from './produto/categoria/addCategory';
import { FindAllCategory } from './produto/categoria/findAllCategory';
import { AddSubCategory } from './produto/subcategoria/addSubCategory';
import { FindAllSubCategoryToCategory } from './produto/subcategoria/findAllSubCategoryToCategory';
import { EditCategory } from './produto/categoria/editCategory';
import { EditSubCategory } from './produto/subcategoria/editSubCategory';

const api = process.env.TOKEN_API || "";
interface SessionData {
  idCategoryReference: number | null;
  idSubCategory: number | null;
  username: string;
  userId: string;
}
interface MyContext extends Context{
  session?: SessionData;
  match?: RegExpMatchArray; // Adiciona 'match' ao contexto
}
const bot = new Telegraf<MyContext>(api);
bot.use(session());

// ====================== Utilitários ==========================
const renderInitialMenu = async (ctx: MyContext) => {
  await ctx.reply(`Olá ${ctx.session?.username}, escolha uma ação:`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Add Categoria', callback_data: 'add_categoria' },
          { text: 'List Categoria', callback_data: 'list_categoria' },
        ],
      ],
    },
  });
  console.log('Renderização Inicial \d')
};

const welcomeMessage = async (ctx: MyContext, userData) => {
  const userId = String(ctx.from?.id);
  const username = String(ctx.from?.first_name);

  ctx.session = {
    idCategoryReference: null,
    idSubCategory: null,
    username,
    userId,
  };

  const addClient = new AddClient();
  const clientData = await addClient.execute({ userId, username });

  if (userId === process.env.ID_USER || userId === '1000026242') {
    await renderInitialMenu(ctx);
  } else {
    const welcomeMessage = `
    <b>Olá, ${username}! Seja bem-vindo(a)!</b>
    <b>Você está no sua loja aqui Bot</b>
    <b>Garantimos Acesso em Todos os Logins ✅</b>
    <b>Logins De Alta Qualidade Para Aprovação ✅</b>
    <b>Garantia de Pedidos No Login ou Reembolso ✅</b>
    <b>Canal: @njfnsjdnf</b>
    <b>Suporte: @seulink</b>
    <b>🧾 Seu perfil:</b>
    <b>├👤 ID:</b> <code>${userId}</code>
    <b>├💸 Saldo: R$${clientData?.saldo}</b>
    <b>├💎 Pontos: R$${clientData?.bonus}</b>
    <b>└💸 Saldo Em Dobro: 25.00%</b>`;

    await ctx.reply(welcomeMessage, { parse_mode: 'HTML' });
    await ctx.replyWithPhoto('https://imgur.com/a/DKxJgp6');
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

const resetSession = (ctx: MyContext) => {
  if (ctx.session) {
    ctx.session.idCategoryReference = null;
    ctx.session.idSubCategory = null;
  }
  console.log('Resetado o IdCategoryReference e IdSubCategory')
};

const handleAddCategory = async (ctx: MyContext) => {
  await ctx.reply('Por favor, envie o nome da nova categoria:', );
  bot.on('text', async (textCtx: MyContext) =>{
    const name = (textCtx.message as any).text.trim();
    try{
      const addCategory = new AddCategory();
      await addCategory.execute({name})
      await textCtx.reply(`Categoria ${name} adicionada com sucesso!`, {
        reply_markup:{
          inline_keyboard:[[{ text: 'Voltar', callback_data: 'voltar_inicial'}]]
        }
      })
    } catch(error) {
      console.error('Erro: '+error)
    }
  })
};

const handleListCategory = async (ctx: MyContext) => {
  try {
    // Exclui a mensagem anterior e responde ao callback
    await ctx.deleteMessage();
    await ctx.answerCbQuery();

    // Obtém as categorias
    const findAllCategory = new FindAllCategory();
    const executeCategory = await findAllCategory.execute();

    // Verifica se há categorias disponíveis
    if (!executeCategory.find || executeCategory.find.length === 0) {
      await ctx.reply('Nenhuma categoria encontrada no momento.', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Voltar', callback_data: 'voltar_inicial' }]],
        },
      });
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

    // Envia a lista de categorias como botões
    await ctx.reply('Escolha uma categoria:', {
      reply_markup: { inline_keyboard: categoryButtons },
    });

  } catch (error) {
    // Loga o erro no console e informa ao usuário
    console.error('Erro ao listar categorias:', error);
    await ctx.reply('Houve um erro ao listar as categorias. Tente novamente mais tarde.');
  } finally {
    resetSession(ctx)
  }
};

const handleAddSubCategory = async (ctx: MyContext) => {
  const userId = String(ctx.from?.id);
  const username = String(ctx.from?.first_name);
  const categoryId = Number(ctx.match[1]);

  // Inicializa a sessão do usuário
  ctx.session = {
    idCategoryReference: categoryId,
    idSubCategory: null,
    userId,
    username,
  };

  console.log('Adicionar Subcategoria'); 
  try {
    console.log('ID da categoria de referência addSubcategory:', categoryId);
    // Solicita o nome da subcategoria
    await ctx.reply('Por favor, envie o nome da nova subcategoria.');
    // Registra o ouvinte
    process.once('text', async (textCtx: MyContext) => {
      const nameSubCategory = (textCtx.message as any).text.trim();
      console.log('Nome da subcategoria:', nameSubCategory);

      try {
        // Lógica para adicionar subcategoria
        const addSubCategory = new AddSubCategory();
        const execute = await addSubCategory.execute({
          nameSubCategory,
          idCategoryReference: categoryId,
        });

        // Envia a resposta ao usuário
        const message = execute.sucess
          ? `Subcategoria "${nameSubCategory}" adicionada com sucesso!`
          : `Subcategoria já existe. Nome: ${execute.name}`;

        await textCtx.reply(message, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Voltar', callback_data: 'list_categoria' }],
            ],
          },
        });

        console.log('Subcategoria adicionada para a categoria:', categoryId);
      } catch (error) {
        console.error('Erro ao adicionar subcategoria:', error);
        await textCtx.reply('Houve um erro ao adicionar a subcategoria. Tente novamente mais tarde.');
      }
    });
    console.log('Ignorado o texto ouvinte')
  } catch (error) {
    console.error('Erro no handleAddSubCategory:', error);
    await ctx.reply('Houve um erro ao processar sua solicitação. Por favor, tente novamente.');
  } finally{
    console.log('Finalizando add subcategoria')
  }
};

const handleListSubCategory = async (ctx: MyContext) => {
  try {
    // Certifica-se de que 'match' existe antes de acessar
    if (!ctx.match || ctx.match.length < 2) {
      throw new Error('ID da categoria não encontrado no callback.');
    }

    // Obtém o ID da categoria do callback
    const idCategoryReference = Number(ctx.match[1]);
    if (isNaN(idCategoryReference)) {
      throw new Error('ID da categoria inválido.');
    }

    await ctx.deleteMessage();
    await ctx.answerCbQuery();

    const findAllSubCategory = new FindAllSubCategoryToCategory();
    const executeSubCategory = await findAllSubCategory.execute({ idCategoryReference });

    // Cria botões para subcategorias
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
    console.error('Erro ao listar subcategorias:', error.message);
    await ctx.reply('Houve um erro ao listar as subcategorias. Tente novamente mais tarde.');
  } finally {
    console.log(ctx.session)
    resetSession(ctx)
  }
};

const handleCategoryOptions = async (ctx: MyContext) => {
  try {
    await ctx.deleteMessage();
    await ctx.answerCbQuery();
    const IdCategoryReference = Number(ctx.match[1]);
    ctx.session = {
      idCategoryReference:  IdCategoryReference,
      idSubCategory: null,
      username: String(ctx.from?.first_name),
      userId: String(ctx.from?.id)
    };
    // Envia as opções para o usuário
    await ctx.reply('Escolha uma ação:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Adicionar Subcategoria', callback_data: `subAdd_${ctx.session.idCategoryReference}` }],
          // [{ text: 'Listar Subcategorias', callback_data: `list_subcategoria_${idCategoryReference}` }],
          // [{ text: 'Editar Categoria', callback_data: `edit_categoria_${idCategoryReference}` }],
          // [{ text: 'Voltar', callback_data: 'list_categoria' }],
        ],
      },
    });

    console.log(`ID da categoria na category options: ${IdCategoryReference}`);
  } catch (error) {
    console.error('Erro no handleCategoryOptions:', error.message);
    await ctx.reply('Houve um erro ao processar a solicitação. Tente novamente mais tarde.');
  } finally {
    console.log('Categoria de Referencia: '+ ctx.session.idCategoryReference)
  }
};

const handleSubCategoryOptions = async (ctx: MyContext) => {
  try {
    // Verifica se ctx.match existe e contém o ID da subcategoria
    if (!ctx.match || ctx.match.length < 2) {
      throw new Error('ID da subcategoria não encontrado no callback.');
    }

    // Obtém o ID da subcategoria
    const idSubCategory = ctx.match[1];
    if (!idSubCategory) {
      throw new Error('ID da subcategoria inválido.');
    }

    await ctx.deleteMessage();
    await ctx.answerCbQuery();

    // Envia as opções para o usuário
    await ctx.reply('Escolha uma ação:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Adicionar Produto', callback_data: `add_produto_${idSubCategory}` }],
          [{ text: 'Listar Produtos', callback_data: `list_produto_${idSubCategory}` }],
          [{ text: 'Editar Subcategoria', callback_data: `edit_subcategoria_${idSubCategory}` }],
          [{ text: 'Voltar', callback_data: 'list_categoria' }],
        ],
      },
    });

    console.log(`ID da subcategoria: ${idSubCategory}`);
  } catch (error) {
    console.error('Erro no handleSubCategoryOptions:', error.message);
    await ctx.reply('Houve um erro ao processar a solicitação. Tente novamente mais tarde.');
  } finally {
    console.log(ctx.session)
    resetSession(ctx)
  }
};

const handleEditCategory = async (ctx: MyContext) => {
  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  // Verifica se a referência da categoria está definida
  if (!ctx.session || !ctx.session.idCategoryReference) {
    await ctx.reply('Não foi possível encontrar a categoria selecionada. Tente novamente.');
    return;
  }

  const idCategoryReference = ctx.session.idCategoryReference;

  const sentMessage = await ctx.reply(`Por favor, envie o novo nome para a categoria que selecionou:`);

  // Usando `once` para escutar apenas a próxima mensagem
  bot.on('text', async (textCtx: Context) => {
    const newName = (textCtx.message as any).text;

    if (!newName || newName.trim().length === 0) {
      await textCtx.reply('O nome da categoria não pode ser vazio. Tente novamente.');
      return;
    }

    try {
      const editCategory = new EditCategory();
      await editCategory.execute({ idCategoryReference, newName });

      // Deletar a mensagem inicial de solicitação
      await ctx.deleteMessage(sentMessage.message_id);

      // Responder ao usuário com a confirmação
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
      console.error('Erro ao editar categoria:', error);
      await textCtx.reply('Houve um erro ao editar a categoria. Tente novamente mais tarde.');
    }
    finally {
      console.log(ctx.session)
      resetSession(ctx)
    }
  });
};

const handleEditSubCategory = async (ctx: MyContext) => {
  const idSubCategory = Number(ctx.match[1]); // Obter ID da subcategoria da callback data
  console.log('Subcategoria selecionada: ' + idSubCategory);

  await ctx.deleteMessage();
  await ctx.answerCbQuery();

  // Envia mensagem pedindo o novo nome
  const sentMessage = await ctx.reply(
    'Por favor, envie o novo nome para a subcategoria selecionada.'
  );

  // Variável para garantir que só escutaremos uma vez
  const onceListener = async (textCtx: Context) => {
    const nameSubCategory = (textCtx.message as any).text;

    // Verifica se o nome da subcategoria é válido
    if (!nameSubCategory || nameSubCategory.trim().length === 0) {
      await textCtx.reply('O nome não pode estar vazio. Tente novamente.');
      return;
    }

    try {
      // Chama o método para editar a subcategoria
      const editSubCategory = new EditSubCategory();
      await editSubCategory.execute({ idSubCategory, nameSubCategory });

      // Deleta a mensagem que solicitava o novo nome
      await ctx.deleteMessage(sentMessage.message_id);

      // Responde com a confirmação de sucesso
      await textCtx.reply(`Subcategoria "${nameSubCategory}" editada com sucesso!`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
          ],
        },
      });

      console.log('Subcategoria alterada: ' + idSubCategory);
    } catch (error) {
      console.error('Erro ao editar a subcategoria:', error);

      // Informa o usuário sobre o erro
      await textCtx.reply(
        'Houve um erro ao editar a subcategoria. Tente novamente mais tarde.'
      );
    } finally {
      console.log(ctx.session)
      resetSession(ctx)
    }
  };

  // Registra o listener apenas para esta ação
  bot.on('text', onceListener);
};

const handleBackToInitialMenu = async (ctx: MyContext) => {
  // Limpa as variáveis de referência da categoria e subcategoria
  if (ctx.session) {
    ctx.session.idCategoryReference = null;
    ctx.session.idSubCategory = null;
  }

  // Deleta a mensagem anterior
  await ctx.deleteMessage();
  
  // Exibe o menu inicial
  await renderInitialMenu(ctx);
};


// ========================= Ações =====================
// Inicia o Bot
bot.start(welcomeMessage);
// Adiciona Categoria
bot.action('add_categoria', handleAddCategory);
// Adiciona a Subcategoria
bot.action(/subAdd_(\d+)/, handleAddSubCategory);
// Lista as opçoes da categoria
bot.action(/categoria_options_(\d+)/, handleCategoryOptions);
// Lista as Categorias
bot.action('list_categoria', handleListCategory);
// Lista a Subcategoria
bot.action(/list_subcategoria_(\d+)/, handleListSubCategory);
// Lista as opçoes da Subcategoria clicada
bot.action(/subcategoria_options_(\d+)/, handleSubCategoryOptions);

// Edita a Categoria selecionada
bot.action(/edit_categoria_(\d+)/, handleEditCategory)
// Edita a Subcategoria selecionada
bot.action(/edit_subcategoria_(\d+)/, handleEditSubCategory)

// ================ middallware ===============

bot.action('voltar_inicial', handleBackToInitialMenu);
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));