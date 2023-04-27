"use strict";

const io = require("socket.io")(strapi.server.httpServer);

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {
    io.on("connection", async (socket) => {
      console.log(`User[${socket.id}] connected`);

      //new player, initialize
      socket.data.position = { x: 400, y: 300 };

      const sockets = await io.fetchSockets();
      const players = sockets.map((s) => {
        return { id: s.id, data: s.data };
      });

      //update client that player has joined
      io.emit("update", { action: "player_joined", players });

      socket.on("update", (msg) => {
        console.log("message: " + msg);
      });

      socket.on("player_move", (data) => {
        // console.log("player move: ", data);

        //update server data
        socket.data.position = { x: data.x, y: data.y };

        io.emit("update", {
          action: "move_player",
          id: data.id,
          x: data.x,
          y: data.y,
        });
      });

      socket.on("disconnect", async (reason) => {
        console.log(`user disconnected`);

        const sockets = await io.fetchSockets();
        const players = sockets.map((s) => {
          return { id: s.id, data: s.data };
        });

        io.emit("update", { action: "player_left", players });
      });
    });
  },
};
