// pages/my/my.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: app.globalData,
    memberId: app.globalData.user.memberId,
    userData:''
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '02038106809' //仅为示例，并非真实的电话号码
    })
  },
  previewImage(e){
    let url = e.currentTarget.dataset.url;
    let that = this
    wx.previewImage({
      current: that.data.user.baseUrl+url, // 当前显示图片的http链接
      urls: [that.data.user.baseUrl+url] // 需要预览的图片http链接列表
    })
  },
  /**
   * 修改头像
   */
  dataList() {
    let params = {
      url: 'uc/member/get',
      memberId: app.globalData.user.memberId
    }
    request.postRequest('uc/member/get', params).then(res => {
      // console.log(res)
      if(res.code==200){
        this.setData({
          userData: res.data,
        })
      }
    }).catch(err => { })
  },
  /**
   * 跳转到编辑资料页面
   */
  editData(){
    wx.navigateTo({
      url: '../personData/personData',
    })
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
   *  tab 点击时执行
   */
  onTabItemTap(item){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData)
    this.dataList()
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
    console.log(app.globalData.user.memberId)
    if(!app.globalData.user.memberId){
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    this.dataList()
    console.log(app.globalData)
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
    console.log(app.globalData)
    wx.showNavigationBarLoading()
    this.dataList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
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