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
    userId: '',
    commentList:null,
    pageNo: 1,
    id:'',
    content: '',
    releaseFocus:false,
    releaseName:'',
    commentConten:{
      type:1,
      infoId:'',
      createBy:'',
      comment:'',
      parentId:''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      'commentConten.createBy':app.globalData.user.memberId,
      userId:app.globalData.user.memberId
    })
    this.recommendList();
    console.log(app.globalData.user)
  },
  /**删除每项信息 */
  deleteItem(e) {
    let id = e.currentTarget.dataset.id;
    let memberId =app.globalData.user.memberId;
    let that = this
    wx.showModal({
      title: '删除信息',
      content: '你确定删除此信息吗？',
      success: function (e) {
        if (e.confirm) {
          request.postRequest('/bbs/info/bbsInfo/del', { id: id, memberId: memberId }).then((res) => {
            if (res.code == 200) {
              wx.showToast({
                title: '删除' + res.msg,
                success:function(e){
                  setTimeout(()=>{
                    wx.navigateBack({
                      delta: 1
                    })
                  },1000)
                }
              })
             
            }
            // that.setData({
            //   pageNo: 1,
            //   list: [],
            //   ismore: false,
            //   isloading: true
            // })
            // that.recommendList('', that.data.pageNo, that.data.type)
          })
        }
      }
    })

  },
  /**
   * 点击头像跳转到个人圈子
   */
  circle(e) {
    let id = e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../circle/circle?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 点击关注
  */
  follow(e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    // console.log(id)
    this.followRequest(type,id)
  },  
  /**
   * 点击关注 点赞
   */
  followRequest(type='1',id){
    let param = {
      type: type,
      memberId: app.globalData.user.memberId,
      id:id
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
  /**点击回复 */
  bindReply: function (e) {
    let id = e.currentTarget.dataset.id
    let releaseName = e.currentTarget.dataset.releasename
    this.setData({
      releaseFocus: true,
      'commentConten.parentId':id,
      releaseName: releaseName
    })
  },
  /**
   * 请求列表数据
   */
  recommendList() {
    //初始化请求参数
    let param = {
      id: this.data.id,
      memberId:app.globalData.user.memberId,
    }
    request.getRequest('bbs/info/bbsInfo/detail', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
          this.setData({
            list: res.data,
            isloading: false,
            'commentConten.infoId':res.data.id
          })
        this.commentData(res.data.id)
      }
    })
  },
  /**
   *  提交评论信息
   */
  commentSub(){
    let that = this
    if (this.data.commentConten.comment != ''){
      wx.cloud.callFunction({
        name: 'checkContent', data: {
          txt: that.data.commentConten.comment
        }
      }).then(res => {
        // console.log(res)
        if(res.result.errCode == 87014){
          wx.showToast({
            icon:'none',
            title:'此内容涉嫌违规,发布失败!'
          })
        }else{
          request.postRequest('bbs/infocomment/bbsInfoComment/comment', that.data.commentConten).then(res => {
            if(res.code==200){
              that.commentData();
              that.recommendList()
              that.setData({
                'commentConten.comment': ''
              })
            }
          })
        }
      
      })
      
    }
  },
  /**
   * 评论列表数据
   */
  commentData(infoId){
    let param = {
      type: 1,
      memberId: app.globalData.user.memberId,
      infoId:infoId,
      pageSize:100,
      pageNo:1,
    }
    // param = encodeURIComponent(param)
    request.getRequest('bbs/infocomment/bbsInfoComment/page', param).then(res => {
      if (res.code == 200) {
        // 当数据不为空的时候，给列表追加数据
        this.setData({
          commentList: res.data.list,
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
   * 表单数据改变时候
   */
  formInputChange(e) {
    const comment = e.detail.value
    this.setData({
      'commentConten.comment': comment
    })
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
        this.recommendList(this.data.content, this.data.pageNo)
      },500)
    }
  },
  /**
   * 点击图片放大
   */
  /**点击图片放大 */
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let pics = this.data.list.pics.split(',');
    let that= this
    newpics=pics.map(function(item){
      return that.data.baseUrl+item
    })
    wx.previewImage({
      current: newpics[index],
      urls: newpics,
    })
  }
})