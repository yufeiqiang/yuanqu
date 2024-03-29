const Promise = require('es6-promise-min.js')
var ip = "www.zhiqushequ.cn";
// var ip = "192.168.0.65:8080";
var imgUrl = "https://" + ip;
var apiUrl = "https://" + ip + "/park_manage/api/";
var apiUrl2 = "https://" + ip + "/park_manage/query/";

/**封装promise */
function wxPromise(method, url, data, type=1){
    var Url=''
    if(type==1){
      Url=apiUrl+url
    }else if(type==2){
      Url=apiUrl2+url
    }
    return new Promise(function(resolve,reject){
      // console.log(url)
      wx.request({
            url: Url,
            method:method,
            data: data,
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success:function(res){
                //关闭加载loading弹窗
                // console.log(res)
                wx.hideLoading();
  
                //判断接口类型
                if(type==1){
                  if(res.data.code==200){
                      resolve(res.data)
                  }else{
                      //如果出现异常则弹出dialog
                      wx.showModal({
                          title: '提示',
                          content: res.data.msg + '',
                          confirmColor: '#118EDE',
                          showCancel: false,
                          success: function (res) {
                              // if (res.confirm) {
                                  
                              // }   
                          }
                      });
                      resolve(res.data)
                  }
                }else{
                  // console.log(res)
                  resolve(res.data)
                  // resolve(res)
                }
            },
            fail:function(res){
                console.log(res)
                setTimeout(function(){
                    wx.hideLoading();
                },100)
                wx.showModal({
                    title:'服务器发生错误',
                    icon:'loading',
                    duration: 2000
                })
                reject(res)
            }
        })
    })
}

function getRequest(url, data, type){
  return wxPromise("GET", url, data, type);
}
  
function postRequest(url, data, type){
    return wxPromise("POST", url, data, type);
}

module.exports = {
    wxPromise:wxPromise,
    getRequest:getRequest,
    postRequest:postRequest
}









































/** 判断是否为空 begin */
function isBlank(str) {
    // console.log(str)
    if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
      return true
    } else if (
      Object.prototype.toString.call(str) === '[object String]' ||
      Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
      return str.length == 0 ? true : false
    } else if (Object.prototype.toString.call(str) === '[object Object]') {
      return JSON.stringify(str) == '{}' ? true : false
    } else if (Object.prototype.toString.call(str) === '[object Number]') {
      return false
    } else if (Object.prototype.toString.call(str) === '[object Null]') {
      return true
    } else {
      return true
    }
}
// loading、success、error
function toast(title,oper,duration){
    if (!title) title = "";
    if (!duration) duration = 600;

    let icon = "success";
    let image = "";
    if (oper == "loading") icon = "loading";
    // else if (oper == "error") image = "/image/error_white_icon.png";
    wx.showToast({
        title: title,
        icon: icon,
        image: image,
        duration: duration,
        mask: true
    })
}