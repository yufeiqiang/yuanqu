// 检测图片是否合格图片大小【1m】
function imgCheck(img){
    if(!img){
        return
    }
    wx.showLoading({title:'图片校验中'})
    let promise = new Promise((resolve,reject)=>{
            wx.getFileSystemManager().readFile({
                filePath: img,
                success:buffer=>{
                    wx.cloud.callFunction({
                        name: 'checkContent',
                        data: {
                            value: buffer.data
                        }
                    }).then((res)=>{
                        wx.hideLoading()
                        console.log(res)
                        if(res.result.errCode == '87014'){
                            wx.showToast({
                                title: '图片含有违法违规内容',
                                icon:'none',
                            })
                            resolve(res.result.errCode)
                        }else{
                            resolve(res.result.imageR.errCode)
                        }
                       
                    }).catch(err=>{
                        wx.hideLoading()
                        // console.log('imgCheck 失败====',err)
                        reject(err);
                        wx.showToast({
                            title: '校验失败，请稍后再试',
                            icon:'none',
                        })
                    })
                },
                fail: (err) =>{
                    reject(err)
                }
            })
        
        })
        return promise
}
module.exports={
    imgCheck
}