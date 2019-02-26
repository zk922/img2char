import * as Koa from "koa";
import * as Router from "koa-router";
import * as cp from "child_process";
import * as path from "path";
import * as koaStatic from "koa-static";
import * as bodyParser from "koa-bodyparser";
import image2char from "../src/img2char";

let app: Koa = new Koa();

app.use(koaStatic(path.resolve(__dirname, './www'), {maxAge: 7*24*60*60*1000}));

app.use(bodyParser({
  enableTypes: ['json', 'form', 'text']
}));

let router = new Router();
router.post('/convert', async function (ctx, next) {

  let params = ctx.request.body;
  // ctx.response.set('content-type', 'application/json');
  if(params.outputMode === 'char'){
    ctx.response.set('content-type', 'text/plain; charset=utf-8');
  }
  else if(params.outputMode === 'img'){
    ctx.response.set('content-type', 'image/png; charset=utf-8');
  }
  ctx.body = await image2char(params.img, {outputMode: params.outputMode});
  ctx.status = 200;
  await next();
});


app.use(router.routes());

app.listen(8888, () => {
  console.log('server is running at port 8888');
  cp.exec('explorer http://localhost:8888');
});
