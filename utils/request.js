const Promise = require('es6-promise-min.js')
var ip = "www.zhiqushequ.cn";
var imgUrl = "https://" + ip;
var apiUrl = "https://" + ip + "/park_manage/api/";

/**封装promise */
function wxPromise(method, url, data, Type){
     url=apiUrl+url
  // console.log(Promise)
  // let contentType = Type  || 'application/x-www-form-urlencoded'
  // console.log(contentType)
    return new Promise(function(resolve,reject){
      // console.log(url)
      wx.request({
            url: url,
            method:method,
            data: data,
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success:function(res){
                //关闭加载loading弹窗
                // console.log(res)
                setTimeout(function () {
                    wx.hideLoading();
                }, 100);
                //请求成功
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
            },
            fail:function(res){
                setTimeout(function(){
                    wx.hideLoading();
                },100)
                wx.showModal({
                    title:'服务器暂时无法连接',
                    icon:'loading',
                    duration: 2000
                })
                reject(res)
            }
        })
    })
}

function getRequest(url, data){
  return wxPromise("GET", url, data); verification_code
}
  
function postRequest(url, data,type){
    return wxPromise("POST", url, data);
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