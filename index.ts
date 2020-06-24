import Koa from "koa";
import koaBody from 'koa-body';
const jwt = require("koa-jwt");

import router from "./router";
import statusController from "./middleware/statusControll";
import {init} from "./uitls/MySQL";
import {secret} from "./uitls/config";

const app = new Koa();
init();
app.use(koaBody())
app.use(statusController)
app.use(jwt({ secret: secret.login, cookie: 'Authorization', passthrough: true }));
app.use(router.routes());
app.listen(3000);
console.log("server started");
