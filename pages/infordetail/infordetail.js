// pages/infordetail/infordetail.js
const app = getApp()
const request = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    contentText:null,
    isloading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.infordetail()

  },
  /**
   * 请求详情信息
   */
  infordetail:function(){
    request.getRequest('cms/info/cmsInfo/crud/get',{id:this.data.id}).then(res=>{
      if(res.code==200){
        let data = res.data
        let dataContent=data.content || '暂无内容'
        data.content =dataContent.replace(/<img[^>]*>/gi, function (match, capture) {
            match = match.replace(/<img/gi, `<img style=""`);
            return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
        });


        this.setData({
          contentText: data,
          isloading:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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