// pages/my/my.js
const app = getApp()
const request = require("../../utils/request.js")

const WeCropper = require("../we-cropper/we-cropper.min.js")
// import WeCropper from '../we-cropper/we-cropper.min.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: app.globalData,
    memberId: app.globalData.user.memberId,
    baseUrl: app.globalData.baseUrl,
    tempFilePath:'',
    images:'',
    chooseImg:false,
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height:device.windowHeight-46, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 200) / 2,
        y: (width - 200) / 2, 
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
  },
  uploadTap() {
    const self = this
    // console.log(1244)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        self.cropper.pushOrign(src)
        self.setData({
          chooseImg:true
        })
      }
    })
  },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage () {
      var that=this
    if (that.data.chooseImg){
      this.wecropper.getCropperImage((tempFilePath) => {
        // tempFilePath 为裁剪后的图片临时路径
        console.log(tempFilePath)
        if (tempFilePath) {
          that.setData({
            tempFilePath
          })
          wx.showLoading({
            title: '上传中',
          })
          wx.uploadFile({
            url: that.data.baseUrl + '/park_manage/api/sys/file/upload',
            filePath: tempFilePath,
            name: 'file',
            header: '',
            formData: {
              accessToken: app.globalData.user.accessToken,
              userId: app.globalData.user.memberId,
              dfsType: '0'
            },
            success: function (e) {
              let data = JSON.parse(e.data)
              if (e.statusCode == 200) {
                if (data.code == 200) {
                  that.setData({
                    'images': data.data.file_rsurl
                  });
                  that.requestPhoto(data.data.file_rsurl)
                  wx.hideLoading()
                }
              }
            },
            fail:function(e){
              wx.showToast({
                title:"上传失败"
              })
            }
          })
        } else {
          console.log('获取图片地址失败，请稍后重试')
        }
      })
    } else {
      wx.showToast({
        title: '您还没选择图片！',
        icon: 'none'
      })
    }
  },
  /**
   * 修改头像
   */
  requestPhoto: function (images) {
    let params = {
      memberId: this.data.memberId,
      url: 'uc/member/update',
      images: images,
      name:'',
      sex:'',
      idCard:''
      
    };
    request.getRequest('uc/member/update', params).then(res => {
      if(res.code==200){
        wx.showToast({
          title:"修改成功"
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        },1000)
      }
    }).catch(err => { })
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