// pages/recommend/recommend.js
const app = getApp()
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    total:'',
    list: [],
    isloading: true,
    ismore: false,
    userId: '',
    showMemberId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showMemberId: options.id
    })
    this.recommendList()
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
            that.recommendList()
          })
        }
      }
    })
    
  },
  /**
   * 请求列表数据
   */
  recommendList() {
    //初始化请求参数
    let param = {
      showMemberId: this.data.showMemberId,
      memberId: app.globalData.user.memberId
    }
    request.getRequest('bbs/infofollow/bbsInfoFollow/personalInfo', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
          this.setData({
            list: res.data.infoVos,
            total: res.data,
            isloading: false
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
      memberId: app.globalData.user.memberId,
      id: this.data.showMemberId
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
  /**
   * 点赞关注
   */
  fabulous: function (e){
    const { type,id,index} = e.currentTarget.dataset
    let param = {
      type: type,
      memberId: app.globalData.user.memberId,
      id: id
    }
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