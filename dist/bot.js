"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactKeyboard = createContactKeyboard;
exports.sendMessage = sendMessage;
exports.removeKeyboard = removeKeyboard;
exports.sendContactRequest = sendContactRequest;
exports.sendAppLink = sendAppLink;
const tslib_1 = require("tslib");
const firebase_config_1 = require("./firebase-config");
const dayjs_format_1 = require("./util/dayjs_format");
const auth_token_service_1 = require("./services/auth-token.service");
const node_telegram_bot_api_1 = tslib_1.__importDefault(require("node-telegram-bot-api"));
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required but not set');
}
const bot = new node_telegram_bot_api_1.default(BOT_TOKEN, {
    polling: {
        interval: 3000,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    console.log('📨 Received message:', text, 'from chat:', chatId);
    if (msg.contact) {
        const contact = msg.contact;
        handleContactShare(chatId, contact);
    }
    else if (text && (/^[+]?[0-9\s\-()]{10,15}$/).test(text)) {
        const cleanPhone = text.replace(/[\s\-()]/g, '');
        const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
        handleContactShare(chatId, {
            phone_number: normalizedPhone,
            first_name: msg.from?.first_name || 'User'
        });
    }
});
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /start command from chat ${chatId}`);
    sendContactRequest(chatId);
});
bot.onText(/\/test/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /test command from chat ${chatId}`);
    sendMessage(chatId, '✅ Bot is working!');
});
console.log('🤖 Bot initialized successfully');
console.log('🔧 Bot token is valid and working');
console.log('🚀 Starting polling with node-telegram-bot-api...');
console.log('✅ Polling started successfully');
console.log('📡 Bot is now listening for messages...');
function createContactKeyboard() {
    return {
        keyboard: [
            [{ text: '📱 Share Phone Number', request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}
async function sendMessage(chatId, text, keyboard) {
    const messageText = text && text.trim() ? text : '.';
    const options = { parse_mode: 'HTML' };
    if (keyboard) {
        options.reply_markup = keyboard;
    }
    return bot.sendMessage(chatId, messageText, options);
}
async function removeKeyboard(chatId) {
    return bot.sendMessage(chatId, '.', { reply_markup: { remove_keyboard: true } });
}
async function sendContactRequest(chatId) {
    const keyboard = createContactKeyboard();
    return sendMessage(chatId, '👋 Welcome to oneHR!\n\nTo continue, please share your phone number so we can verify your employee account.', keyboard);
}
async function sendAppLink(chatId, phoneNumber, projectName, employeeUid) {
    try {
        const authData = await (0, auth_token_service_1.generateEmployeeAuthToken)(employeeUid, projectName, phoneNumber);
        const appUrl = generateAppUrl(phoneNumber, authData.projectId, employeeUid, authData.customToken);
        await sendMessage(chatId, '✅ Phone verified and linked to your employee account!', { remove_keyboard: true });
        return sendMessage(chatId, '⬇️ Click below to open your oneHR dashboard:', {
            inline_keyboard: [
                [{ text: '🚀 Open oneHR App', web_app: { url: appUrl } }]
            ],
        });
    }
    catch (error) {
        console.error('Error generating auth token for app link:', error);
        const basicUrl = generateAppUrl(phoneNumber);
        await sendMessage(chatId, '✅ Phone verified! (Auto-login unavailable)', { remove_keyboard: true });
        return sendMessage(chatId, '⬇️ Click below to open your oneHR dashboard:', {
            inline_keyboard: [
                [{ text: '🚀 Open oneHR App', web_app: { url: basicUrl } }]
            ],
        });
    }
}
async function findEmployeeByPhoneNumber(phoneNumber) {
    const cached = firebase_config_1.employeeCache.get(phoneNumber);
    if (cached) {
        console.log(`Cache hit for phone ${phoneNumber} in project ${cached.projectName}`);
        return { employee: cached.data, projectName: cached.projectName };
    }
    const healthyDbs = await (0, firebase_config_1.getHealthyDbInstances)();
    console.log(`Searching for phone ${phoneNumber} across ${Object.keys(healthyDbs).length} Firebase projects`);
    for (const [projectName, db] of Object.entries(healthyDbs)) {
        try {
            const employeesRef = db.collection('employee');
            const query = await (0, firebase_config_1.retryDatabaseOperation)(async () => {
                return await employeesRef
                    .where('personalPhoneNumber', '==', phoneNumber)
                    .limit(1)
                    .get();
            }, 2, 1000, projectName);
            if (!query.empty) {
                const doc = query.docs[0];
                if (doc && doc.exists) {
                    const employee = { id: doc.id, uid: doc.data().uid, ...doc.data() };
                    firebase_config_1.employeeCache.set(phoneNumber, employee, projectName);
                    console.log(`Found employee ${employee.id} (UID: ${employee.uid}) in project ${projectName}`);
                    return { employee, projectName };
                }
            }
        }
        catch (error) {
            console.error(`Error searching ${projectName}:`, error);
            continue;
        }
    }
    console.log(`Employee with phone ${phoneNumber} not found in any project`);
    return null;
}
async function updateEmployeeTelegramChatID(employeeId, chatId, projectName) {
    const db = (await (0, firebase_config_1.getHealthyDbInstances)())[projectName];
    if (!db) {
        throw new Error(`Database for project ${projectName} is not healthy`);
    }
    try {
        await (0, firebase_config_1.retryDatabaseOperation)(async () => {
            return await db.collection('employee').doc(employeeId).update({
                telegramChatID: chatId.toString(),
                lastChanged: (0, dayjs_format_1.getTimestamp)()
            });
        }, 2, 1000, projectName);
        console.log(`Updated telegramChatID for employee ${employeeId} in ${projectName}`);
        return true;
    }
    catch (error) {
        console.error(`Failed to update telegramChatID for employee ${employeeId}:`, error);
        return false;
    }
}
function generateAppUrl(phoneNumber, projectId, employeeUid, customToken) {
    const baseUrl = process.env.WEB_APP_URL || 'https://your-default-app-url.com';
    const encodedPhone = encodeURIComponent(phoneNumber);
    const timestamp = Date.now();
    let url = `${baseUrl}?phone=${encodedPhone}&t=${timestamp}`;
    if (projectId) {
        url += `&pid=${encodeURIComponent(projectId)}`;
    }
    if (employeeUid) {
        url += `&uid=${encodeURIComponent(employeeUid)}`;
    }
    if (customToken) {
        url += `&token=${encodeURIComponent(customToken)}`;
    }
    return url;
}
async function handleContactShare(chatId, contact) {
    const phoneNumber = contact.phone_number;
    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
    console.log(`Processing contact share for chat ${chatId}, phone: ${normalizedPhone}`);
    try {
        await sendMessage(chatId, '⏳ Please wait while we verify your phone number...');
        const result = await findEmployeeByPhoneNumber(normalizedPhone);
        if (result) {
            const { employee, projectName } = result;
            const updateSuccess = await updateEmployeeTelegramChatID(employee.id, chatId, projectName);
            if (updateSuccess) {
                await sendAppLink(chatId, normalizedPhone, projectName, employee.uid);
                console.log(`Successfully linked employee ${employee.id} to chat ${chatId}`);
            }
            else {
                await sendMessage(chatId, '❌ Failed to link your account. Please try again or contact support.');
            }
        }
        else {
            await sendMessage(chatId, '❌ Employee account not found.\n\nPlease ensure you are sharing the same phone number registered in the HR system, or contact your HR administrator for assistance.', { remove_keyboard: true });
        }
    }
    catch (error) {
        console.error('Error processing contact:', error);
        await sendMessage(chatId, '❌ An error occurred while processing your request. Please try again later.', { remove_keyboard: true });
    }
}
console.log('Initializing Telegram bot handlers...');
console.log('Telegram bot handlers initialized successfully');
