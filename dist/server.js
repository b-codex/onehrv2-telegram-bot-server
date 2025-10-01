"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const express_1 = tslib_1.__importDefault(require("express"));
require("./bot");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        bot: {
            token: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
            polling: 'Always Enabled (Main Purpose)'
        },
        firebase: {
            configs: Object.keys(process.env).filter(key => key.includes('FIREBASE')).length
        },
        webApp: process.env.WEB_APP_URL ? 'Set' : 'Not set'
    });
});
app.post('/webhook', (req, res) => {
    console.log('📨 Webhook received:', req.body);
    res.status(200).send('OK');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Bot server running on port ${port}`);
    console.log(`🔗 Health check available at: http://localhost:${port}/health`);
    console.log(`🔗 Webhook endpoint available at: http://localhost:${port}/webhook`);
    console.log(`🤖 Environment check - Bot token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set'}`);
    console.log(`🔥 Environment check - Firebase configs: ${Object.keys(process.env).filter(key => key.includes('FIREBASE')).length} found`);
    console.log(`🌐 Environment check - Web app URL: ${process.env.WEB_APP_URL ? 'Set' : 'Not set'}`);
    console.log(`📡 Polling status: Always Enabled (Primary Function)`);
});
