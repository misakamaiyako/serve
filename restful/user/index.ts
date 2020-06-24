import Router from 'koa-router';
import { userDetail, userInfo } from './user';
import { registered } from './registered';
const user = new Router();
user.prefix('/user')
user.get('/user', async (ctx, next) =>{
  await userInfo(ctx)
  await next()
})
user.get('/user/:id', async (ctx ,next)=>{
  await userDetail(ctx)
  await next()
})
user.get('/registered',async (ctx,next)=>{
  await registered(ctx)
})
export default user
