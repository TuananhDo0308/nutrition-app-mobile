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
    input_manual:`${authUrl}/api/food-items`,
    dailyPlanFood:(year:number, month:number, day:number)=>`${authUrl}/api/food-items?year=${year}&month=${month}&date=${day}`,
    dailyPlan:(year:number, month:number, day:number)=>`${authUrl}/api/dailyplans?year=${year}&month=${month}&date=${day}`,

  }
};

export default apiLinks;
