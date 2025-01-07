import { Telegraf, Scenes, session } from 'telegraf';
import handleListCategory from '../../controller/produto/Categoria/handleListCategoryController';
import handleAddCategory from '../../controller/produto/Categoria/handleAddCategoryController';
import handleDeleteCategory from '../../controller/produto/Categoria/handleDeleteCategoryController';
import handleEditCategory from '../../controller/produto/Categoria/handleEditCategoryController';
import handleCategoryOptions from '../../controller/produto/Categoria/handleCategoryOptionsController';

import handleListSubcategory from '../../controller/produto/Subcategoria/handleListSubcategoryController';
import handleAddSubcategory from '../../controller/produto/Subcategoria/handleAddSubcategoryController';
import handleDeleteCategory from '../../controller/produto/Subcategoria/handleDeleteCategoryController';
import handleEditCategory from '../../controller/produto/Subcategoria/handleEditCategoryController';
import handleCategoryOptions from '../../controller/produto/Subcategoria/handleCategoryOptionsController';
import { MyContext } from '../types/MyContext';
import 'dotenv/config';

// Criação do bot
const api = process.env.TOKEN_API || "";;
export const bot = new Telegraf<MyContext>(api);

// Criação do Stage
const stage = new Scenes.Stage<MyContext>();

// Middleware
bot.use(session()); // Gerencia a sessão
bot.use(stage.middleware()); // Adiciona o middleware do Stage

stage.register(handleListCategory)
stage.register(handleAddCategory)
stage.register(handleDeleteCategory)
stage.register(handleEditCategory)
stage.register(handleCategoryOptions)
// Exportação do Stage para registro de cenas
export { stage };
