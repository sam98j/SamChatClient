import { ChatMember, ResponseToMessageData } from '@/redux/chats.slice';

export enum MessageStatus {
  'SENT' = 'SENT',
  'DELEVERED' = 'DELEVERED',
  'READED' = 'READED',
}
// chat user actions
export enum ChatActionsTypes {
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
  replyTo: string | null;
  msgReplyedTo: ResponseToMessageData | null;
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
  msgIDs: string[];
  msgStatus: MessageStatus;
  chatId: string;
  senderIDs?: string[];
}
