// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    list:null,
    isloading: true,
    ismore: false,
    userId: app.globalData.user.memberId,
    commentList:null,
    pageNo: 1,
    id:'',
    content: '',
    releaseFocus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.recommendList()
  },
  /**点击回复 */
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
    })
  },
  /**
   * 请求列表数据
   */
  recommendList() {
    //初始化请求参数
    let param = {
      id: this.data.id,
      memberId:this.data.userId,
    }
    request.getRequest('bbs/info/bbsInfo/detail', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
          this.setData({
            list: res.data,
            isloading: false
          })
        this.commentData(res.data.id)
      }
    })
  },
  /**
   * 评论列表数据
   */
  commentData(infoId){
    let param = {
      type: 1,
      memberId: this.data.userId,
      infoId:infoId,
      pageSize:10,
      pageNo:1,
    }
    // param = encodeURIComponent(param)
    request.getRequest('bbs/infocomment/bbsInfoComment/page', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
        this.setData({
          commentList: res.data.list
        })
      }
    })
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
    this.recommendList(this.data.content)
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
    this.recommendList(this.data.content, this.data.pageNo)
  },
})