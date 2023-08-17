import React from 'react'

const useUsersApi = () => {
    const fetchUsers = async (searchqr: string) => {
        // access token
        const access_token = localStorage.getItem("access_token")!
        const apiRes = await fetch(`http://localhost:2000/users/${searchqr}`, {
            method: "GET", headers: {authorization: access_token}
        });
        // check for server err
        if(apiRes.status >= 500 || apiRes.status >= 400){
            return []
        }
        return await apiRes.json()
    }
  return {fetchUsers}
}

export default useUsersApi