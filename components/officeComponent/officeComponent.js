const app = getApp();
const request = require("../../utils/request.js")
const util = require("../../utils/util.js")
const computedBehavior = require('miniprogram-computed')
Component({
  data: {
    isPickerRender: false,
    isPickerShow: false,
    pickerConfig: {
      endDate: true,
      column: "minute",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32",
      initEndTime: "2022-01-02 12:32",
      limitStartTime: "2015-05-06 12:32",
      limitEndTime: "2055-05-06 12:32"
    },
    name: '',
    unitname:'',
    depositTypeName: '', 
    taskTime: '',
    formData: {
      memberId: app.globalData.user.memberId, //用户id
      buildingReleaseId: '', //产品ID
      startTime: '2019-01-01 12:32', // 开始时间
      endTime: '2019-01-02 12:32', // 结束Id
      price: '',     // 单价
      unit: '',    // 单位
      num: '1',   // 预定数量
      memberName: '', //联系人
      memberPhone: '', //电话
      buyerRemark: '',  // 备注信息
      depositAmount: '', // 押金
      totalPrice: '' // 总价
    },
    rules: [
      {
        name: 'memberName',
        rules: { required: true, message: '请填联系人' },
      },
      {
        name: 'memberPhone',
        rules: { required: true, message: '手机号必填' }
      },
    ] 
  },
  onLoad: function(options) {
    // console.log(options)
    let { id, title, price, unitname, depositTypeName, name, depositAmount, unit} = options;
    wx.setNavigationBarTitle({
      title: '预定'+ options.title ,
    })
    this.setData({
      'formData.buildingReleaseId':id, 
      title:title, 
      'formData.price':price, 
      'formData.unit': unit, 
      'formData.memberId': app.globalData.user.memberId, 
      unitname:unitname, 
      depositTypeName:depositTypeName, 
      'formData.depositAmount':depositAmount,
      name: name
    })
    this.totalPriceFun()
  },
  /**显示时间弹窗 */
  pickerShow: function() {
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  /**隐藏时间弹窗 */
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },
  /**点击时间弹窗确定按钮 */
  setPickerTime: function(val) {
    // console.log(val.detail);
    let data = val.detail;
    this.setData({
      'formData.startTime': data.startTime,
      'formData.endTime': data.endTime
    });
    // this.taskTimeFun(data.startTime, data.endTime)
    this.totalPriceFun()
  },
  /**
  * input值改变时候
  */
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    // console.log(e)
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
    this.totalPriceFun()
  },
  /**
   * input失焦
   */
  formNumChange(e){
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
    if (field == 'num') {
      if (e.detail.value == '') {
        this.setData({
          'formData.num': 1
        })
      }
      this.totalPriceFun()
    }
  },
  /**
   * 计算总价
   */
  totalPriceFun(){
    //时间差
    let taskTime = util.timeSlot(this.data.formData.startTime, this.data.formData.endTime, this.data.unitname);
    // 计算总价钱
    var totalPrice = (parseInt(taskTime) * parseInt(this.data.formData.price) * parseInt(this.data.formData.num)) + parseInt(this.data.formData.depositAmount);
    totalPrice = isNaN(totalPrice) ? 0 : totalPrice;
    this.setData({
      'formData.totalPrice': totalPrice,
      taskTime
    })
  },
  
  /**提交方法 */
  submitData: function () {
    let param = this.data.formData;
    var type 
    switch(this.data.title){
      case '会议室' :
        type=3
        break;
      case '办公室' :
        type=2
        break;
      case '柜子' :
        type = 4 ;
        break;
    }
    request.postRequest('order/order/order/place_weixin', param).then(res => {
      console.log(res)
      if (res.code == 200) {
        wx.navigateTo({
          url: '../officeSuccList/officeSuccList?type=' + type + '',
        })
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
        // console.log(errors)
        this.submitData()
      }
    })
  },
});
