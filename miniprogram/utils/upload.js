// 上传图片
const app = getApp()
function uploadImage(FilePaths){
    let promise = new Promise((resolve,reject)=>{
            wx.showLoading({
                title: '上传中',
            })
            wx.uploadFile({
                url:app.globalData.baseUrl +'/park_manage/api/sys/file/upload',
                filePath:FilePaths,
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
                            resolve(data.data.file_rsurl)
                            wx.hideLoading()
                        }
                    }
                
                },
                fail:(err)=>{
                    wx.hideLoading()
                    wx.showToast({
                        title: '上传错误,请重试',
                        icon: 'none',
                        duration: 2000
                    })
                    console.log("err:",err)
                    reject(err);
                },
            })
        })
    return promise 
}
module.exports={
    uploadImage
}