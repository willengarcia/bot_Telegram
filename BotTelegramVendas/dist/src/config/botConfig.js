"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stage = exports.bot = void 0;
const telegraf_1 = require("telegraf");
const handleListCategoryController_1 = __importDefault(require("../../controller/produto/Categoria/handleListCategoryController"));
const handleAddCategoryController_1 = __importDefault(require("../../controller/produto/Categoria/handleAddCategoryController"));
const handleDeleteCategoryController_1 = __importDefault(require("../../controller/produto/Categoria/handleDeleteCategoryController"));
const handleEditCategoryController_1 = __importDefault(require("../../controller/produto/Categoria/handleEditCategoryController"));
const handleCategoryOptionsController_1 = __importDefault(require("../../controller/produto/Categoria/handleCategoryOptionsController"));
const handleListSubcategoryController_1 = __importDefault(require("../../controller/produto/Subcategoria/handleListSubcategoryController"));
const handleAddSubcategoryController_1 = __importDefault(require("../../controller/produto/Subcategoria/handleAddSubcategoryController"));
require("dotenv/config");
// Criação do bot
const api = process.env.TOKEN_API || "";
;
exports.bot = new telegraf_1.Telegraf(api);
// Criação do Stage
const stage = new telegraf_1.Scenes.Stage();
exports.stage = stage;
// Middleware
exports.bot.use((0, telegraf_1.session)()); // Gerencia a sessão
exports.bot.use(stage.middleware()); // Adiciona o middleware do Stage
stage.register(handleListCategoryController_1.default);
stage.register(handleAddCategoryController_1.default);
stage.register(handleDeleteCategoryController_1.default);
stage.register(handleEditCategoryController_1.default);
stage.register(handleCategoryOptionsController_1.default);
stage.register(handleAddSubcategoryController_1.default);
stage.register(handleListSubcategoryController_1.default);
//# sourceMappingURL=botConfig.js.map