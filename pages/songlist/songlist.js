// pages/songlist/songlist.js
var app = getApp();
var music = require('../../utils/music.js');

Page({
  data: {
    songInfo: [],
    songlist: []
  },
  // 跳到到Play播放页面
  onPlayTap: function (e) {
    let hash = e.currentTarget.dataset.hash;
    app.globalData.hash = hash;
    app.globalData.theSongList = this.data.songlist;
    wx.switchTab({
      url: '../play/play',
      success: function (e) {    //刷新页面
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  onLoad: function (options) {
    var specialid = options.specialid;
    wx.showLoading({ title: '正在加载音乐...', mask: true });
    music.getSonglist(specialid, res => {
      wx.hideLoading();
      this.setData({
        songInfo: res.info.list,
        songlist: res.list.list.info,
      });
    });
  },
  /*用户点击右上角分享*/
  onShareAppMessage: function () {
    return {
      title: '享听 —— 听你想听！',
      desc: '这是ercyao制作的音乐微信小程序',
      path: '/pages/index/index'
    }
  }
})