import * as Jimp from "jimp";
import * as p from "path";
import defaultConfig from "./defaultconfig";


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

async function img2char(path, charConfig = {}) {//path支持路径或者图片文件buffer
  const image: Jimp = await Jimp.read(path), //源文件Jimp对象
        mime = image.getMIME(),
        config = Object.assign({}, defaultConfig, charConfig);  //转换配置
  const width = image.getWidth(),
        height = image.getHeight();

  if(mime.match(/jpe?g|png/)){
    //1. jp(e)g与png使用Jimp解析
    const output: Jimp = await createOutputImage(width, height, config);


    //1.1 图片分块，m为横向分的块数，n为纵向分的块数
    const m = Math.ceil(width/config.fontPlaceHoldWidth),
          n = Math.ceil(height/config.fontPlaceHoldHeight);

    //1.2 转成m*n的灰度图
    image.grayscale().resize(m, n);
    const imageData = image.bitmap.data;
    let str = '';
    //1.3 从左到右依次填充每一个区块
    for(let j = 0; j < n; j++){
      for(let i = 0; i < m; i++){
        //x, y为该区块中心像素点坐标
        let index = image.getPixelIndex(i, j);
        str += config.greyScaleTable.charAt(Math.ceil(imageData[index]/255*config.greyScaleTable.length));
      }
      str += '\n';
    }

    return str;
  }
  else if(mime.match(/gif/)){
    //2. gif使用omggif进行解析，因为Jimp不支持动画gif
    return 2;
  }
  else{
    throw new Error('mime type not supported');
  }
}

export default img2char;
