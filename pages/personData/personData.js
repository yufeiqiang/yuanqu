// pages/my/my.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: app.globalData,
    memberId: app.globalData.user.memberId
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '02038106809' //仅为示例，并非真实的电话号码
    })
  },
  bianji(){
    this.requestPhoto()
  },
  /**
   * 修改头像
   */
  requestPhoto: function () {
    let params = {
      memberId: this.data.memberId,
      url: 'uc/member/update',
      images: '/ress/staticpm/images/651e65aeea164db5bdb2c3492aaf17a6/e902b99cbc3747fb4275f9b6663c25da.jpg',
      name:'',
      sex:'',
      idCard:''
      
    };
    request.getRequest('uc/member/update', params).then(res => {
      console.log(res)
    
      // console.log(res)
    }).catch(err => { })
  },
  /**
   * 点击跳转到详情
   */
  officedetail(e){
    console.log(e)
    let type= e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../officeSuccList/officeSuccList?type='+type+'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    console.log(app.globalData.user.images)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})