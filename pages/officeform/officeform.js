const app = getApp();
const request = require("../../utils/request.js")
const util = require("../../utils/util.js")
const computedBehavior = require('miniprogram-computed')
Page({
  data:{
    configInit:''
  },
  onLoad:function(options){
    // console.log(options)
    let { id, title, price, unitname, depositTypeName, name, depositAmount, unit} = options;
    wx.setNavigationBarTitle({
      title: '预定'+ options.title ,
    })
    this.setData({
      configInit:options
    })
  }
});
