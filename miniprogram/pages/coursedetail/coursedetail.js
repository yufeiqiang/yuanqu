// pages/coursedetail/coursedetail.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    list:'',
    isTimeText:'',
    id:'',
    typeId:'',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      id: options.id,
      typeId: options.typeId
    })
    this.recommendList();
  },
  /**
   * 请求列表数据
   */
  recommendList(val = '', pageNo = 1) {
    //初始化请求参数
    let param = {
      id:this.data.id,
     
    }
    request.getRequest('act/info/actInfo/crud/get', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
        if (res.data !== undefined) {
          this.setData({
            list: res.data,
            isloading: false
          })
          this.isTime(res.data.endDate)
        } else {
          // 当请求到数据为空的时候，显示没有更多提示，同时隐藏加载中按钮
          this.setData({
            ismore: true,
            isloading: false
          })
        }
      }
    })
  },
  /**
  * 判断结束时间是否大于当前时间
  */
  isTime: function (param='') {
    let newparam = param.replace(/-/g,'/')
    let myDate = new Date();
    let now = myDate.valueOf();
    let time = new Date(newparam).valueOf();
    if (now < time) {
      this.setData({
        isTimeText:'进行中',
        disabled: false
      })
      return true;
    } else {
      this.setData({
        isTimeText: '已结束',
        disabled:true
      })
      // return false;
    }
  },
  /**
   * 跳转到报名页面
   */
  signUp(e){
    let title = e.currentTarget.dataset.title;
    // console.log(id)
    wx.navigateTo({
      url: '../signUp/signUp?title=' + title + '&type=' + this.data.typeId + '&id=' + this.data.id + '&isFree=' + this.data.list.isFree,
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
    wx.stopPullDownRefresh()
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