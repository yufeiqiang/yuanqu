// pages/signUp/signUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'报名',
    formData: {
      memberName: '',
      memberPhone: '',
      remark:'',
      actId:'',
      memberId:'',
      type:''
    },
    rules: [
      {
        name: 'memberPhone',
        rules: { required: true, message: '手机号必填' }
      },
      {
        name: 'memberName',
        rules: { required: true, message: '请填写姓名' },
      }
    ] 
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      title:options.title
    })
  },
  /**提交表单数据 */
  submitData: function () {
    let param = this.data.formData
    request.postRequest('act/infoorder/actInfoOrder/place', param).then(res => {
      console.log(res)
      if (res.code == 200) {
        // console.log(1215)
        wx.switchTab({
          url: '../index/index'
        })
        wx.setStorageSync('user', JSON.stringify(res.data))
      }
    }).catch(err => {

    })
  },
  /**表单提交验证 */
  submitForm(e) {
    // console.log(this.data.formData)
    this.selectComponent('#form').validate((valid, errors) => {
      // console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          // this.setData({
          //   error: errors[firstError[0]].message
          // })
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