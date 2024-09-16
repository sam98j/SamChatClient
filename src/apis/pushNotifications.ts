export const saveSubscription = async (subscription: PushSubscription) => {
  // api url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/users/save-subscription`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      authorization: localStorage.getItem('access_token')!,
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

export const deleteSubscription = async () => {
  // api url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/users/delete_push_sub`, {
    method: 'delete',
    headers: {
      authorization: localStorage.getItem('access_token')!,
    },
  });
  return response.json();
};
