const app = getApp()
const request = require("../../utils/request.js");
const check =  require("../../utils/check.js")
const upload= require("../../utils/upload.js")
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
    this.setData({
      'param.createBy':app.globalData.user.memberId
    })
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
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 发布信息
   */
  releaseInfo(){
    let that= this;
    if (this.data.param.content == ''){
      wx.showToast({
        title: '内容不能空信息'
      })
    }else{
      wx.cloud.callFunction({
        name: 'checkContent', data: {
          txt: that.data.param.content
        }
      }).then(res => {
        if(res.result.errCode == 87014){
          wx.showToast({
            icon:'none',
            title:'此内容涉嫌违规,发布失败!'
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
    let pics = this.data.param.pics;
    if (pics >= 9) {
      this.setData({
        lenMore: 1
      })
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: (res) => {
        var tempFilesSize = res.tempFiles[0].size
        let tempFilePaths = res.tempFilePaths;
        if(tempFilesSize>1048576){
          wx.showToast({
            title:'上传图片不能大于1M!',  //标题
            icon:'none'       //图标 none不使用图标，详情看官方文档
          })
          return
        }
        this.checkImgNuber(tempFilePaths)
      }
    })
  },
  /**
   * 
   * @param {*} imgList
   * 遍历检测每一张图片，并且上传到服务器 
   */
  async checkImgNuber(imgList){
    let picList=this.data.param.pics;
    for (let i = 0; i < imgList.length; i++) {
        let  resNumber =await check.imgCheck(imgList[i])
        if(resNumber != 0) return;
        let data =await upload.uploadImage(imgList[i])
        picList.push(data)
        this.setData({
          'param.pics':picList
        })
    }
  },
  /**点击图片放大 */
  previewImg(e) {
    let that = this
    let index = e.currentTarget.dataset.index;
    let pics = this.data.param.pics;
    let newpics=pics.map(function(item){
      return that.data.baseUrl+item
    })
    wx.previewImage({
      current:newpics[index],
      urls:newpics,
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