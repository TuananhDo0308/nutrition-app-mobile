const authUrl = 'https://chat.aaateammm.online';

const apiLinks = {
  authentication:{
    signUp: `${authUrl}/api/user/registration`,
    signIn: `${authUrl}/api/user/authentication`,
    signOut: `${authUrl}/signout`,
    refreshToken: `${authUrl}/refresh-token`,
  },
  questions:{
    base_information: `${authUrl}/api/user/information`,
    time: `${authUrl}/api/user/time`
  },
  food: {
    input_manual:`${authUrl}/api/food-items`
  }
};

export default apiLinks;
