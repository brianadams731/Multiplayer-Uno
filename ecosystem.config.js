module.exports = {
  apps : [{
    name: "app",
    script: "node ./out/app.js",
    instances: "1",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
