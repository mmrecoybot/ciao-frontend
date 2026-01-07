module.exports = {
  apps: [
    {
      name: "shop",
      script: "npm",
      args: "start", // Command to start the app
      cwd: "/root/test/kabbomobileshop", // Replace with your app's directory
      env: {
        NODE_ENV: "production", // Set environment to production
      },
    },
  ],
};
