module.exports = {
  afterCreate(event) {
    const { result, params } = event;

    // do something to the result;
    console.log("game created!", result);
    strapi.io.emit("onchange", { action: "server updated" });
  },
  afterUpdate(event) {
    const { result, params } = event;

    // do something to the result;
    console.log("game updated!", result);
    strapi.io.emit("onchange", { action: "server updated" });
  },
};
