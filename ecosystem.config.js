module.exports = {
  apps : [{
    name   : "resumate",
    script : "node dist/server.js",
    env_production: {
	NODE_ENV: "production"
    }
  }]
}