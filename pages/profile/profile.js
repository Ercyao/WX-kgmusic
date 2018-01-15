// pages/profile/profile.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    collectlen:0,
    latelylen:0,
    isShow:true,
    latelySong:[],
    latelySongShow:false
  },
  // 跳到到playlist页面
  playlistTap:function(){
    wx.navigateTo({
      url: '../playlist/playlist'
    })
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
  // 点击显示或隐藏最近听过歌的列表
  latelySongTap:function(){
    this.setData({
      latelySongShow: !this.data.latelySongShow,
    });  
  },
  onShow:function(){
    this.setData({
      playlist: app.globalData.playlist,
      latelySong: app.globalData.latelySong
    });
    //显示隐藏是否最近听过歌的提示
    if (this.data.latelySong) {
      this.setData({
        isShow: true,
      });
    } else {
      this.setData({
        isShow: false,
      });
    }
    //收藏歌曲的数量
    var collectlen = this.data.playlist;
    if (collectlen) {
      this.setData({
        collectlen: collectlen.length
      });
    }
    //最近听过的歌的数量
    var latelylen = this.data.latelySong;
    if (latelylen){
      this.setData({
        latelylen: latelylen.length
      });
    }
  },
  onLoad: function (options) {
  },
  onShareAppMessage: function () {
    return {
      title: '享听 —— 听你想听！',
      desc: '这是ercyao制作的音乐微信小程序',
      path: '/pages/index/index'
    }
  }
})