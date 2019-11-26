const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { img: 'a.png', text:'宽度申报', type:1},
      { img: 'b.png', text:'网络保障', type:2},
      { img: 'c.png', text:'装修服务', type:3},
      { img: 'd.png', text:'送水服务', type:4},
      { img: 'e.png', text:'其他服务', type:5},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.list()
  },
  serveItem(e){
    let type = e.currentTarget.dataset.type
    let text = e.currentTarget.dataset.text
    wx:wx.navigateTo({
      url: '../serveform/serveform?type='+type+'&text='+text+''
    })
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