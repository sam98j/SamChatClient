// chat Message interface
export interface ChatMessage {
    _id: string;
    text: string;
    senderId: string;
    receiverId: string;
    isReaded: boolean;
    date: string;
}