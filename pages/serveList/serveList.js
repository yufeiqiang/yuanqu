const app = getApp()
const request = require("../../utils/request.js");
Page({
    data:{
      winHeight:"",//窗口高度
      currentTab:0, //预设当前项的值
      scrollLeft:0, //tab标题的滚动条位置
      titleList:['宽度申报','网络保障','装修服务','送水服务','其他服务'],
      list:[[],[],[],[],[]],
      param:{
        type:'',
        createBy: app.globalData.user.memberId,
        pageSize:'100',
        pageNo:'1'
      }
    },
    /**
     * 点击每一项
     */
    itmeDetail(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../serveListDetail/serveListDetail?id='+id+'',
      })
    },
    // 滚动切换标签样式
    switchTab:function(e){
      console.log(e.detail.current)
      this.requestList(e.detail.current+1)
        this.setData({
            currentTab:e.detail.current
        });
        this.checkCor();
    },
    /**请求数据 */
    requestList(digit=1){
      // console.log(digit)
      this.setData({
        'param.type': digit
      })
      let param = this.data.param
      wx.showLoading({
        title: '加载中',
      })
      request.getRequest('tdo/serverreginfo/tdoServerReginfo/crud/pagelist',param).then((res)=>{
        if(res.code==200){
          let data = res.data.list
          let list = this.data.list;
          list[digit-1]=res.data.list
          this.setData({
            list: list
            // [`list.${digit}`]:res.data.list
          })
          
          // console.log(data)
          // this.changeData(res.data.list)
        }
      })
    },
    // 点击标题切换当前页时改变样式
    swichNav:function(e){
        var cur=e.target.dataset.current;
        let _num = cur+1
        this.requestList(_num)
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
    onLoad: function() {  
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
      //进入页面请求数据
      this.requestList()
      // this.requestList(2)
      // this.requestList(3)
      // this.requestList(4)
      // this.requestList(5)
    }, 
  onShow:function(){
    this.requestList()
    this.requestList(2)
    this.requestList(3)
    this.requestList(4)
    this.requestList(5)
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }, 
})