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

  onLoad: function () {
    // console.log(wx.getStorageSync('user'))
    this.requestBanner()
    this.requestInfor()
    this.inform()
    this.posterList()
    
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
      // console.log(res)
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
  }
})
