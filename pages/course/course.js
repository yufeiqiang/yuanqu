const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList:[],
    baseUrl: app.globalData.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.courseList()
  },
  /**请求课程列表 */
  courseList(val=''){
    let param = {
          type: '2',
          status: '50',
          pageSize: '10',
          pageNo: '1',
          "queryMap['title_like']": val,
          "queryMap['keywords_like']":''
        }
    request.getRequest('act/info/actInfo/crud/pagelist',param).then((res)=>{
      // console.log(res)
      this.setData({
        courseList:res.data.list
      })
    })
  },
  searchData:function(e){
    // console.log(e.detail.value)
    this.courseList(e.detail.value)
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