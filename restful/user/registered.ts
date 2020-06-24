import dictionary from '../../uitls/dictionary';
import { local, secret } from '../../uitls/config';
import jwt from 'jsonwebtoken';
import { execute } from '../../uitls/MySQL';
import { ExtendableContext } from 'koa';
import { IRouterParamContext } from 'koa-router';
export async function registered(ctx: ExtendableContext & { state: any } & IRouterParamContext<any, {}>){
  const signId = ctx.query.signId;
  if (!signId) {
    ctx.status = 400;
    throw { status: 400, error: dictionary["400"][2][local] };
  }
  const id = jwt.verify(signId, secret.sign);
  const exist = await execute(`SELECT status FROM user WHERE id = ` + id)
  if (exist.length===0){
    ctx.status = 404;
    throw { status: 404, error: dictionary["404"][1][local] };
  }
  await execute("UPDATE user SET status = 1 WHERE id = " + id);
  ctx.status = 200;
  ctx.body = { id };
}
