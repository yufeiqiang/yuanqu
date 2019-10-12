const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      dealstatus: '0',
      names: app.globalData.user.name,
      telno: app.globalData.user.phone,
      weixinno:'',
      qqno:'',
      chiefcomplaint:'',
      claim:'',
      createBy: app.globalData.user.memberId,
      type:''
    },
    text:'',
    userId: app.globalData.user.memberId,
    rules: [
      {
        name: 'names',
        rules: { required: true, message: '请填写姓名' },
      },
      {
        name: 'telno',
        rules: { required: true, message: '手机号必填' }
      },
      {
        name:'chiefcomplaint',
        rules:{ required:true,  message:'详细地址必填'}
      }
    ] 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    console.log(app.globalData.user)
    wx.setNavigationBarTitle({
      title: options.text  
    })
    this.setData({
      text:options.text,
      'formData.type': options.type,
    })
  },
  /**
   * 提交方法
   */
  submitData: function () {
    let param = this.data.formData
    param.name= param.names
    request.postRequest('tdo/serverreginfo/tdoServerReginfo/crud/save', param).then(res => {
      // console.log(res)
      if (res.code == 200) {
        wx.navigateBack({
          delta:1
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
        console.log(errors)
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