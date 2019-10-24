// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '02038106809' //仅为示例，并非真实的电话号码
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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