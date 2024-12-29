import { Telegraf, Context } from 'telegraf';
import { AddClient } from './client/addClient';

const api = process.env.TOKEN_API || "";
const bot = new Telegraf(api);

// Comando /start
bot.start(async (ctx: Context) => {
  // Envia a mensagem de "Oi" assim que o bot for iniciado
  const userId = String(ctx.from?.id);
  const username = String(ctx.from?.first_name);

  const addClient = new AddClient()
  const execute = await addClient.execute({userId, username})

  if(userId === process.env.ID_USER){
    const messageAdmin = `Olá ${username} escolha uma ação`
    console.log(messageAdmin)
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
    <b>├💸 Saldo: R$${execute?.saldo}</b>
    <b>├💎 Pontos: R$${execute?.bonus}</b>
    <b>└💸 Saldo Em Dobro: 25.00%</b>
  `;
  
  // mensagem com formatação HTML
  await ctx.reply(messageWelcome, { parse_mode: 'HTML' });

  const imageUrl = 'https://imgur.com/a/DKxJgp6'; // Coloque a URL da sua imagem aqui
  await ctx.replyWithPhoto(imageUrl, {});

  // botões pra o usuário interagir
  await ctx.reply('Escolha uma opção:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📦 COMPRAR', callback_data: 'comprar' },
          { text: '💸 ADD SALDO', callback_data: 'add saldo' }
        ]
      ]
    }
  });
});

// Ações -  implementar banco de dados aqui.
bot.action('comprar', async (ctx) => {
  await ctx.reply('Escolha uma opção de serviço:', {
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
});

bot.action('streaming', async (ctx) => {
  await ctx.reply('Nossos Serviços de Streaming incluem: ', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Deezer', callback_data: 'deezer' },
          { text: 'Spotify', callback_data: 'spotify' }
        ]
      ]
    }
  });
});

// Iniciar o bot
console.log('Bot rodando...');
bot.launch();
