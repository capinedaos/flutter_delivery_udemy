const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const passport = require("passport");
const io = require("socket.io")(server);
const mercadopago = require("mercadopago");

/*
 * MERCADO PAGO CONFIGUARCION
 */
mercadopago.configure({
  access_token:
    "TEST-7920627250737983-120400-8c64cd91465fbcc1a55c8bc3165343b7-240977983",
});

/*
 * SOCKETS
 */
const orderDeliverySocket = require("./sockets/orders_delivery_socket");

/*
 * INICIALIZAR FIREBASE ADMIN
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const upload = multer({
  storage: multer.memoryStorage(),
});

/*
 * RUTAS
 */
const users = require("./routes/usersRoutes");
const categories = require("./routes/categoriesRoutes");
const products = require("./routes/productsRoutes");
const address = require("./routes/addressRoutes");
const orders = require("./routes/ordersRoutes");
const mercadoPagoRoutes = require("./routes/mercadoPagoRoutes");

const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.disable("x-powered-by");

app.set("port", port);

// LLAMAR A LOS SOCKETS
orderDeliverySocket(io);

/*
 * LLAMANDO A LA RUTAS
 */
users(app, upload);
categories(app);
address(app);
orders(app);
products(app, upload);
mercadoPagoRoutes(app);

server.listen(3000, "192.168.1.115" || "localhost", function () {
  console.log("Aplicacion de NodeJS " + port + " Iniciada...");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server,
};

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR
