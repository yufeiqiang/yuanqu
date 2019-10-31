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
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height:device.windowHeight, // 画布高度
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
  chooseImg(){
    let that=this
    wx.uploadFile({
      // url: 'http://192.168.0.65:8080' + '/park_manage/api/sys/file/upload',
      url: 'https://www.zhiqushequ.cn' + '/park_manage/api/sys/file/upload',
      filePath: that.data.tempFilePath,
      name: 'file',
      header: '',
      formData: {
        accessToken: app.globalData.user.accessToken,
        userId: app.globalData.user.memberId,
        dfsType: '0'
      },
      success: function (e) {
        console.log(e.msg)
        let data = JSON.parse(e.data)
        if (e.statusCode == 200) {
          if (data.code == 200) {
            pics.push(data.data.file_rsurl)
            that.setData({
              'param.pics': pics
            });
            wx.hideLoading()
          }
        }

      }
    })
    // wx.chooseImage({
    //   sizeType: ['original', 'compressed'],
    //   success: (res) => {
    //     let tempFilePaths = res.tempFilePaths
    //     console.log(tempFilePaths)
    //     wx.showLoading({
    //       title: '上传中',
    //     })
    //     wx.uploadFile({
    //       url: that.data.baseUrl + '/park_manage/api/sys/file/upload',
    //       filePath: tempFilePaths[0],
    //       name: 'file',
    //       header: '',
    //       formData: {
    //         accessToken: app.globalData.user.accessToken,
    //         userId: app.globalData.user.memberId,
    //         dfsType: '0'
    //       },
    //       success: function (e) {
    //         let data = JSON.parse(e.data)
    //         if (e.statusCode == 200) {
    //           if (data.code == 200) {
    //             pics.push(data.data.file_rsurl)
    //             that.setData({
    //               'param.pics': pics
    //             });
    //             wx.hideLoading()
    //           }
    //         }

    //       }
    //     })
    //   }
    // })
  },
  /**
   * 修改头像
   */
  requestPhoto: function () {
    let params = {
      memberId: this.data.memberId,
      url: 'uc/member/update',
      images: '/ress/staticpm/images/651e65aeea164db5bdb2c3492aaf17a6/e902b99cbc3747fb4275f9b6663c25da.jpg',
      name:'',
      sex:'',
      idCard:''
      
    };
    request.getRequest('uc/member/update', params).then(res => {
      console.log(res)
    
      // console.log(res)
    }).catch(err => { })
  },
  /**
   * 点击跳转到详情
   */
  officedetail(e){
    console.log(e)
    let type= e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../officeSuccList/officeSuccList?type='+type+'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
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

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        self.cropper.pushOrign(src)
      }
    })
  },
  getCropperImage () {
      var that=this
      this.wecropper.getCropperImage((tempFilePath) => {
        // tempFilePath 为裁剪后的图片临时路径
        if (tempFilePath) {
          console.log(tempFilePath)
          that.setData({
            tempFilePath
          })
          console.log(app.globalData.user.accessToken)
          console.log(app.globalData.user.memberId)
          // wx.previewImage({
          //   current: '',
          //   urls: [tempFilePath]
          // })
          wx.showLoading({
            title: '上传中',
          })
          // wx.uploadFile({
          //   url: that.data.baseUrl + '/park_manage/api/sys/file/upload',
          //   filePath: tempFilePath,
          //   name: 'file',
          //   header: '',
          //   formData: {
          //     accessToken: app.globalData.user.accessToken,
          //     userId: app.globalData.user.memberId,
          //     dfsType: '0'
          //   },
          //   success: function (e) {
          //     let data = JSON.parse(e.data)
          //     if (e.statusCode == 200) {
          //       if (data.code == 200) {
          //         pics.push(data.data.file_rsurl)
          //         that.setData({
          //           'param.pics': pics
          //         });
          //         wx.hideLoading()
          //       }
          //     }

          //   },
          //   fail:function(e){
          //     console.log(e)
          //   }
          // })
        } else {
          console.log('获取图片地址失败，请稍后重试')
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