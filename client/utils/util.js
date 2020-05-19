let getRandom = (count) => {
    let arr = [];
    for (let i = 0; i< count; i++) {
        let temp = Math.floor(Math.random()*100000);
        while (arr.findIndex(item => item === temp) !== -1) {
            temp = Math.floor(Math.random()*100000);
        }
        arr[i] = temp;
    }
    return arr.toString();
}

let unitConverter = (num) => {
  if (!num || isNaN(num)) {
    return '请传入数值格式的数据'
  }
  // 此处为防止字符串形式的数值进来，因为toFixed方法只能用于数值型数
  num = Number(num)
  if (Math.abs(num) > 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (Math.abs(num) > 10000) {
    return (num / 10000).toFixed(2) + '万'
  } else {
    return num
  }
}

let visitByPhone = () => {
  // 判断是否被手机访问
  let u = navigator.userAgent;
  let Agents = [
    'Android',
    'iPhone',
    'webOS',
    'BlackBerry',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  ];
  let flag = false;
  for (let i = 0; i < Agents.length; i++) {
    if (u.indexOf(Agents[i]) > 0) {
      flag = true;
      break;
    }
  }
  return flag;
}

export default {
    getRandom,
    unitConverter,
    visitByPhone
}