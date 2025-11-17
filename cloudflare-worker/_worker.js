export default {
  async scheduled(event, env, ctx) {
    const url = "https://euonroia.onrender.com/ping"; // Replace with your Render URL
    await fetch(url);
    console.log(`Pinged: ${url}`);
  },
};
