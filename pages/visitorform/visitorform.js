const app = getApp()
const request = require("../../utils/request.js")
const dateTimePicker = require('../../utils/dateTimePicker')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      type:'1',
      memberId: app.globalData.user.memberId,
      personName: app.globalData.user.name,
      personPhone: app.globalData.user.phone,
      companyId:'',
      matter:'',
      visitTime:'',
      num:'1',
      remarks:'',
      companyList: [],
      visit: ['面试', '商务', '参观', '私人'],
      dateTimeArray: null,
    },
    dateTime:'',
    companyIndex:0,
    indexVisit:0,
    company:{
      del_flag: 0,
      identifier: "query_company_list"
    },
    title:'',
    userId: app.globalData.user.memberId,
    rules: [
      {
        name: 'personName',
        rules: { required: true, message: '请填写姓名' },
      },
      {
        name: 'personPhone',
        rules: { required: true, message: '手机号必填' }
      },
    ] 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    console.log(app.globalData.user)
    let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      title: options.title,
      dateTime: obj.dateTime,
      'formData.dateTimeArray': obj.dateTimeArray,
      'formData.type': options.type
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.requestCompany()
    let date = this.data.formData.dateTimeArray[0][this.data.dateTime[0]] + '-' + this.data.formData.dateTimeArray[1][this.data.dateTime[1]] + '-' + this.data.formData.dateTimeArray[2][this.data.dateTime[2]] + ' ' + this.data.formData.dateTimeArray[3][this.data.dateTime[3]] + ':' + this.data.formData.dateTimeArray[4][this.data.dateTime[4]] + ':' + this.data.formData.dateTimeArray[5][this.data.dateTime[5]];
    this.setData({
      'formData.visitTime': date
    })
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
   * 来访事由
   */
  formvisitChange(e){
    let index = e.detail.value;
    let id = this.data.formData.visit[index]
    console.log(id)
    this.setData({
      indexVisit: index,
      'formData.matter': id
    })
  },
  /**
   * 请求公司数据
   */
  requestCompany() {
    let param = this.data.company;
    request.getRequest('ls', param, 2).then(res => {
      var data = this.data.formData.companyList
      for (item in res) {
        var obj = {}
        obj.companyId = res[item].id;
        obj.name = res[item].name
        data.push(obj);
      }
      console.log(data)
      this.setData({
        'formData.companyList': data,
        'formData.companyId': this.data.formData.companyList[0].companyId,
        'formData.matter': this.data.formData.visit[0],
        'formData.memberId': app.globalData.user.memberId,
        userId: app.globalData.user.memberId,
      })
    })
  },
  // 改变时间
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
    let date = this.data.formData.dateTimeArray[0][this.data.dateTime[0]] + '-' + this.data.formData.dateTimeArray[1][this.data.dateTime[1]] + '-'          + this.data.formData.dateTimeArray[2][this.data.dateTime[2]] + ' ' + this.data.formData.dateTimeArray[3][this.data.dateTime[3]] + ':' +             this.data.formData.dateTimeArray[4][this.data.dateTime[4]] + ':' + this.data.formData.dateTimeArray[5][this.data.dateTime[5]]
    // console.log(date)
    this.setData({
      'formData.visitTime':date
    })
  },

  // 更改日期时间列
  changeDateTimeColumn(e) {
    // console.log(1)
    var arr = this.data.dateTime, 
        dateArr = this.data.formData.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      'formData.dateTimeArray': dateArr,
      dateTime: arr
    });
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