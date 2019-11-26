//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // console.log(logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // console.log()
    this.getInfoData()
    wx.cloud.init({
      traceUser:true
    })
    wx.cloud.callFunction({
      name: 'msgSecCheck', data: {
        text: '特3456书yuuo莞6543李zxcz蒜7782法fgnv级完2347全dfji试3726测asad感3847知qwez到'  }
    }).then(res => {
      console.log(res)
      if (res.result.code == "200") {   
        console.log()
      } else {  //执行不通过
        // var v_content = res.result.msg;
        // console.log(res)
        // return wx.showModal({ title: "提示", content: v_content, showCancel: false, confirmText: "确定", });
        //return false;
      }
    })
  },
  getInfoData:function(){
    /**获取用登录信息 */
    let userData=wx.getStorageSync('user');
    if(userData!=''){
      let user = JSON.parse(userData || null);
      this.globalData.user = user
    }
    
  },
  globalData: {
    user: {memberId:''},
    baseUrl:'https://www.zhiqushequ.cn',
  },

})