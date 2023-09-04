const useChatsApi = () => {
    const fetchChatPreviewData = async (
        chatUsrId: string
    ): Promise<{
        date: string;
        lastMsgText: string;
        unReadedMsgs: number;
        isItTextMsg: boolean
    } | null> => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // access token
        const access_token = localStorage.getItem('access_token')!;
        const apiRes = await fetch(
            `${apiUrl}/messages/getchatpreviewdata/${chatUsrId}`,
            {
                method: 'GET',
                headers: { authorization: access_token },
            }
        );
        // check for server err
        if (apiRes.status >= 500 || apiRes.status >= 400) {
            return null;
        }
        return (await apiRes.json()) as {
            date: string;
            lastMsgText: string;
            unReadedMsgs: number;
            isItTextMsg: boolean
        };
    };
    return { fetchChatPreviewData };
};

export default useChatsApi;
