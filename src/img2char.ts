import * as Jimp from "jimp";
import * as p from "path";
import defaultConfig from "./defaultconfig";
import {promises} from "fs";

/**=========================================  通用工具函数 ================================================**/
//创建空白图片用来返回
function createOutputImage(width: number, height: number, config: any): Promise<Jimp>{
  return new Promise<Jimp>((resolve, reject) => {
    new Jimp(width, height, config.backgroundColor, function (err, image) {
      if(err){
        reject(err);
        return;
      }
      resolve(image);
    });
  });
}
/**=========================================  通用工具函数end ================================================**/


/**=========================================  三个主函数 ================================================**/

/**
 * 1. 处理单帧图片png | jpe?g
 * 单帧图片使用Jimp处理，根据config，返回纯字符或者图片
 * @param image  Jimp图片数据
 * @param config 处理的配置项目
 * **/
async function oneFrameImg(image: Jimp, config): Promise<Buffer | string> {
  const width = image.getWidth(),
        height = image.getHeight();
  //1. 图片分块，m为横向分的块数，n为纵向分的块数
  const m = Math.ceil(width/config.fontPlaceHoldWidth),
        n = Math.ceil(height/config.fontPlaceHoldHeight);
  //2. 转成m*n的灰度图
  image.grayscale().resize(m, n);
  const imageData = image.bitmap.data;

  //3. 判断输出类型
  if(config.outputMode === 'img'){
    //3.1 仅在指明输出类型为'img'时候输出图片
    let output = await createOutputImage(width, height, config);

    let font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);

    for(let j = 0; j < n; j++){
      for(let i = 0; i < m; i++){
        let index = image.getPixelIndex(i, j);
        let char = config.greyScaleTable.charAt(Math.ceil(imageData[index]/255*config.greyScaleTable.length));
        output.print(font, i*config.fontPlaceHoldWidth, j*config.fontPlaceHoldHeight ,{
          text: char,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, config.fontPlaceHoldWidth, config.fontPlaceHoldHeight);
      }
    }

    return output.getBufferAsync(Jimp.MIME_PNG);
  }
  else{
    //3.2 输出纯字符
    let str = '';
    for(let j = 0; j < n; j++){
      for(let i = 0; i < m; i++){
        let index = image.getPixelIndex(i, j);
        str += config.greyScaleTable.charAt(Math.ceil(imageData[index]/255*config.greyScaleTable.length) - 1);
      }
      j !== n-1 && (str += '\n');
    }
    return str;
  }
}

/**
 * 2. 处理gif
 * gif使用omggif处理
 * @param {Jimp}image
 * @param {?}config
 * **/
function animatedGif(image: Jimp, config){

}

/**
 * 导出的主函数
 * **/
async function img2char(path, charConfig = {}): Promise<string | Buffer> {  //path支持路径或者图片文件buffer
  const image: Jimp = await Jimp.read(path),      //源文件Jimp对象
        mime = image.getMIME(),
        config = Object.assign({}, defaultConfig, charConfig);  //转换配置
  //1. jp(e)g与png使用Jimp解析
  if(mime.match(/jpe?g|png/)){
    return oneFrameImg(image, config);
  }
  //2. gif使用omggif进行解析，因为Jimp不支持动画gif
  else if(mime.match(/gif/)){

    return '暂不支持gif';
  }
  //3. 其他图片类型暂不支持
  else{
    throw new Error('mime type not supported');
  }
}
/**=========================================  三个主函数end ================================================**/

export default img2char;

