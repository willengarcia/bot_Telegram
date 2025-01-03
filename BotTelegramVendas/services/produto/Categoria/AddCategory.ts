import { Telegraf, Context, session } from 'telegraf';
import { AddCategory } from '../../../src/produto/categoria/addCategory';
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

const handleAddCategory = async (ctx: MyContext) => {
    try {
      // Envia mensagem inicial pedindo o nome da categoria
      const sentMessage = await ctx.reply('Por favor, envie o nome da nova categoria:');
      
      // Listener para capturar o próximo texto enviado pelo usuário
      bot.on('text', async (textCtx: MyContext) => {
        const name = (textCtx.message as any).text;
  
        try {
          // Chama a lógica para adicionar a categoria
          const addCategory = new AddCategory();
          await addCategory.execute({ name });
  
          // Confirmação para o usuário
          await textCtx.reply(`Categoria "${name}" adicionada com sucesso!`, {
            reply_markup: {
              inline_keyboard: [[{ text: 'Voltar', callback_data: 'voltar_inicial' }]],
            },
          });
  
          // Remover o listener se necessário. Não há necessidade de gerenciar manualmente a remoção
          // de listeners nesta abordagem. Eles serão removidos após o processamento.
        } catch (error) {
          console.error('Erro ao adicionar categoria:', error);
          await textCtx.reply('Houve um erro ao adicionar a categoria. Tente novamente mais tarde.');
        }
      });
  
      // Configuração de um timeout para limpar o listener após um período
      setTimeout(() => {
        ctx.reply('Tempo expirado. Caso ainda queira adicionar uma categoria, clique novamente no botão.');
      }, 2 * 60 * 1000); // Exemplo: 2 minutos de timeout
  
    } catch (error) {
      console.error('Erro no handleAddCategory:', error);
      await ctx.reply('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };