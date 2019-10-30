const app = getApp()
const request = require("../../utils/request.js");
Page({
  data: {
    
    baseUrl: app.globalData.baseUrl,
    userId: app.globalData.user.memberId,
    param:{
      content:'',
      type:'1',
      createBy: app.globalData.user.memberId,
      pics: [],
    }
  },
  onLoad: function (options) {

  },
  /**
   * 点击取消按钮
   */
  cancel:function(){
    wx.showModal({
      title: '确定要取消发布吗',
      success:function(res){
        if(res.confirm){
          wx.navigateBack({
            delta: 2
          })
        }
      }
    })
  },
  /**
   * 发布信息
   */
  releaseInfo(){
    if (this.data.param.content == ''){
      wx.showToast({
        title: '内容不能空信息'
      })
    }else{
      let param = Object.assign({}, this.data.param)
      param.pics = param.pics.join()
      request.postRequest('bbs/info/bbsInfo/crud/save', param).then(res => {
        if (res.code == 200) {
          wx.redirectTo({
            url: '../index/index',
          })
        }
      })
    }
  },
  /**
   * 文本域内容改变
   */
  formInputChange(e) {
    const comment = e.detail.value
    this.setData({
      'param.content': comment
    })
  },
  /**
   * 点击上传图片
   */
  chooseImg() {
    let that = this;
    let len = this.data.param.pics;
    if (len >= 9) {
      this.setData({
        lenMore: 1
      })
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths
        // console.log(res);
        let pics = that.data.param.pics;
        for (let i = 0; i < tempFilePaths.length; i++) {
          // console.log(tempFilePaths[i])
          if (pics.length < 9) {
            wx.showLoading({
              title: '上传中',
            })
            wx.uploadFile({
              url: that.data.baseUrl +'/park_manage/api/sys/file/upload',
              filePath:tempFilePaths[i],
              name:'file',
              header:'',
              formData:{
                accessToken: app.globalData.user.accessToken,
                userId: app.globalData.user.memberId,
                dfsType:'0'
              },
              success:function(e){
                let data = JSON.parse(e.data)
                if(e.statusCode == 200){
                  if(data.code==200){
                    pics.push(data.data.file_rsurl)
                    that.setData({
                      'param.pics':pics
                    });
                    wx.hideLoading()
                  }
                }
                
              }
            })
          } else {
            that.setData({
              'param.pics':pics
            })
            wx.showModal({
              title: '提示',
              content: '最多只能有九张图片'
            })
            return;
          }
        }
        that.setData({
          'param.pics':pics
        })
      }
    })
  },
  /**点击图片放大 */
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let pics = this.data.param.pics;
    wx.previewImage({
      current: pics[index],
      urls: pics,
    })
  },
  /**点击删除图片 */
  deleteImg(e) {
    let _index = e.currentTarget.dataset.index;
    // console.log(e)
    let pics = this.data.param.pics;
    pics.splice(_index, 1);
    this.setData({
      'param.pics':pics
    })
  }
})