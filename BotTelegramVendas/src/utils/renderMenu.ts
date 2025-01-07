import { Markup } from 'telegraf';
import { MyContext } from '../types/MyContext';

export const renderInitialMenu = async (ctx: MyContext) => {
  const userName = ctx.session.userName;
  const message = await ctx.reply(`Olá ${userName ?? 'Usuário'}, escolha uma ação:`, {
    reply_markup: Markup.inlineKeyboard([
      [
        { text: 'Add Categoria', callback_data: 'add_categoria' },
        { text: 'List Categoria', callback_data: 'list_categoria' },
      ],
    ]).reply_markup,
  });
  ctx.session.idSentMessage = message.message_id;
  ctx.scene.leave();
  await ctx.deleteMessage();
};
