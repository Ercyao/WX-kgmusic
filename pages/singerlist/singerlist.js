// pages/Singerlist/Singerlist.js
var music = require('../../utils/music.js');
var app = getApp();
Page({
  data: {
    classname:'',
    singerlist: []
  },
  onLoad: function (options) {
    var classid = options.classid;
    wx.showLoading({ title: '正在加载信息...', mask: true });
    music.getSingerlist(classid, res => {
      wx.hideLoading();
      this.setData({
        classname: res.classname,
        singerlist: res.singers.list.info
      });
    });
  },
})