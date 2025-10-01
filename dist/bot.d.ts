import { InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from './types/telegram';
import TelegramBot from 'node-telegram-bot-api';
export declare function createContactKeyboard(): ReplyKeyboardMarkup;
export declare function sendMessage(chatId: number, text: string, keyboard?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | {
    remove_keyboard: true;
}): Promise<TelegramBot.Message>;
export declare function removeKeyboard(chatId: number): Promise<TelegramBot.Message>;
export declare function sendContactRequest(chatId: number): Promise<TelegramBot.Message>;
export declare function sendAppLink(chatId: number, appUrl: string): Promise<TelegramBot.Message>;
//# sourceMappingURL=bot.d.ts.map