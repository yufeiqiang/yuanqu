// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    list: [],
    isloading: true,
    ismore: false,
    userId: app.globalData.user.memberId,
    pageNo: 1,
    type:1,
    content: '',
    searColor: '',
    flag:1,
    param:{},
    titleBtn:['最新','最热','关注']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeId: options.typeId
    })
    this.recommendList('', this.data.pageNo,this.data.type)
    
  },
  onShow:function(){
    this.setData({
      list:[]
    })
    this.recommendList('', 1, this.data.type)
  },
  /**
   * 点击头部导航
   */
  titleBarBtn(e){
    // console.log(e.currentTarget.dataset)
    this.setData({
      type: e.currentTarget.dataset.index,
      list:[],
      content:'',
      pageNo:1,
      ismore:false
    })
    this.recommendList('', this.data.pageNo, this.data.type)
  },
  /**
   * 点击每条信息
   */
  forumDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../indexdetail/indexdetail?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 点击头像跳转到个人圈子
   */
  circle(e){
    let id = e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../circle/circle?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**删除每项信息 */
  deleteItem(e){
    let id = e.currentTarget.dataset.id;
    let memberId=app.globalData.user.memberId;
    let that=this
    wx.showModal({
      title: '删除信息',
      content: '你确定删除此信息吗？',
      success: function (e){
        if (e.confirm){
          request.postRequest('/bbs/info/bbsInfo/del', { id: id, memberId: memberId }).then((res) => {
            if (res.code == 200) {
              wx.showToast({
                title:'删除'+res.msg,
              })
            }
            that.setData({
              pageNo: 1,
              list: [],
              ismore: false,
              isloading: true
            })
            that.recommendList('', that.data.pageNo, that.data.type)
          })
        }
      }
    })
    
  },
  /**
   * 请求列表数据
   */
  recommendList(val = '', pageNo = 1, type=1) {
    //初始化请求参数
    let param = {
      type: type,
      content: val,
      memberId:app.globalData.user.memberId,
      pageSize: 5,
      pageNo: pageNo,
    }
    request.getRequest('bbs/info/bbsInfo/page', param).then(res => {
      if (res.code == 200) {
        let oldData = this.data.list;
        // 当数据不为空的时候，给列表追加数据
        if (res.data.list !== undefined) {
          this.setData({
            list: oldData.concat(res.data.list),
            isloading: false
          })
        } else {
          // 当请求到数据为空的时候，显示没有更多提示，同时隐藏加载中按钮
          this.setData({
            ismore: true,
            isloading: false
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
    console.log(e.detail.value)
    this.setData({
      pageNo: 1,
      list: [],
      ismore: false,
      isloading: true,
      content: e.detail.value
    })
    this.recommendList(e.detail.value, this.data.pageNo, this.data.type)
  },
  /**
   * 点击清除搜索按钮
   */
  clearsearch: function () {
    // 点击清除搜索按钮，初始化参数
    this.setData({
      pageNo: 1,
      list: [],
      ismore: false,
      isloading: true,
      content: ''
    })
    this.recommendList('',this.data.pageNo, this.data.type)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 当用户下拉的时候，将页码设置为1，同时清空列表数组
    this.setData({
      pageNo: 1,
      list: [],
      ismore: false,
      isloading: true
    })
    wx.showNavigationBarLoading()
    this.recommendList(this.data.content,this.data.pageNo,this.data.type)
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
    if(!this.data.ismore){
      setTimeout(()=>{
        this.setData({
          pageNo: ++pageNo,
          isloading: true,
          ismore: false
        })
        this.recommendList(this.data.content, this.data.pageNo,this.data.type)
      },500)
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
  },
  /**
   * 点赞关注
   */
  fabulous: function (e){
    const { type,id,index} = e.currentTarget.dataset
    let param = {
      type: type,
      memberId:app.globalData.user.memberId,
      id: id
    }
    this.setData({
      param
    })
    wx.showLoading()
    request.postRequest('/bbs/infofollow/bbsInfoFollow/followAndPraise', param).then((res) => {
       if(res.code==200){
        this.setData({
          [`list.[${index}].praiseCount`]:res.data
        })
        wx.hideLoading()
       }

    })
  }
})