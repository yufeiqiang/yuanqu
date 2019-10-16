const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceList:['0-600元', '600-1500元', '1500-3000元', '3000元以上'],
    personNumber:['0-30','30-50','50-100','100以上'],
    priceIndex: '',
    personIndex:'',
    product_property:'',
    price:'',
    type:''
  },

  /**
   * 改变下拉选项
   */
  bindPickerChange(e){
    let { field, product} = e.currentTarget.dataset;
    this.setData({
      [field]:e.detail.value
    });

    // 1.根据参数判断点击是哪个下拉框
    let currVal = product == 'price' ? this.data.priceList[this.data[field]] : this.data.personNumber[this.data[field]];
    // 2.分割拿到的数据
    let arr = currVal.split('-');
    // 3.遍历给每一项数据用正则去文字
    var resultArr = arr.map(item=>{
        return parseInt(item.replace(/[^0-9]/ig, ''))
    })
    // 4.拼接存储每个下拉数据
    this.data[product] = resultArr.length > 1 ?
    'and a.' + product + ' >= ' + resultArr[0] + ' and a.' + product +' < ' + resultArr[1] + '' :
    'and a.' + product +' >= ' + resultArr[0] + '';
    // 5.合并成一条
    let data =this.data.product_property + ' ' + this.data.price
    // console.log(data)
    this.initData(data)


  },
  /**
   * 初始化数据
   */
  initData(product=' '){
    let param={
          type:this.data.type,
          sstr: product,
          m: 0,
          n: 200,
          identifier: "query_product_list"
        }
    request.getRequest('ls',param,2).then(res=>{
      console.log
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    wx.setNavigationBarTitle({
      title: options.title,
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
    this.setData({
      priceIndex: '',
      personIndex: '',
      product_property: '',
      price: ''
    })
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