export const saveUsers = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };
  
  export const getUsers = (): any[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };
  