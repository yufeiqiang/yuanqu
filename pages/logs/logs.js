const util = require('../../utils/util.js')
const request = require('../../utils/request.js')

Page({
  data: {
    showTopTips: false,
    codetext: '获取验证码',
    formData: {
      phone:'',
      verification_code:'',
    },
    codev:null,
    rules: [
      {
        name: 'phone',
        rules: { required: true, message: '手机号必填' }
      }, 
      {
        name: 'verification_code',
        rules: { required: true, message: '验证码必填' },
      }
    ] 
  },
  onLoad: function () {
    // this.getBusInfo()
    // wx.setStorageSync('user',1644)
    // console.log(99)
    console.log(wx.getStorageSync('user'))
  },
  /**或取验证码 */
  verifyNumber: function (e) {
    let phone = this.data.formData.phone;
    request.postRequest('mobile/verifycode/get', { phone: phone, type: "LOGIN" }).then((res) => {
      if(res.data.code==200){
        
      }else{
        clearInterval(this.data.codev);
      }
    }).catch((err)=>{
      
    })
  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  /**获取验证码验证*/
  verification: function (e) {
    // console.log(this.data.formData)
    this.selectComponent('#form').validateField('phone', (isValid, errors) => {
      // console.log('valid', isValid, errors)
      if (!isValid) {
          wx.showToast({
            title: errors.message,
          })
      } else {
        this.timer()
      }
    })
   
  },
  /**倒计时 */
  timer(){
    let _that = this
    let coden = 60;
    if (_that.data.codetext == '获取验证码') {
      this.verifyNumber()
      this.data.codev = setInterval(() => {
        _that.setData({
          codetext: --coden + '重新发送'
        })
        if (coden == 0) {

          clearInterval(this.data.codev);
          _that.setData({
            codetext: '获取验证码'
          })
        }
      }, 1000)
    }
  },
  /**提交表单数据 */
  submitData:function(){
    let param = this.data.formData
    request.postRequest('app/member/login', param).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        console.log(1215)
        wx.setStorageSync('user', JSON.stringify(res.data))
        wx.navigateTo({
          url: '../index/index',
        })
      }
    }).catch(err=>{

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
  }
})