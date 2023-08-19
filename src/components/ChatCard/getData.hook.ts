import React from 'react'

const useChatsApi = () => {
    const fetchChatPreviewData = async (chatUsrId: string): Promise<{date: string, lastMsgText: string, unReadedMsgs: number} | null> => {
        // access token
        const access_token = localStorage.getItem("access_token")!
        const apiRes = await fetch(`http://localhost:2000/messages/getchatpreviewdata/${chatUsrId}`, {
            method: "GET", headers: {authorization: access_token}
        });
        // check for server err
        if(apiRes.status >= 500 || apiRes.status >= 400){
            return null
        }
        return await apiRes.json() as {date: string, lastMsgText: string, unReadedMsgs: number}
    }
  return {fetchChatPreviewData}
}

export default useChatsApi