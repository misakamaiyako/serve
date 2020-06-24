import { Context, Next } from "koa";

export default function (ctx:Context, next:Next) {
	return next().catch(err => {
		ctx.throw(err.status, err.error)
	})
}
