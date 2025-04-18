
interface User {
  email: string;
  password: string;
}

export const authService = {
  signup: (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user exists
    if (users.some((user: User) => user.email === email)) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return newUser;
  },

  login: (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: User) => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  googleLogin: (credentialResponse: any) => {
    localStorage.setItem("user", JSON.stringify(credentialResponse));
    return credentialResponse;
  },

  checkAuth: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};
