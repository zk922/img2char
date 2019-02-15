import * as Koa from "koa";
import * as Router from "koa-router";
import * as cp from "child_process";
import * as path from "path";
import image2char from "../src/img2char";

let app: Koa = new Koa();
let router = new Router();
router.get('/', async function (ctx, next) {
  ctx.status = 200;
  ctx.response.set('content-type', 'application/json');


  ctx.body = await image2char(path.resolve(__dirname, '../timg.jpg'));


  await next();
});

app.use(router.routes());

app.listen(8888, () => {
  console.log('server is running at port 8888');
  cp.exec('explorer http://localhost:8888');
});
