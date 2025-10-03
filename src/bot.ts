// Telegram Bot implementation with node-telegram-bot-api for polling support
import { getHealthyDbInstances, retryDatabaseOperation, employeeCache } from './firebase-config';
import { getTimestamp } from './util/dayjs_format';
import { generateEmployeeAuthToken } from './services/auth-token.service';
import {
    Contact,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    TelegramMessage
} from './types/telegram';
import TelegramBot from 'node-telegram-bot-api';

// In-memory storage for chat sessions
interface ChatSession {
    phoneNumber: string;
    projectName: string;
    employeeUid: string;
    employeeId: string;
}

const chatSessions = new Map<number, ChatSession>();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required but not set');
}

// Create bot with polling configuration (always enabled for main functionality)
const bot = new TelegramBot(BOT_TOKEN, {
    polling: {
        interval: 3000,  // how often to poll in ms
        autoStart: true,
        params: {
            timeout: 10     // Telegram's "long polling" timeout in seconds
        }
    }
});

// Handle all incoming messages
bot.on('message', (msg: TelegramMessage) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    console.log('📨 Received message:', text, 'from chat:', chatId);

    // Handle contact sharing
    if (msg.contact) {
        const contact = msg.contact as Contact;
        handleContactShare(chatId, contact);
    }
    // Handle phone number as text
    else if (text && (/^[+]?[0-9\s\-()]{10,15}$/).test(text)) {
        const cleanPhone = text.replace(/[\s\-()]/g, '');
        const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
        handleContactShare(chatId, {
            phone_number: normalizedPhone,
            first_name: msg.from?.first_name || 'User'
        });
    }
});

// Handle specific commands
bot.onText(/\/start/, (msg: TelegramMessage) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /start command from chat ${chatId}`);
    sendContactRequest(chatId);
});

bot.onText(/\/test/, (msg: TelegramMessage) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /test command from chat ${chatId}`);
    sendMessage(chatId, '✅ Bot is working!');
});

bot.onText(/\/app/, async (msg: TelegramMessage) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /app command from chat ${chatId}`);

    const session = chatSessions.get(chatId);

    if (!session) {
        sendMessage(chatId, '❌ No active session found. Please use /start and share your phone number first.');
        return;
    }

    try {
        // Generate authentication token for the employee
        const authData = await generateEmployeeAuthToken(session.employeeUid, session.projectName, session.phoneNumber);

        // Generate app URL with authentication parameters
        const appUrl = generateAppUrl(
            session.phoneNumber,
            session.projectName,  // Use environment prefix instead of project ID
            session.employeeUid,
            authData.customToken
        );

        // Calculate expiration time (24 hours from now)
        // const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        // const formattedExpiration = expirationTime.toLocaleTimeString('en-US', {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: true,
        //     month: 'short',
        //     day: 'numeric'
        // });

        // Send app link with inline keyboard (skip phone verification message)
        await sendMessage(
            chatId,
            `⬇️ Click below to open your oneHR dashboard:\n\n💡 Use /app if this doesn't work`,
            {
                inline_keyboard: [
                    [{ text: '🚀 Open oneHR App', web_app: { url: appUrl } }]
                ],
            }
        );

        console.log(`Successfully regenerated app link for chat ${chatId}`);
    } catch (error) {
        console.error('Error regenerating app link:', error);

        // Fallback: Generate basic URL without authentication
        const basicUrl = generateAppUrl(session.phoneNumber);

        // Send basic app link
        await sendMessage(
            chatId,
            '⬇️ Click below to open your oneHR dashboard:\n\n💡 Use /app command to get a new authenticated link',
            {
                inline_keyboard: [
                    [{ text: '🚀 Open oneHR App', web_app: { url: basicUrl } }]
                ],
            }
        );
    }
});

console.log('🤖 Bot initialized successfully');
console.log('🔧 Bot token is valid and working');
console.log('🚀 Starting polling with node-telegram-bot-api...');
console.log('✅ Polling started successfully');
console.log('📡 Bot is now listening for messages...');

// Keyboard markup for phone number request
export function createContactKeyboard(): ReplyKeyboardMarkup {
    return {
        keyboard: [
            [{ text: '📱 Share Phone Number', request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}

// Send message with optional keyboard
export async function sendMessage(
    chatId: number,
    text: string,
    keyboard?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | { remove_keyboard: true }
): Promise<TelegramBot.Message> {
    // Ensure text is not empty
    const messageText = text && text.trim() ? text : '.';
    const options: { parse_mode: 'HTML' } & { reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove } = { parse_mode: 'HTML' };
    if (keyboard) {
        options.reply_markup = keyboard;
    }
    return bot.sendMessage(chatId, messageText, options);
}

// Remove keyboard
export async function removeKeyboard(chatId: number): Promise<TelegramBot.Message> {
    return bot.sendMessage(chatId, '.', { reply_markup: { remove_keyboard: true } });
}

// Send contact request message
export async function sendContactRequest(chatId: number): Promise<TelegramBot.Message> {
    const keyboard = createContactKeyboard();
    return sendMessage(
        chatId,
        '👋 Welcome to oneHR!\n\nTo continue, please share your phone number so we can verify your employee account.',
        keyboard
    );
}

// Send app link message with authentication data
export async function sendAppLink(
    chatId: number,
    phoneNumber: string,
    projectName: string,
    employeeUid: string
): Promise<TelegramBot.Message> {
    try {
        // Generate authentication token for the employee
        const authData = await generateEmployeeAuthToken(employeeUid, projectName, phoneNumber);

        // Generate app URL with authentication parameters
        const appUrl = generateAppUrl(
            phoneNumber,
            projectName,  // Use environment prefix instead of project ID
            employeeUid,
            authData.customToken
        );

        // Send success message with keyboard removal
        await sendMessage(
            chatId,
            '✅ Phone verified and linked to your employee account!',
            { remove_keyboard: true }
        );

        // Calculate expiration time (24 hours from now)
        // const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        // const formattedExpiration = expirationTime.toLocaleTimeString('en-US', {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: true,
        //     month: 'short',
        //     day: 'numeric'
        // });

        // Send app link with inline keyboard
        return sendMessage(
            chatId,
            `⬇️ Click below to open your oneHR dashboard:\n\n💡 Use /app if this doesn't work`,
            {
                inline_keyboard: [
                    [{ text: '🚀 Open oneHR App', web_app: { url: appUrl } }]
                ],
            }
        );
    } catch (error) {
        console.error('Error generating auth token for app link:', error);

        // Fallback: Generate basic URL without authentication
        const basicUrl = generateAppUrl(phoneNumber);

        // Send error message with keyboard removal
        await sendMessage(
            chatId,
            '✅ Phone verified! (Auto-login unavailable)',
            { remove_keyboard: true }
        );

        // Send basic app link
        return sendMessage(
            chatId,
            '⬇️ Click below to open your oneHR dashboard:\n\n💡 Use /app command to get a new authenticated link',
            {
                inline_keyboard: [
                    [{ text: '🚀 Open oneHR App', web_app: { url: basicUrl } }]
                ],
            }
        );
    }
}

// Phone number lookup across all Firebase projects
async function findEmployeeByPhoneNumber(phoneNumber: string): Promise<{ employee: { id: string; uid: string; [key: string]: unknown }; projectName: string } | null> {
    // Check cache first
    const cached = employeeCache.get(phoneNumber);
    if (cached) {
        console.log(`Cache hit for phone ${phoneNumber} in project ${cached.projectName}`);
        return { employee: cached.data as { id: string; uid: string; [key: string]: unknown }, projectName: cached.projectName };
    }

    const healthyDbs = await getHealthyDbInstances();
    console.log(`Searching for phone ${phoneNumber} across ${Object.keys(healthyDbs).length} Firebase projects`);

    for (const [projectName, db] of Object.entries(healthyDbs)) {
        try {
            const employeesRef = db.collection('employee');
            const query = await retryDatabaseOperation(async () => {
                return await employeesRef
                    .where('personalPhoneNumber', '==', phoneNumber)
                    .limit(1)
                    .get();
            }, 2, 1000, projectName);

            if (!query.empty) {
                const doc = query.docs[0];
                if (doc && doc.exists) {
                    const employee = { id: doc.id, uid: doc.data().uid, ...doc.data() };

                    // Cache the result
                    employeeCache.set(phoneNumber, employee, projectName);

                    console.log(`Found employee ${employee.id} (UID: ${employee.uid}) in project ${projectName}`);
                    return { employee, projectName };
                }
            }
        } catch (error) {
            console.error(`Error searching ${projectName}:`, error);
            continue;
        }
    }

    console.log(`Employee with phone ${phoneNumber} not found in any project`);
    return null;
}

// Update employee's telegramChatID
async function updateEmployeeTelegramChatID(employeeId: string, chatId: number, projectName: string): Promise<boolean> {
    const db = (await getHealthyDbInstances())[projectName];
    if (!db) {
        throw new Error(`Database for project ${projectName} is not healthy`);
    }

    try {
        await retryDatabaseOperation(async () => {
            return await db.collection('employee').doc(employeeId).update({
                telegramChatID: chatId.toString(),
                lastChanged: getTimestamp()
            });
        }, 2, 1000, projectName);

        console.log(`Updated telegramChatID for employee ${employeeId} in ${projectName}`);
        return true;
    } catch (error) {
        console.error(`Failed to update telegramChatID for employee ${employeeId}:`, error);
        return false;
    }
}

// Generate dynamic app URL with authentication parameters
// @param projectName - Environment prefix (e.g., "development", "dev"), not Firebase project ID
function generateAppUrl(
    phoneNumber: string,
    projectName?: string,
    employeeUid?: string,
    customToken?: string
): string {
    const baseUrl = process.env.WEB_APP_URL || 'https://your-default-app-url.com';
    const encodedPhone = encodeURIComponent(phoneNumber);
    const timestamp = Date.now();

    // Base URL with phone and timestamp
    let url = `${baseUrl}?phone=${encodedPhone}&t=${timestamp}`;

    // Add authentication parameters if available
    if (projectName) {
        url += `&pid=${encodeURIComponent(projectName)}`;
    }
    if (employeeUid) {
        url += `&uid=${encodeURIComponent(employeeUid)}`;
    }
    if (customToken) {
        url += `&token=${encodeURIComponent(customToken)}`;
    }

    return url;
}

// Handle contact sharing
async function handleContactShare(chatId: number, contact: Contact): Promise<void> {
    const phoneNumber = contact.phone_number;
    // Normalize phone number: remove spaces and special characters, ensure + prefix
    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;

    console.log(`Processing contact share for chat ${chatId}, phone: ${normalizedPhone}`);

    try {
        // Send initial verification message
        await sendMessage(chatId, '⏳ Please wait while we verify your phone number...');
        // Search for employee across all Firebase projects
        const result = await findEmployeeByPhoneNumber(normalizedPhone);

        if (result) {
            const { employee, projectName } = result;

            // Update employee's telegramChatID
            const updateSuccess = await updateEmployeeTelegramChatID(employee.id, chatId, projectName);

            if (updateSuccess) {
                // Store session data for future /app command usage
                chatSessions.set(chatId, {
                    phoneNumber: normalizedPhone,
                    projectName,
                    employeeUid: employee.uid,
                    employeeId: employee.id
                });

                // Send success message with app link (includes auth token generation)
                await sendAppLink(chatId, normalizedPhone, projectName, employee.uid);
                console.log(`Successfully linked employee ${employee.id} to chat ${chatId}`);
            } else {
                await sendMessage(chatId, '❌ Failed to link your account. Please try again or contact support.');
            }
        } else {
            // Employee not found
            await sendMessage(
                chatId,
                '❌ Employee account not found.\n\nPlease ensure you are sharing the same phone number registered in the HR system, or contact your HR administrator for assistance.',
                { remove_keyboard: true }
            );
        }
    } catch (error) {
        console.error('Error processing contact:', error);
        await sendMessage(
            chatId,
            '❌ An error occurred while processing your request. Please try again later.',
            { remove_keyboard: true }
        );
    }
}

// Initialize bot handlers
console.log('Initializing Telegram bot handlers...');


console.log('Telegram bot handlers initialized successfully');