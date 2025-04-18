const authUrl = 'http://localhost:8000';

const apiLinks = {
  authentication:{
    signUp: `${authUrl}/api/user/registration`,
    signIn: `${authUrl}/signin`,
    signOut: `${authUrl}/signout`,
    refreshToken: `${authUrl}/refresh-token`,
  },
  homepage: {
  }
};

export default apiLinks;
