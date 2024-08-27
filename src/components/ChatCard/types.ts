import { ChatMessage } from '@/interfaces/chat.interface';
import { ChatCard } from '@/redux/chats.slice';

export type ChatCardPreviewData = ChatMessage | Pick<ChatCard, 'unReadedMsgs'>;
