// Bridge between the legacy Utils.message_notify / addToast signatures and
// Naive UI's message API. AppEntry.vue binds the api once in setup (via
// AppShellBridge); 30+ call sites stay untouched. Every message is also
// recorded into the toast history used by RecentMessagesPanel.
import { useAppStore } from '@/stores/AppStore';
import type { ToastMessage } from '@/stores/AppStore';
import { logger } from '@/common/logger';
import * as DatTypes from '@/utils/dataTypedef';

type MessageApi = {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
    info: (content: string) => void;
};

let messageApi: MessageApi | null = null;

export function bindMessage(api: MessageApi): void {
    messageApi = api;
}

function recordHistory(content: string, type: DatTypes.MessageShowType): void {
    const appStore = useAppStore();
    const toast: ToastMessage = { id: Date.now(), message: content, type, timestamp: Date.now() };
    appStore.historyToasts.push(toast);
    if (appStore.historyToasts.length > 100) {
        appStore.historyToasts.shift();
    }
}

export function message_notify(opts: { content: string; type?: DatTypes.MessageShowType | string }): void {
    const type = (opts.type ?? 'info') as DatTypes.MessageShowType;
    recordHistory(opts.content, type);
    if (!messageApi) {
        logger.debug(opts.content); // fallback: provider not mounted yet
        return;
    }
    if (type === 'success') messageApi.success(opts.content);
    else if (type === 'error') messageApi.error(opts.content);
    else if (type === 'warning') messageApi.warning(opts.content);
    else messageApi.info(opts.content);
}
