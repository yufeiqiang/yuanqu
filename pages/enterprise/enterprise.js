const app = getApp()
const request = require("../../utils/request.js")
const dateTimePicker = require('../../utils/dateTimePicker')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      memberId: app.globalData.user.memberId,
      name:'',
      legal_person:'',
      legal_person_phone:'',
      email:'',
      legal_person_id_card:'',
      province:'',
      province_code:'',
      city:'',
      city_code:'',
      country:'',
      country_code:'',
      address:'',
      public_bank:'',
      number:'',
      public_account:'',
      organization_code:'',
      scale:'',
      descs:'',
      legal_person_card_face:'',
      legal_person_card_back:'',
      organization_pic:'',
      public_account_pic:''
    },
    companyList:[],
    companyIndex:0,
    region: ['广东省', '广州市', '海珠区'],
    cparam:{
      create_by: +app.globalData.user.memberId,
      del_flag: "0",
      identifier:"query_community_list"
    },
    userId: app.globalData.user.memberId,
    rules: [
      {
        name: 'legal_person',
        rules: { required: true, message: '填写法人代表!' },
      },
      {
        name: 'legal_person_phone',
        rules: { required: true, message: '请填法人手机号码!' }
      },
      {
        name: 'email',
        rules: { required: true, message: '填写邮箱！' }
      },
      {
        name: 'legal_person_id_card',
        rules: { required: true, message: '填写法人身份证号！' }
      },
      {
        name: 'address',
        rules: { required: true, message: '填写公司地址！' }
      },
      {
        name: 'public_bank',
        rules: { required: true, message: '填写开户行！' }
      },
      {
        name: 'public_account',
        rules: { required: true, message: '填写对公账号！' }
      },
      {
        name: 'organization_code',
        rules: { required: true, message: '填写组织机构号码！' }
      },
      {
        name: 'scale',
        rules: { required: true, message: '填写公司规模!' }
      },
      {
        name: 'descs',
        rules: { required: true, message: '填写公司经营范围!' }
      },
    ] 
  },
  /**
  * input失焦
  */
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    console.log(e)
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  /**
   * 选择公司
   */
  formselectorChange(e) {
    let index = e.detail.value;
    let id = this.data.formData.companyList[index].companyId
    console.log(id)
    this.setData({
      companyIndex: index,
      'formData.companyId': id
    })
  },
  /**
   * 获取已提交的数据
   */
  getCompany(){
    let companyDetailparam= this.data.companyDetailparam
  },
  /**
   * 共用请求数据接口
   */
  _initData(param,callBack) {
    // let param = this.data.cparam;
    request.getRequest('ls', param, 2).then(res => {
      callBack(res)
    })
  },
  /**
   * 根据判断是否有注册过企业
   */
  getCompanyDetail(){
    this._initData({create_by:app.globalData.user.memberId,
      del_flag: "0",
      identifier:"get_company_detail"},(res)=>{
        // 判断如果有注册过直接遍历初始化数据
        if(res){
          console.log(res)
        }else{
          // 否则初始化社区下拉框跟城市下拉
          this.initPicker()
        }
    })
  },
  /**
   * 初始化社区下拉列表
   */
  initPicker(){
    this._initData({
      create_by:app.globalData.user.memberId,
      del_flag: "0",
      identifier:"query_community_list"
    },(res)=>{
      console.log(res)
      var data = []
      for(item in res){
        data.push(res[item])
      }
      // console.log(this)
      this.setData({
        companyList:data
      })
    })
  },
  /**
   * 提交方法
   */
  submitData: function () {
    let param = this.data.formData
    delete param.companyList
    delete param.visit
    delete param.dateTimeArray
    request.postRequest('/appoint/info/appointInfo/appoint', param).then(res => {
      // console.log(res)
      if (res.code == 200) {
        if (this.data.formData.type != 2){
          wx.navigateTo({
            url: '../visitorList/visitorList?type=' + param.type + '&title=' + this.data.title + '',
          })
        }else{
          wx.showToast({
            title: '反馈成功',
            success: function (e) {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      }
    }).catch(err => {

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化判断详情信息
    this.getCompanyDetail()
    this.setData({
      
    })
    wx.setNavigationBarTitle({
      title: "企业信息"
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