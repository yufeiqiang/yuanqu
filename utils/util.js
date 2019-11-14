const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const timeSlot = (startTime,endTime,type)=>{
  var taskTime = '';
  if(type == '元/小时') {
    taskTime = GetDateDiff(startTime, endTime, 'hour')
  } else if (type == '元/天') {
    taskTime = GetDateDiff(startTime, endTime, 'day')
  } else if (type == '元/位/月' || type == '元/月' || type == '元/个/月') {
    taskTime = getIntervalMonth(ConvertDateFromString(startTime),ConvertDateFromString(endTime))
  }
  return taskTime
}
/**
 * 计算小时，天数差
 */
function GetDateDiff(startTime, endTime, diffType) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
  if (startTime.indexOf(".") != -1) startTime = startTime.substring(0, startTime.indexOf("."));
  if (endTime.indexOf(".") != -1) endTime = endTime.substring(0, endTime.indexOf("."));
  startTime = startTime.replace(/\-/g, "/");
  endTime = endTime.replace(/\-/g, "/");
  //将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();
  var sTime = new Date(startTime); //开始时间
  var eTime = new Date(endTime); //结束时间
  //作为除数的数字
  var timeType = 1;
  switch (diffType) {
    case "second":
      timeType = 1000;
      break;
    case "minute":
      timeType = 1000 * 60;
      break;
    case "hour":
      timeType = 1000 * 3600;
      break;
    case "day":
      timeType = 1000 * 3600 * 24;
      break;
    default:
      break;
  }
  return Math.ceil((eTime.getTime() - sTime.getTime()) / parseInt(timeType));;
}
/**
 * 计算月份差
 */
function getIntervalMonth(startDate, endDate) {
  var startMonth = startDate.getMonth();
  var endMonth = endDate.getMonth();
  var startDay = startDate.getDate();
  var endDay = endDate.getDate();
  var intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
  intervalMonth = Math.abs(intervalMonth);
  if (endDay > startDay) intervalMonth += 1;
  return intervalMonth;
}
/**
 * 将时间转为标准时间
 */
function ConvertDateFromString(dateString) {
  if (dateString) {
    var arr1 = dateString.split(" ");
    var sdate = arr1[0].split('-');
    var date = new Date(sdate[0], sdate[1], sdate[2]);
    return date;
  }
}
module.exports = {
  formatTime: formatTime,
  timeSlot: timeSlot
}
