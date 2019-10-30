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
    fieldKey:'',
    params:{
      name: '',
      idCard: '',
    }
  },
  /**
   * 接收input值
   */
  inputChange(e){
    let val = e.detail.value;
    let key=e.currentTarget.dataset.field
    // console.log(e.currentTarget.dataset.field)
    this.setData({
     [`params.${key}`]:val
    })
  },
  /**
   * 提交表单
   */
  submitForm(){
    if (this.data.fieldKey == 'name' && this.data.params.name==''){
      wx.showToast({
        title: '' + this.data.nameKey + '不能为空',
      })
    } else if (this.data.fieldKey == 'idCard' && this.data.params.idCard ==''){
      wx.showToast({
        title: '' + this.data.nameKey + '不能为空',
      })
    }else{
      this.requestData()
    }
  },
  /**
   * 提交表单数据
   */
  requestData: function () {
    let params = {
      memberId: this.data.memberId,
      url: 'uc/member/update',
      images: '',
      name: this.data.params.name,
      sex:'',
      idCard: this.data.params.idCard
      
    };
    request.getRequest('uc/member/update', params).then(res => {
      console.log(res)
      if(res.code==200){
        wx.navigateBack({
          delta:1
        })
      }
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
    // console.log(app.globalData.user)
    this.setData({
      nameKey: options.nameKey,
      fieldKey: options.fieldKey
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