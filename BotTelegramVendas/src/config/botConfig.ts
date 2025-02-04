import { Telegraf, Scenes, session } from 'telegraf';
import handleListCategory from '../../controller/produto/Categoria/handleListCategoryController';
import handleAddCategory from '../../controller/produto/Categoria/handleAddCategoryController';
import handleDeleteCategory from '../../controller/produto/Categoria/handleDeleteCategoryController';
import handleEditCategory from '../../controller/produto/Categoria/handleEditCategoryController';
import handleCategoryOptions from '../../controller/produto/Categoria/handleCategoryOptionsController';

import handleListSubcategory from '../../controller/produto/Subcategoria/handleListSubcategoryController';
import handleAddSubcategory from '../../controller/produto/Subcategoria/handleAddSubcategoryController';
import handleDeleteSubcategory from '../../controller/produto/Subcategoria/handleDeleteSubcategoryController'
import handleEditSubcategory from '../../controller/produto/Subcategoria/handleEditSubcategoryController'
import handleSubcategoryOptions from '../../controller/produto/Subcategoria/handleSubcategoryOptionController'

import handleAddItens from '../../controller/produto/Itens/handleAddItensController'
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

stage.register(handleAddSubcategory)
stage.register(handleListSubcategory)
stage.register(handleDeleteSubcategory)
stage.register(handleEditSubcategory)
stage.register(handleSubcategoryOptions)

stage.register(handleAddItens)
// Exportação do Stage para registro de cenas
export { stage };
