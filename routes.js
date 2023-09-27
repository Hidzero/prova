import express from "express";

const routes = express.Router();

routes.get("/", (req, res) => {
    res.json({ name: "Lucas" })
});

export { routes as default};

