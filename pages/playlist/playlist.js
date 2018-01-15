// pages/playlist/playlist.js
var app = getApp();

Page({
  data: {
    playlist:[]
  },
  // 跳到到Play播放页面
  onPlayTap: function (e) {
    let hash = e.currentTarget.dataset.hash;
    app.globalData.hash = hash;
    wx.switchTab({
      url: '../play/play',
      success: function (e) {    //刷新页面
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
        playlist: app.globalData.playlist
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