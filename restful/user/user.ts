import { ExtendableContext } from "koa";
import { IRouterParamContext } from "koa-router";
import dictionary from "../../uitls/dictionary";
import { local } from "../../uitls/config";
import { execute } from "../../uitls/MySQL";
import stitching from "../../uitls/stitching";

export async function userInfo(
  ctx: ExtendableContext & { state: any } & IRouterParamContext<any, {}>
) {
  const query = ctx.request.query;
  let sql: string =
    "select id,type,name,email,sex,avatar,settings,comment from user ";
  let page = 1;
  if (Object.keys(query).length === 1 && query.email) {
    sql += `where email = '${query.email}' limit 1 `;
  } else if (!ctx.state.user) {
    throw { status: 401, error: dictionary["401"][0][local] };
  } else {
    sql += stitching(query);
  }
  ctx.body = {
    result: await execute(sql),
    count: (await execute("SELECT FOUND_ROWS() as total;"))[0].total,
    page: page
  };
  ctx.status = 200;
}
export async function userDetail(
  ctx: ExtendableContext & { state: any } & IRouterParamContext<any, {}>
) {
  const id = ctx.params.id;
  const result = await execute("SELECT id,type,name,email,sex,avatar,settings,comment FROM user WHERE id = " + id);
  ctx.body = result[0]||{};
  ctx.status = result.length > 0 ? 200 : 404;
}
