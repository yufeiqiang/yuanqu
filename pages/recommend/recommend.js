// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:app.globalData.baseUrl,
    recommList:[],
    isloading:true,
    ismore:false,
    pageNo:1,
    searchVal:'',
    searColor:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.recommendList('',this.data.pageNo)
  },
  /**
   * 请求列表数据
   */
  recommendList(val = '', pageNo=1){
    //初始化请求参数
    let param={
      columns:1,
      types:'7',
      status:'50',
      "queryMap['title_like']":val,
      searchVal:'',
      pageSize:6,
      pageNo:pageNo,
    }
    request.getRequest('cms/info/cmsInfo/crud/pagelist',param).then(res=>{
      if(res.code==200){
        let oldData = this.data.recommList;
        // 当数据不为空的时候，给列表追加数据
        if (res.data.list !== undefined){
          this.setData({
            recommList: oldData.concat(res.data.list),
            isloading: false
          })
        }else{
          // 当请求到数据为空的时候，显示没有更多提示，同时隐藏加载中按钮
          // console.log('出来')
          this.setData({
            ismore:true,
            isloading:false
          })
        }
      }
    })
  },
  /**
   * 搜索按钮
   */
  searchData: function (e) {
    // 点击搜索按钮，初始化参数，同时将val值赋给全局变量
    this.setData({
      pageNo: 1,
      recommList: [],
      ismore: false,
      isloading: true,
      searchVal: e.detail.value
    })
    this.recommendList(e.detail.value,this.data.pageNo)
  },
  /**
   * 点击清除搜索按钮
   */
  clearsearch:function(){
    // 点击清除搜索按钮，初始化参数
    this.setData({
      pageNo: 1,
      recommList: [],
      ismore: false,
      isloading: true,
      searchVal:''
    })
    this.recommendList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 当用户下拉的时候，将页码设置为1，同时清空列表数组
    this.setData({
      pageNo: 1,
      recommList:[],
      ismore: false,
      isloading: true
    })
    wx.showNavigationBarLoading()
    this.recommendList(this.data.searchVal)
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNo = this.data.pageNo;
    console.log(98)
    //当用户上拉的时候，全局页面自增 1
    this.setData({
      pageNo: ++pageNo,
      isloading:true,
      ismore: false
    })
    this.recommendList(this.data.searchVal, this.data.pageNo)
  },
  /**
   * 监听页面滚动
   */
  onPageScroll:function(e){
    if (e.scrollTop > 0){
      this.setData({
        searColor:'0px 2px 5px #efefef'
      })
    }else{
      this.setData({
        searColor:''
      })
    }
  }
})