const app = getApp()
const request = require("../../utils/request.js");
Page({
    data:{
      type:'1',
      list:null,
    },
  onLoad: function (e) {
    //进入页面请求数据
    this.setData({
      type: e.type,
    })
    wx.setNavigationBarTitle({
      title: e.title
    })
    this.requestList()
  },
  onShow: function () {

  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.requestList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }, 
  /**
   * 点击预约头部
   */
  titleBtn(e){
    let type= e.currentTarget.dataset.type;
    this.setData({
      type:type
    })
    this.requestList()
  },
  /**
   * 点击取消预约
   */
  cancelBtn(e){
    let id = e.currentTarget.dataset.id;
    // console.log(id)
    let that =this;
    wx.showModal({
      title: '取消预约',
      content: '你确定取消此预约吗？',
      success: function (e) {
        if (e.confirm) {
          request.postRequest('/appoint/info/appointInfo/cancel', { id: id }).then(res => {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '取消成功',
                success: function (e) {
                  setTimeout(() => {
                    that.requestList()
                  }, 1000)
                }
              })
            }
          })
        }
      }
    })
  },
    /**请求数据 */
  requestList(){
    let param = { 
          var: "a.type in(1,3) and a.member_id ='"+app.globalData.user.memberId+"'",
          m: 0, 
          n: 200,
          identifier:'query_appoint_list' 
        }
    wx.showLoading({
      title: '加载中',
    })
    request.getRequest('ls',param,2).then((res)=>{
        // console.log(res)
        let newData=[]
        for(itme in res){
          // console.log(this.data.type)
          if (res[itme].type == this.data.type) {
            newData.push(res[itme])
          }
        }
        this.setData({
          list: newData
        })
    })
  }
})