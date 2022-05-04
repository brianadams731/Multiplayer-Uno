import express from "express";
import path from "path";

const staticRoutes = express.Router();

staticRoutes.get('/', (req, res) => {
    return res.sendFile("index.html", { root : path.join(__dirname, '../../public/')});
});
staticRoutes.get('/login', (req, res) => {
    return res.sendFile("login.html", { root : path.join(__dirname, '../../public/')});
});
staticRoutes.get('/register', (req, res) => {
    return res.sendFile("register.html", { root : path.join(__dirname, '../../public/')});
});
staticRoutes.get('/about', (req, res) => {
    return res.sendFile("index.html", { root : path.join(__dirname, '../../public/')});
});
staticRoutes.get('/templobby', (req, res) => {
    return res.sendFile("templobby.html", { root : path.join(__dirname, '../../public/')});
});

export { staticRoutes };