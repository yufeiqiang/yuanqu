const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    list:null,
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 100,
    officeListDetail:'',
    height: 0,
    pid:'',
    title:'',
    id:'',
    unitname:''
  },
  
  /**
   * 初始化数据
   */
  initData(product=' '){
    let param={
      pid: "'"+this.data.pid+"'",
      // pid: "'cce2a982d9f64b048a7498a1ae165051'",
      identifier: "get_product_detail"
    }
    request.getRequest('ls', param, 2).then(res => {
      for (item in res) {
        var data = res[item].imgUrls;
        var icon = res[item].facilities
        // console.log(icon)
        res[item].imgUrls = JSON.parse(data)
        res[item].facilities = JSON.parse(icon)
      }
      // console.log(res[0].imgUrls)
      this.setData({
        bannerList: res[0].imgUrls,
        officeListDetail: res[0]
      })
    })
  },
  /**设置轮播高度自适应 */
  setContainerHeight: function (e) {
    //图片的原始宽度
    let imgWidth = e.detail.width;
    //图片的原始高度
    let imgHeight = e.detail.height;
    //同步获取设备的宽度
    let sysInfo = wx.getSystemInfoSync();
    // 获取屏幕的宽度
    let screenWidth = sysInfo.screenWidth;
    // 获取屏幕和原图的比例
    let scale = screenWidth / imgWidth;
    // 设置容器的高度
    // console.log(e.target.dataset.height)
    switch (e.target.dataset.height) {
      case 'height':
        // console.log(imgHeight)
        this.setData({
          height: imgHeight * scale
        })
        break;
      case 'informHeight':
        this.setData({
          informHeight: imgHeight * scale / 2
        })
        break;
    }
  },
  /**
   * 点击预约使用
   */
  signUp(e){
    // console.log(e.currentTarget.dataset)
    let { id, title, unitname, deposittypename, price, name, depositamount, unit} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../officeform/officeform?id=' + id + '&title=' + title + '&unitname='
        + unitname + '&depositTypeName=' + deposittypename + '&price=' + price + '&name='
        + name + '&depositAmount=' + depositamount + '&unit=' + unit+'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pid:options.id,
      title:options.title
    })
    wx.setNavigationBarTitle({
      title: options.title +'详情',
    })
    this.initData()
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
    this.initData()
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