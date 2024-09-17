// export const fetchUser = () => {
//     const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();


//     return userInfo
// }
export const fetchUser = async () => {
    try {
      const userString = localStorage.getItem('user');
      
      // Check if the userString is not 'undefined' before parsing
      const userInfo = userString !== 'undefined' ? JSON.parse(userString) : null;
  
      // Simulate an asynchronous operation (e.g., an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      return userInfo;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error; // Rethrow the error to handle it in the calling code if needed
    }
  };
  