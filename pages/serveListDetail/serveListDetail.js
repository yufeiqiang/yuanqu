const app = getApp()
const request = require("../../utils/request.js");
Page({
  data: {
    param: {
      id: '',
      createBy: app.globalData.user.memberId
    },
    list:[]
  },
  onLoad: function (e) {
    console.log(e)
    this.setData({
      'param.id':e.id,
      'param.createBy': app.globalData.user.memberId
    })
    this.requestData()
  },
  /**
   * 请求数据
   */
  requestData(){
    let param = this.data.param
    request.getRequest('tdo/serverreginfo/tdoServerReginfo/crud/get',param).then(res=>{
      if(res.code==200){
        this.setData({
          list:res.data
        })
      }
      
    })
  },
  cancel(){
    let param={
      id: this.data.param.id,
      dealstatus: '-1',
      1:'1',
      tname: 'tdo_server_reginfo',
      update_by: this.data.param.createBy
    }
    wx.showModal({
      title: '取消申请',
      content: '你确定取消此申请吗？',
      success: function (e) {
        if (e.confirm) {
          wx.request({
            url: "https://www.zhiqushequ.cn/park_manage/query/update",
            data: param,
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '取消成功',
                  success: function (e) {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  /** 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.requestData()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
})