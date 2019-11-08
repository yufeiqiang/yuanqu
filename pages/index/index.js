//index.js
//获取应用实例
const app = getApp()
const request = require("../../utils/request.js")
Page({
  data: {
    bannerList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 100,
    height:0,
    inforList:[],
    information:[],
    poster:[],
    informHeight:0,
    baseUrl:app.globalData.baseUrl
  },
  //事件处理函数
  /**
   * 初始化所有方法
   */
  init:function(){
    this.requestBanner()
    this.requestInfor()
    this.inform()
    this.posterList()
  },
  onLoad: function () {
    this.init()
  },
  /**
   * 点击轮播图
   */
  tapNavigate:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../infordetail/infordetail?id=' + id + '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**请求轮播图 */
  requestBanner:function(){
    let params = {
      "columns": "1",
      "types": "1",
      "status": "50",
      "m": "0",
      "n": "5"
    };
    request.getRequest('cms/info/cmsInfo/crud/pagelist',params).then(res=>{
      if(res.code==200){
        this.setData({
          bannerList:res.data.list
        })
      }
    }).catch(err=>{})
  },
  /**请求公告信息*/
  requestInfor:function(){
    let params = {
      "columns": "1",
      "types": "6",
      "status": "50"
    };
    request.getRequest('cms/info/cmsInfo/crud/pagelist', params).then(res=>{
      // console.log(res)
      if(res.code==200){
        this.setData({
          inforList: res.data.list
        })
      }
    }).catch(err=>{})
  },
  /**请求资讯照片 */
  inform:function(){
    let params = {
      "columns": "1",
      "types": "8",
      "status": "50"
    };
    request.getRequest('cms/info/cmsInfo/crud/pagelist', params).then(res => {
      // console.log(res)
      if (res.code == 200) {
        this.setData({
          information: res.data.list
        })
      }
    }).catch(err => { })
  },
  /**请求广告列表 */
  posterList:function(){
    let params = {
      "columns": "1",
      "types": "5",
      "status": "50"
    };
    request.getRequest('cms/info/cmsInfo/crud/pagelist', params).then(res => {
      // console.log(res)
      if (res.code == 200) {
        this.setData({
          poster: res.data.list
        })
      }
    }).catch(err => { })
  },
  /**设置轮播高度自适应 */
  setContainerHeight:function(e){
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
          this.setData({
            height: imgHeight * scale
          })
          break;
      case 'informHeight':
        this.setData({
          informHeight: imgHeight * scale/2
        })
        break;
    }
  },
  /**
   * 点击按钮跳转到详情
   */
  itemDetail(e){
    let url = e.currentTarget.dataset.url;
    console.log(url)
    if(!app.globalData.user.memberId){
      wx.showModal({
        title: '需登录后才能访问',
        content: '是否跳转至登录页?',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.navigateTo({
              url: '../logs/logs',
            })
          }
        }
      });
    }else{
      wx.navigateTo({
        url
      })
    }
    
  },
  /**
   *  tab 点击时执行
   */
  onTabItemTap(item){
    console.log(item)
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 当用户下拉的时候，将页码设置为1，同时清空列表数组
    wx.showNavigationBarLoading()
    this.init()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
})
