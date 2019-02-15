//转成字符时候的默认配置
const defaultConfig = {
  //仅输出图片时候使用
  fontFamily: null,
  fontSize: 1,
  fontPlaceHoldWidth: 12,  //一个字符占用原图上的像素宽度，越小输出的越清晰
  fontPlaceHoldHeight: 24, //一个字符占用原图上的像素高度，一般来说，字符行高是宽度占用的2倍，所以是2倍上面值才能保证不变形
  fontColor: '#999999',
  backgroundColor: 0x00000000,
  greyScaleTable: "@#&$%*o!;. "   //灰度从深到浅的替换字符，最后一个字符一般为"空格"效果更好
};

export default defaultConfig;
