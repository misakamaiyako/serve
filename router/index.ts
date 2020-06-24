import Router from "koa-router";
import { createReadStream } from "fs";
import token from "jsonwebtoken";
import path from "path";
import crypto from "crypto";

import sendEmail from "../uitls/sendEmail";
import dictionary from "../uitls/dictionary";
import user from "../restful/user";
import { execute } from "../uitls/MySQL";
import { host, local, noControl, secret } from "../uitls/config";
import { EmailRegexp } from "../uitls/regex";

const router = new Router();
router.get(/^\/*/, async (ctx, next) => {
  if (
    noControl.findIndex(t => t.test(ctx.request.url)) === -1 &&
    !ctx.state.user
  ) {
    switch (ctx.accepts("html", "json", "txt")) {
      case "html":
        ctx.redirect("/login");
        break;
      default:
        throw { status: 401, error: dictionary["401"][0][local] };
    }
    return;
  }
  await next();
});
router.post(/^\/*/, async (ctx, next) => {
  if (
    noControl.findIndex(t => t.test(ctx.request.url)) === -1 &&
    !ctx.state.user
  ) {
    throw { status: 401, error: dictionary["401"][0][local] };
  }
  await next();
});
// root level api will be processed here, others will be distributed
router.get("/login", async ctx => {
  if (ctx.state.user) {
    ctx.redirect("/");
    return;
  } else {
    ctx.type = "html";
    ctx.body = createReadStream(
      path.resolve(__dirname, "../static/login.html")
    );
  }
});
router.get("/logout", async ctx => {
  ctx.cookies.set("Authorization", "");
  ctx.redirect("/login");
});
router.post("/login", async ctx => {
  const body = ctx.request.body;
  const hash = crypto.createHash("sha256");
  hash.update(body.password);
  const result = await execute(
    `SELECT * FROM user WHERE email = '${
      body.email
    }' AND password = '${hash.digest("hex")}'`
  );
  if (result.length === 0) {
    throw { status: 409, error: dictionary["409"][0][local] };
  } else {
    ctx.cookies.set(
      "Authorization",
      token.sign(result[0].id, secret.login, { expiresIn: "7d" })
    );
    ctx.status = 200;
    ctx.body = result[0];
  }
});
router.post("/registered", async ctx => {
  const userInfo = ctx.request.body;
  const { email, password } = userInfo;
  if (!email || !password) {
    throw { status: 400, error: dictionary["400"][1][local] };
  }
  if (EmailRegexp.test(email)) {
    const existTest = await execute(
      `SELECT status FROM user WHERE email = '${email}'`
    );
    if (existTest.length > 0) {
      if (existTest[0].status === 2) {
      }
      throw { status: 409, error: dictionary["409"][0][local] };
    }
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const results = await execute(`INSERT INTO user
		(name, email, password, status) VALUES
		("${userInfo.name || null}", "${email}", "${hash.digest("hex")}",2)`);
    const oneTImeToken = token.sign(results.insertId, secret.sign);
    await sendEmail(
      email,
      "邮箱验证",
      `<a href='${host +
        "/registered?signId=" +
        oneTImeToken}' target=_blank>点击这里激活你的账户</a>`
    );
    ctx.status = 200;
    ctx.body = {};
  } else {
    throw { status: 400, error: dictionary["400"][1][local] };
  }
});
router.all(/^\/user/, user.routes(), user.allowedMethods());
export default router;
