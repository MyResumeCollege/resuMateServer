import express from 'express';
import fs from 'fs';
import { Server } from 'http';
import https from 'https';
import initApp from './app';
import path from 'path';

initApp()
  .then((app) => {
    let server: Server;
    let port: string | number = process.env.PORT || 3000;

    app.use("/public", express.static("public"));

    app.use("*", (_, res) => {
      res.sendFile("client/index.html", { root: "public" });
    });

    const httpServerOptions = {
      key: fs.readFileSync(path.resolve(__dirname, '../../certs/client-key2.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../certs/client-cert2.pem')),
    };
    server = https.createServer(httpServerOptions, app);

    server
      .listen(port, () => {
        console.log(`Server running on https://localhost:${port}`);
      })
      .on('error', (err) => {
        console.error('Error creating HTTP server:', err.message);
      });
  })
  .catch((error) => {
    console.error('Error initializing app:', error.message);
  });
