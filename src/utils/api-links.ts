const authUrl = 'https://chat.aaateammm.online';
const aihUrl = 'https://d017-109-147-209-34.ngrok-free.app';

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
    weekly:`${authUrl}/api/dailyplans/weekly`,
    dailyPlanFood:(year:number, month:number, day:number)=>`${authUrl}/api/food-items?year=${year}&month=${month}&date=${day}`,
    dailyPlan:(year:number, month:number, day:number)=>`${authUrl}/api/dailyplans?year=${year}&month=${month}&date=${day}`,
    postAi:`${aihUrl}/food-mass/`,
    postAiList:`${aihUrl}/food-nutrition/`,

  }
};

export default apiLinks;
