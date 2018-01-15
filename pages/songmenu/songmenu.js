// pages/songmenu/songmenu.js
var app = getApp();
var music = require('../../utils/music.js');

Page({
  data: {
    songmenu: [],
    songlist: []
  },
  onSonglistTap:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../songlist/songlist?specialid=' + id
    });
  },
  onLoad: function () {
    music.getSongmenu(res => {
      this.setData({
        songmenu: res.plist.list.info,
      })
    });
  },
  onShareAppMessage: function () {
    return {
      title: '享听 —— 听你想听！',
      desc: '这是ercyao制作的音乐微信小程序',
      path: '/pages/index/index'
    }
  }
})