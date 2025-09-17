export const userService = {
    getUser: async (userId: string) => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
  