import { MessageStatus, MessagesTypes } from '@/interfaces/chat.interface';

// response shape
export interface ChatPreviewData {
  date: string;
  lastMsgText: string;
  unReadedMsgs: number;
  type: MessagesTypes;
  fileName: string | null;
  voiceNoteDuration: string;
  senderId: string;
  status: MessageStatus | null;
}

const useChatsApi = () => {
  const fetchChatPreviewData = async (chatUsrId: string): Promise<ChatPreviewData | null> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // access token
    const access_token = localStorage.getItem('access_token')!;
    const apiRes = await fetch(`${apiUrl}/messages/getchatpreviewdata/${chatUsrId}`, {
      method: 'GET',
      headers: { authorization: access_token },
    });
    // check for server err
    if (apiRes.status >= 500 || apiRes.status >= 400) {
      return null;
    }
    return (await apiRes.json()) as ChatPreviewData;
  };
  return { fetchChatPreviewData };
};

export default useChatsApi;
