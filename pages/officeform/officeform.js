const app = getApp();

Page({
  data: {
    isPickerRender: false,
    isPickerShow: false,
    startTime: "2019/01/01 12:32",
    endTime: "2019/01/02 12:32",
    pickerConfig: {
      endDate: true,
      column: "minute",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32",
      initEndTime: "2019-01-02 12:32",
      limitStartTime: "2015-05-06 12:32",
      limitEndTime: "2055-05-06 12:32"
    },
    name: '',
    formData:{
      id:'', 
      title:'', 
      price:'', 
      unitname:'', 
      num: '1',
      depositTypeName:'', 
      memberName: '', 
      memberPhone :'',
      buyerRemark:'',
      totalPrice:'',
      depositAmount:'',
      taskTime:''
    }
  },
  onLoad: function(options) {
    // console.log(options)
    let { id, title, price, unitname, depositTypeName, name, depositAmount} = options;
    wx.setNavigationBarTitle({
      title: '预定'+ options.title ,
    })
    this.setData({
      'formData.id':id, 
      'formData.title':title, 
      'formData.price':price, 
      'formData.unitname':unitname, 
      'formData.depositTypeName':depositTypeName, 
      'formData.depositAmount':depositAmount,
      name: name
    })
    this.taskTimeFun(this.data.startTime, this.data.endTime);
    this.totalPriceFun()
  },
  pickerShow: function() {
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  setPickerTime: function(val) {
    // console.log(val.detail);
    let data = val.detail;
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime
    });
    this.taskTimeFun(data.startTime, data.endTime)
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
    var totalPrice = (parseInt(this.data.formData.taskTime) * parseInt(this.data.formData.price) * parseInt(this.data.formData.num)) + parseInt(this.data.formData.depositAmount);
    totalPrice = isNaN(totalPrice) ? 0 : totalPrice
    this.setData({
      'formData.totalPrice': totalPrice
    })
  },
  /**根据单位类型判断出时间差 */
  taskTimeFun(startTime, endTime){
    // console.log(this.data.formData.unitname)
    var taskTime='';
    if (this.data.formData.unitname =='元/小时'){
      taskTime = this.GetDateDiff(startTime, endTime, 'hour')
    } else if (this.data.formData.unitname == '元/天'){
      taskTime = this.GetDateDiff(startTime, endTime,'day')
    } else if (this.data.formData.unitname == '元/位/月' || this.data.formData.unitname == '元/月' || this.data.formData.unitname == '元/个/月' ){
      taskTime = this.getIntervalMonth(this.ConvertDateFromString(startTime), this.ConvertDateFromString(endTime))
    }
    // console.log(taskTime)
    this.setData({
      'formData.taskTime': taskTime
    })
  },
  /**
   * 计算小时，天数差
   */
  GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    if(startTime.indexOf(".") != -1) startTime = startTime.substring(0, startTime.indexOf("."));
    if(endTime.indexOf(".") != -1) endTime = endTime.substring(0, endTime.indexOf("."));
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    // console.log(startTime+'-----'+endTime)
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var timeType = 1;
    switch(diffType) {
      case "second":
        timeType = 1000;
        break;
      case "minute":
        timeType = 1000 * 60;
        break;
      case "hour":
        timeType = 1000 * 3600;
        break;
      case "day":
        timeType = 1000 * 3600 * 24;
        break;
      default:
        break;
    }
    return Math.ceil((eTime.getTime() - sTime.getTime()) / parseInt(timeType));;
  },
  /**
   * 计算月份差
   */
  getIntervalMonth(startDate, endDate) {
    var startMonth = startDate.getMonth();
    var endMonth = endDate.getMonth();
    var startDay = startDate.getDate();
    var endDay = endDate.getDate();
    var intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
    intervalMonth = Math.abs(intervalMonth);
    if(endDay > startDay) intervalMonth += 1;
    return intervalMonth;
  },
  /**
   * 将时间转为标准时间
   */
  ConvertDateFromString(dateString) {
    if(dateString) {
      var arr1 = dateString.split(" ");
      var sdate = arr1[0].split('/');
      var date = new Date(sdate[0], sdate[1], sdate[2]);
      return date;
    }
  }
});
