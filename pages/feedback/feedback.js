const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'意见反馈',
    formData: {
      memberName: app.globalData.user.name,
      memberPhone: app.globalData.user.phone,
      memberId: app.globalData.user.memberId,
      companyId:'1',
      remark:'',
      type:'2',
    },
    rules: [
      {
        name: 'memberName',
        rules: { required: true, message: '请填写姓名' },
      },
      {
        name: 'memberPhone',
        rules: { required: true, message: '手机号必填' }
      }
    ] 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = JSON.parse(wx.getStorageSync('user'));
    if(user==''){
      wx.navigateTo({
        url: '../logs/logs',
      })
      return false;
    }
    // console.log(user.memberId)
    this.setData({
      title:options.title,
      'formData.actId':options.id,
      'formData.type': options.type,
      'formData.memberId':user.memberId,
      'formData.isFree': options.isFree
    })
  },
  /**
   * 提交方法
   */
  submitData: function () {
    let param = this.data.formData
    request.postRequest('/appoint/info/appointInfo/appoint', param).then(res => {
      // console.log(res)
      if (res.code == 200) {
        // console.log(1215)
        wx.navigateTo({
          url: '../course/course?typeId=' + this.data.formData.type
        })
      }
    }).catch(err => {

    })
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    // console.log(e)
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  /**表单提交验证 */
  submitForm(e) {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        // console.log(errors)
        const firstError = Object.keys(errors)
        if (firstError.length) {
          wx.showToast({
            title: errors[firstError[0]].message,
          })

        }
      } else {
        this.submitData()
      }
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