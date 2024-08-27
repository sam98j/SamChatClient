import { ChatMember } from '@/redux/chats.slice';

export enum MessageStatus {
  'SENT' = 'SENT',
  'DELEVERED' = 'DELEVERED',
  'READED' = 'READED',
}
// chat user actions
export enum ChatUserActions {
  'TYPEING' = 'TYPEING',
  'RECORDING_VOICE' = 'RECORDING_VOICE',
}
// message types
export enum MessagesTypes {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  PHOTO = 'PHOTO',
  FILE = 'FILE',
  VOICENOTE = 'VOICENOTE',
}
// chat Message interface
export interface ChatMessage {
  _id: string;
  content: string;
  type: MessagesTypes;
  sender: ChatMember;
  fileName: string | null;
  fileSize: string | null;
  receiverId: string;
  status: MessageStatus | null;
  date: string;
  voiceNoteDuration: string;
}
// get chat messages response
export interface GetChatMessagesRes {
  chatMessages: ChatMessage[];
  isLastBatch: boolean;
}

// ChangeMessageStatusDTO
export interface ChangeMessageStatusDTO {
  chatId: string;
  msgId: string;
  senderId: string;
}
