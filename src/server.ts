import initApp from './app';
import http, { Server } from 'http';

initApp()
  .then((app) => {
    let server: Server;
    let port: string | number = process.env.PORT || 3000;

    app.use("*", (_, res) => {
      res.sendFile("client/index.html", { root: "public" });
    });

    server = http.createServer(app);


    server
      .listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      })
      .on('error', (err) => {
        console.error('Error creating HTTP server:', err.message);
      });
  })
  .catch((error) => {
    console.error('Error initializing app:', error.message);
  });
