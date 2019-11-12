const app = getApp()
const request = require("../../utils/request.js")
const dateTimePicker = require('../../utils/dateTimePicker')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      create_by: app.globalData.user.memberId,
      community_id:'',
      name:'',
      legal_person:'',
      legal_person_phone:'',
      email:'',
      legal_person_id_card:'',
      province:"广东省",
      province_code:'440000',
      city:"广州市",
      city_code:'440100',
      country:"海珠区",
      country_code:'440105',
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
      public_account_pic:'',
      status:"0",
      del_flag:"0",
      tname:"c_company"
    },
    region: ['广东省', '广州市', '海珠区'],
    baseUrl:app.globalData.baseUrl,
    companyList:[],
    companyIndex:0,
    cparam:{
      create_by: +app.globalData.user.memberId,
      del_flag: "0",
      identifier:"query_community_list"
    },
    flag:'',
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
      {
        name: 'legal_person_card_face',
        rules: { required: true, message: '上传身份证正面!' }
      },
      {
        name: 'legal_person_card_back',
        rules: { required: true, message: '上传身份证反面!' }
      },
      {
        name: 'organization_pic',
        rules: { required: true, message: '上传组织机构证正面!' }
      },
      {
        name: 'public_account_pic',
        rules: { required: true, message: '上传对公账号反面!' }
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
    let val = this.data.companyList[index].value
    this.setData({
      companyIndex: index,
      'formData.community_id': val
    })
  },
  /**
   * 共用请求数据接口
   */
  _initData(param,callBack,url='ls') {
    // let param = this.data.cparam;
    request.getRequest(url, param, 2).then(res => {
      callBack(res)
    })
  },
  /**
   * 根据详情判断是否有注册过企业
   */
  getCompanyDetail(){
    this._initData({create_by:app.globalData.user.memberId,
      del_flag: "0",
      identifier:"get_company_detail"},(res)=>{
        // 判断如果有注册过直接遍历初始化数据
        if(res){
          // console.log(res)
          let formData = Object.assign(this.data.formData,res[0])
          this.setData({
            formData,
            flag:res,
          });
        }
        this.initPicker()
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
      var data = []
      for(let item in res){
        data.push(res[item])
      }
      var companyIndex=this._findIndex(data,this.data.formData.community_id) == -1 ? 
                        0 : this._findIndex(data,this.data.formData.community_id);
      // console.log(companyIndex)
      this.setData({
        companyList:data,
        companyIndex
      })
    })
  },
  /**
   * 根据id找出改id在数组中的索引index
   */
  _findIndex(list=[],i=''){
    // console.log(list)
    return list.findIndex(item=>{
      // console.log(item.value)
      return item.value == i
    })
  },
  /**
   * 提交数据
   */
  insertCompany(){
    let param = this.data.formData
    this._initData(param,(res)=>{
      if(res==1){
        wx.showToast({
          title:"提交注册成功！"
        })
        this.getCompanyDetail()
      }
    },"insert?1=1")
  },
  /**
   * 
   * 更新数据 
   */
  updateCompany(){
    let param = this.data.formData
    this._initData(param,(res)=>{
      if(res==1){
        wx.showToast({
          title:"数据更新成功！"
        })
        this.getCompanyDetail()
      }
    },"update?1=1")
  },
  /**
   * 选择城市
   * @param {} 
   */
  bindRegionChange: function (e) {
     let {value, code, postcode} = e.detail
    console.log('picker发送选择改变，携带值为',e.detail)
    let pro={
      province:value[0],
      province_code:code[0],
      city:value[1],
      city_code:code[1],
      country:value[2],
      country_code:code[2],
    }
    this.setData({
      formData: Object.assign(this.data.formData,pro)
    })
  },
  /**
   *点击图片上传 
   * @param {flied} options 
   */
  chooseImg(e){
    let val = e.currentTarget.dataset.field;
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: (res) => {
        let tempFilePath = res.tempFilePaths
        // console.log(res);
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          url: that.data.baseUrl +'/park_manage/api/sys/file/upload',
          filePath:tempFilePath[0],
          name:'file',
          header:'',
          formData:{
            accessToken: app.globalData.user.accessToken,
            userId: app.globalData.user.memberId,
            dfsType:'0'
          },
          success:function(e){
            let data = JSON.parse(e.data)
            if(e.statusCode == 200){
              if(data.code==200){
                let url = data.data.file_rsurl
                that.setData({
                  [`formData.${val}`]: url
                });
                wx.hideLoading()
              }
            }
            
          }
        })
      }
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
        if(this.data.flag){
          this.updateCompany()
        }else{
          this.insertCompany()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化判断详情信息
    this.getCompanyDetail()
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
    wx.showNavigationBarLoading()
    this.getCompanyDetail()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
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