// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    fType:[],
    fType1:[],
    fType2: [],
    isloading: true,
    ismore: false,
    userId: app.globalData.user.memberId,
    showMemberId:'',
    flag:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      showMemberId: options.id,
      flag:options.type
    })
    this.recommendList()
  },
  /**
   * 点击导航按钮
   */
  followBtn(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      flag: type,
      fType: type == 1 ? this.data.fType1 : this.data.fType2
    })
  },
  /**
   * 请求列表数据
   */
  recommendList() {
    //初始化请求参数
    let param = {
      // showMemberId: this.data.showMemberId,
      showMemberId: this.data.showMemberId,
      memberId: this.data.userId
    }
    request.getRequest('/bbs/infofollow/bbsInfoFollow/personalFollowAnFans', param).then(res => {
      if (res.code == 200) {
          this.branData(res.data)
      }
    })
  },
  /**
   * 不返回来的数据分为关注、粉丝
   */
  branData(data){
    let fType1 = data.filter(res=>{
      return res.fType == 1 
    })
    let fType2 = data.filter(res => {
      return res.fType == 2
    })
    this.setData({
      ismore:true,
      fType: this.data.flag == 1 ? fType1:fType2,
      fType1:fType1,
      fType2:fType2,
      isloading: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 当用户下拉的时候，将页码设置为1，同时清空列表数组
    this.setData({
      ismore: false,
      isloading: true
    })
    wx.showNavigationBarLoading()
    this.recommendList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /**
  * 点击关注
  */
  follow(e) {
    let id = e.currentTarget.dataset.id
    // console.log(id)
    this.followRequest(1, id)
  },
  /**
   * 点击关注 点赞
   */
  followRequest(type = '1', id) {
    let param = {
      type: type,
      memberId: this.data.userId,
      id: id
    }
    wx.showLoading()
    request.postRequest('bbs/infofollow/bbsInfoFollow/followAndPraise', param).then((res) => {
      if (res.code == 200) {
        this.recommendList();
        // this.setData({
        //   [`list.[${index}].praiseCount`]: res.data
        // })
      }
    })
  },
})