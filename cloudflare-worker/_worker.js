export default {
  async scheduled(event, env, ctx) {
    const urls = [
      "https://euonroia-secured.onrender.com", // Replace this with your Render URL
    ];

    await Promise.all(urls.map(url => fetch(url)));
    console.log("Pinged:", urls.join(", "));
  },
};
