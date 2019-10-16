// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl, 
    memberId: app.globalData.user.memberId,
    courseList: [],
    isloading: true,
    ismore: false,
    typeId: '',
    pageNo: 1,
    searchVal: '',
    searColor: '',
    falg:'1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      typeId: options.typeId,
      falg: options.falg
    })
    if(this.data.falg==2){
      this.myRecommendList(this.data.pageNo)
    }else{
      this.recommendList('', this.data.pageNo)
    }
    
  },
  /**
   * 点击每一项信息
   */
  courseDetail: function (e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../coursedetail/coursedetail?id=' + id + '&&typeId=' + this.data.typeId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 请求列表数据
   */
  recommendList(val = '', pageNo = 1) {
    //初始化请求参数
    let param = {
      // columns: 1,
      type: this.data.typeId,
      state: '50',
      "queryMap['title_like']": val,
      searchVal: '',
      pageSize: 5,
      pageNo: pageNo,
    }
    request.getRequest('act/info/actInfo/crud/pagelist', param).then(res => {
      if (res.code == 200) {
        let oldData = this.data.courseList;
        // 当数据不为空的时候，给列表追加数据
        // console.log(111)
        if (res.data.list !== undefined) {
          // console.log(res)
          this.setData({
            courseList: oldData.concat(res.data.list),
            isloading: false
          })
        } else {
          // 当请求到数据为空的时候，显示没有更多提示，同时隐藏加载中按钮
          // console.log('出来')
          this.setData({
            ismore: true,
            isloading: false
          })
        }
      }
    })
  },
  /**
   * 我的课程数据，我的活动
   */
  myRecommendList(){
    let memberId = this.data.memberId
    let type = this.data.typeId
    let param = {
      var: "a.create_by = '" + memberId+"' and a.type = '"+type+"'",
      m: 1,
      n: 2000,
      identifier: "query_act_order_list",
    }
    request.getRequest('ls', param, 2).then(res => {
        let data = [];
      // console.log(1)
        for(item in res){
          // console.log(res[item])
          data.push(res[item])
        }
        this.setData({
          courseList: data,
          ismore: true,
          isloading: false
        })
    })
  },
  /**
   * 取消报名
   */
  cancelBtn(e){
    let id = e.currentTarget.dataset.id;
    let that = this
    wx.showModal({
      title: '取消报名',
      content: '你确定取消报名吗？',
      success: function (e) {
        if (e.confirm) {
          request.postRequest('act/infoorder/actInfoOrder/cancel', { id: id }).then(res => {
              wx.showToast({
                title: '取消成功',
                success: function (e) {
                  setTimeout(() => {
                    that.myRecommendList()
                  }, 1000)
                }
              })
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
      courseList: [],
      ismore: false,
      isloading: true,
      searchVal: e.detail.value
    })
    this.recommendList(e.detail.value, this.data.pageNo)
  },
  /**
   * 点击清除搜索按钮
   */
  clearsearch: function () {
    // 点击清除搜索按钮，初始化参数
    this.setData({
      pageNo: 1,
      courseList: [],
      ismore: false,
      isloading: true,
      searchVal: ''
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
      courseList: [],
      ismore: false,
      isloading: true
    })
    wx.showNavigationBarLoading()
    if (this.data.falg == 2) {
      this.myRecommendList(this.data.pageNo)
    } else {
      this.recommendList(this.data.searchVal)
    }
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNo = this.data.pageNo;
    // console.log(98)
    //当用户上拉的时候，全局页面自增 1
    this.setData({
      pageNo: ++pageNo,
      isloading: true,
      ismore: false
    })
    if (this.data.falg == 2) {
      this.myRecommendList(this.data.pageNo)
    } else {
      this.recommendList(this.data.searchVal, this.data.pageNo)
    }
  },
  /**
   * 监听页面滚动
   */
  onPageScroll: function (e) {
    if (e.scrollTop > 0) {
      this.setData({
        searColor: '0px 2px 5px #efefef'
      })
    } else {
      this.setData({
        searColor: ''
      })
    }
  }
})