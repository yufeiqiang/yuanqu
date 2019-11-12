const app = getApp()
const request = require("../../utils/request.js");
const util = require("../../utils/util.js")
Page({
    data:{
      winHeight:"",//窗口高度
      currentTab:0, //预设当前项的值
      scrollLeft:0, //tab标题的滚动条位置
      titleList:['全  部','处理中','已审核','已取消','已完成'], 
      list:[[],[],[],[],[]],
      type:'',
      param:{
        identifier:'query_order_list',
        memberId: "'" + app.globalData.user.memberId +"'",
        n:'10000',
        m:'0'
      },
      baseUrl: app.globalData.baseUrl
    },
    /**
     * 取消订单
     */
    cancelOrder(e){
      let id = e.currentTarget.dataset.id;
      let that = this;
      wx.showModal({
        title: '取消订单',
        content: '你确定取消此订单吗？',
        success: function (e) {
          if (e.confirm) {
            request.postRequest('order/order/order/cancel', { id: id }).then(res => {
              console.log(res)
              if (res.code == 200) {
                wx.showToast({
                  title: '取消成功',
                  success: function (e) {
                    setTimeout(() => {
                      that.requestList()
                    }, 1000)
                  }
                })
              }
            })
          }
        }
      })
    },
    /**
     * 点击每一项跳转到详情
     */
    succDetail(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../officeSuccDetail/officeSuccDetail?id='+id+'',
      })
    },
    // 滚动切换标签样式
    switchTab:function(e){
        this.requestList()
        this.setData({
            currentTab:e.detail.current
        });
        this.checkCor();
    },
    /**请求数据 */
    requestList(){
      let param = this.data.param
      wx.showLoading({
        title: '加载中',
      })
      // console.log(23)
      request.getRequest('ls',param,2).then((res)=>{
        var data = [];
        for(let item in res){
          if (res[item].productType == this.data.type){
            res[item].imgUrls = JSON.parse(res[item].imgUrls)
            res[item].taskTime = util.timeSlot(res[item].startTime, res[item].endTime, res[item].unitName);
            let startTime=res[item].startTime.split(' ')
            let endTime = res[item].endTime.split(' ')
            res[item].startTime = startTime[0]
            res[item].endTime = endTime[0]
            res[item].hourTime = startTime[1].substr(0, 5) + '-' + endTime[1].substr(0, 5)
            data.push(res[item]);
          }
        }

        var newlist = [];
        var titleList=this.data.titleList
        for (let i = 0; i < titleList.length;i++){
          var result=data.filter(item => {
            return item.orderStatusName == titleList[i]
          });
          newlist.push(result)
        }
        newlist.splice(0,1,data)
        this.setData({
          list: newlist
        })
      })
    },
    // 点击标题切换当前页时改变样式
    swichNav:function(e){
        this.requestList()
        var cur=e.target.dataset.current;
        let _num = cur+1
        if(this.data.currentTaB==cur){return false;}
        else{
            this.setData({
                currentTab:cur
            })
        }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor:function(){
      if (this.data.currentTab>2){
        this.setData({
          scrollLeft:300
        })
      }else{
        this.setData({
          scrollLeft:0
        })
      }
    },
    onLoad: function(e) {  
      // console.log(app.globalData.user.memberId)
        var that = this; 
        //  高度自适应
        wx.getSystemInfo( {  
            success: function( res ) {  
              var clientHeight=res.windowHeight,
                  clientWidth=res.windowWidth,
                  rpxR=750/clientWidth;
              var calc=clientHeight*rpxR;
                that.setData( {  
                    winHeight: calc  
                });  
            }  
        });
        // console.log(e.type)
      //进入页面请求数据
      this.setData({
        type:e.type,
        'param.memberId': "'" + app.globalData.user.memberId +"'",
      })
      this.requestList()
    }, 
  onShow:function(){
    // this.requestList()
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.requestList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }, 
})