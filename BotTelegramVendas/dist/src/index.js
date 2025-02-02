"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botConfig_1 = require("./config/botConfig");
require("./actions/actionsBot");
const welcomeMessage_1 = require("./utils/welcomeMessage");
// Comando inicial
botConfig_1.bot.start(welcomeMessage_1.welcomeMessage);
// Inicializa o bot
botConfig_1.bot.launch();
console.log('Bot rodando...');
//# sourceMappingURL=index.js.map