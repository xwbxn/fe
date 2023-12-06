/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
export enum ChartType {
  Line = 'line',
  Pie = 'pie',
  Bar = 'bar',
}


export function isNumberArray(s: any): s is number[] {
  if (s.length) {
    return typeof s[0] === 'number';
  } else {
    return true;
  }
}
export function byteCompute (limit:number):any {
  if (!limit || Number(limit) == 0) return ''
  let result :any[] = [3];
  limit = Number(limit)
  // 将size B转换成 M
  var size = ''
  if (limit < 1 * 1024) {
      //小于1KB，则转化成B
      size = limit.toFixed(2)
      result[0] ="B"
      result[1] = 1;
  } else if (limit < 1 * 1024 * 1024) {
      //小于1MB，则转化成KB
      size = (limit / 1024).toFixed(2)
      result[0] =  'KB';
      result[1] = 1024;
  } else if (limit < 1 * 1024 * 1024 * 1024) {
      //小于1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2)
      result[1] = 1024 * 1024;
      result[0] =  'MB'
  } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2)
      result[1] = 1024 * 1024* 1024;
      result[0] =  'GB'
  }
  var sizeStr = size + '' //转成字符串
  var index = sizeStr.indexOf('.') //获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == '00') {
      //判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  result[2] =size;
  return result;
}

export function bitCompute (limit:number):any {
  let result :any[] = [3];
  if (!limit || Number(limit) == 0) return ''  
  limit = Number(limit)
  // 将size B转换成 M
  var size = ''
  if (limit < 1 * 1024) {
      //小于1KB，则转化成B
      size = limit.toFixed(2)
      result[0] ="B"
      result[1] = 1;
  } else if (limit < 1 * 1000 * 1000) {
      //小于1MB，则转化成KB
      size = (limit / 1000).toFixed(2);
      result[0] ="KB"
      result[1] = 1000;
  } else if (limit < 1 * 1000 * 1000 * 1000) {
      //小于1GB，则转化成MB
      size = (limit / (1000 * 1000)).toFixed(2)
      result[0] ="MB"
      result[1] = 1000 * 1000;
  } else {
      //其他转化成GB
      size = (limit / (1000 * 1000 * 1000)).toFixed(2)
      result[0] ="GB";
      result[1] = 1000 * 1000 * 1000;
  }
  var sizeStr = size + '' //转成字符串
  var index = sizeStr.indexOf('.') //获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == '00') {
      //判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  result[2] =size;
  return result;
}

export function byteMaxNumber (limit:number[]) :number {
  return Math.max(...limit); 
}
export function formatPercentZeroT1(limit:number):any {
  if (!limit || Number(limit) == 0) return '' 
  limit = Number(limit*100)
  return limit.toFixed(2)+'%';
}

export function  fomartTime (value:any):any {
  let unit=['分钟','小时','天'],
 
  day=0,hour=0,min=0,second=0,returnStr="",
  
  arrVal=value.toString().split(".");
  if(arrVal.length>1){
     second=parseFloat("0."+arrVal[1]);
     second*=60;
     value=parseInt(arrVal[0]);
  }
  returnStr=value+unit[0];
  if(value>=60){
      hour=parseInt(""+(value/60));
      min=value%60;
  }
  if(hour){
     returnStr=hour+unit[1];
     if(min){
         returnStr+=min+unit[0]
     }
  }
  if(second){
      returnStr+=second.toFixed(0)+'秒'
  }
   return returnStr
}
export function formatSeconds(value):any {
  
  let returns :any[] = [2];

  if (!value || Number(value) == 0) return ''
  if(value< 1){
     return value;
  }
  //  秒
  let second:number = parseInt(value)
  //  分
  let minute:number = 0
  //  小时
  let hour:number = 0
  //  天
   let day = 0
  //  如果秒数大于60，将秒数转换成整数
  if (second > 60) {
    //  获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(""+(second / 60))
    //  获取秒数，秒数取佘，得到整数秒数
    second = parseInt(""+(second % 60))
    //  如果分钟大于60，将分钟转换成小时
    if (minute > 60) {
      //  获取小时，获取分钟除以60，得到整数小时
      hour = parseInt(""+(minute / 60))
      //  获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(""+(minute % 60))
      //  如果小时大于24，将小时转换成天
       if (hour > 23) {
         //  获取天数，获取小时除以24，得到整天数
         day = parseInt(""+(hour / 2))
         //  获取天数后取余的小时，获取小时除以24取余的小时
         hour = parseInt(""+(hour % 24))
       }
    }
  }

  let result = '' + parseInt(""+second) + '秒'
  returns[0] = '秒'
  if (minute > 0) {
    result = '' + parseInt(""+minute) + '分' + result
    returns[0] = '分'
  }
  if (hour > 0) {
    result = '' + parseInt(""+hour) + '小时' + result
    returns[0] = '小时'
  }
   if (day > 0) {
     result = '' + parseInt(""+day) + '天' + result
     returns[0] = '天'
   }
  console.log('result：', result)
  returns[1] =result;
  return returns;
}

export function formatSecondToTime(value):any { 
  if (!value || Number(value) == 0) return ''
  if(value< 1){
     return value;
  }
  //  秒
  let second:number = parseInt(value)
  //  分
  let minute:number = 0
  //  小时
  let hour:number = 0
  //  天
   let day = 0
  //  如果秒数大于60，将秒数转换成整数
  if (second > 60) {
    //  获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(""+(second / 60))
    //  获取秒数，秒数取佘，得到整数秒数
    second = parseInt(""+(second % 60))
    //  如果分钟大于60，将分钟转换成小时
    if (minute > 60) {
      //  获取小时，获取分钟除以60，得到整数小时
      hour = parseInt(""+(minute / 60))
      //  获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(""+(minute % 60))
      //  如果小时大于24，将小时转换成天
       if (hour > 23) {
         //  获取天数，获取小时除以24，得到整天数
         day = parseInt(""+(hour / 2))
         //  获取天数后取余的小时，获取小时除以24取余的小时
         hour = parseInt(""+(hour % 24))
       }
    }
  }

  let result = '' + parseInt(""+second)+ '秒'
  if (minute > 0) {
    result = '' + parseInt(""+minute) + '分钟' + result
  }
  if (hour > 0) {
    result = '' + parseInt(""+hour) + '小时' + result
  }
   if (day > 0) {
     result = '' + parseInt(""+day) + '天' + result
   }
  return result;
}
