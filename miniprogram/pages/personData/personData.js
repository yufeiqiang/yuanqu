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
    userData:'',
    sexArray:['男','女','保密'],
    sexIndex:'0'
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '02038106809' //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 数据列表
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
          sexIndex: parseInt(res.data.sex)-1
        })
      }
    }).catch(err => { })
  },
  /**
   * 修改头像
   */
  requestPhoto: function () {
    let params = {
      memberId: app.globalData.user.memberId,
      url: 'uc/member/update',
      images: '',
      name:'',
      sex: 1 + parseInt(this.data.sexIndex) ,
      idCard:''
      
    };
    request.getRequest('uc/member/update', params).then(res => {
      console.log(res)
    
      // console.log(res)
    }).catch(err => { })
  },
  /**
   * 选择性别
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
    this.requestPhoto()
  },
  /**
   * 点击跳转到详情
   */
  officedetail(e){
    // console.log(e)
    let type= e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../officeSuccList/officeSuccList?type='+type+'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData)
    this.dataList()
    // console.log(app.globalData.user.images)
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
    this.dataList()
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
    wx.showNavigationBarLoading()
    this.dataList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }
})