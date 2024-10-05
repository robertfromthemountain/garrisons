import apiClient from '@/utils/apiClient';

export const fetchUserId = async (store, user) => {
  if (!store.getters.isLoggedIn) return;

  try {
    const response = await apiClient.get("http://localhost:5000/api/user", {
      headers: {
        Authorization: `Bearer ${store.getters.accessToken}`,
      },
    });
    
    user.value = {
      id: response.data.userId,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
    };
    
    console.log("Fetched user details:", user.value);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};
