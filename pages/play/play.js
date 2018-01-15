var app = getApp();
var music = require('../../utils/music.js');
var playlist = [];             //收藏歌曲列表
var latelySong = [];           //最近听歌列表

Page({
  data: {
    colorShow:null,
    SongList: [],              //播放列表
    listShow: false,
    isPlaying: false,          //播放和暂停按钮切换显示
    song: {},                  //歌曲信息
    lyrics: [],                //歌词信息    
    toView: 0,                 //指定滚动的歌词
    currentId: 0,              //要提亮的歌词
    sliderVal: '',             //进度条的值
    collectShow: true          //收藏歌曲icon
  },
  //添加最近听过的歌
  latelySong: function () {
    var song = this.data.song;
    if (latelySong.length > 0) {
      if (latelySong.length < 20){
        for (var i = 0; i < latelySong.length; i++) {
          if (song.hash != latelySong[i].hash) {
            return latelySong.unshift(song);
          }
          else{
            return ;
          }
        }
      }
    } else {
      latelySong.push(song);
    }
    app.globalData.latelySong = latelySong;
    this.setData({ latelySong: latelySong });
  },
  //点击切换收藏或取消歌曲
  collectTap: function () {  
    var song = this.data.song;
    if (!this.data.collectShow){
        for (var i = 0; i < playlist.length; i++) {
          if (song.hash == playlist[i].hash) {
            wx.showToast({ title: '取消成功', icon: 'success', duration: 1000 })
            this.setData({ collectShow: true });
            playlist.splice(i, 1);
            break;
          }
        }
    }else{
        wx.showToast({ title: '收藏成功', icon: 'success', duration: 1000 })
        this.setData({ collectShow: false });
        playlist.push(song)
    }
    app.globalData.playlist = playlist;
    this.setData({ playlist: playlist });
  },
  //判断是否是收藏了的
  changeCollectShow:function () {
    var colhash = app.globalData.hash;
    var playlist = this.data.playlist;
    if (playlist.length > 0) {
      for (var i = 0; i < playlist.length; i++) {
        if (colhash == playlist[i].hash) {
          return this.setData({ collectShow: false });
        }
      }
      return this.setData({ collectShow: true });
    } else {
      this.setData({ collectShow: true });
    }
  },
  // 歌词面板事件
  lyrScroll: function () {
  },
  // 进度条改变触发事件
  sliderChange: function (e) {
    var unit = this.data.duration / 100;
    var seek = e.detail.value * unit;
    this.audioCtx.seek(seek);
    this.setData({
      sliderVal: e.detail.value,
      unit: unit
    });
  },
  // 音频进度改变触发事件
  timeUpdate: function (e) {
    var duration = e.detail.duration;
    var currentTime = e.detail.currentTime;
    var sliderVal = currentTime / (duration / 100);
    // 存储歌词下标
    var lyrics = this.data.lyrics;
    var lyr = [];
    for (var i = 0; i < duration; i++) { if (lyrics[i]) { lyr.push(i); } }
    this.setData({
      duration: duration,
      currentTime: currentTime,
      sliderVal: sliderVal,
      lyr: lyr
    });
    // 匹配歌词
    for (var j = 0; j < lyr.length; ++j) {
      if (currentTime >= this.data.lyr[j] && currentTime < this.data.lyr[j + 1]) {
        var num = this.data.lyr[j];
        this.setData({ toView: num, currentId: num })
      }
    }
  },
  //点击播放or暂停
  playToggle: function () {
    if (app.globalData.hash) {
      if (this.data.isPlaying) { this.audioCtx.play() } else { this.audioCtx.pause() }
      this.setData({ isPlaying: !this.data.isPlaying });
    } else {
      wx.showToast({ title: '未加载到音乐', icon: 'loading', duration: 1000 })
    }
  },
  // 隐藏歌曲列表
  listHideTap: function () {
    this.setData({ listShow: false })
  },
  // 歌曲列表
  songlistTap: function () {
    this.setData({
      listShow: true
    })
  },
  // 点击歌曲列表换歌
  changeSongTap: function (e) {
    var id = e.currentTarget.dataset.id;
    var SongList = this.data.SongList;
    var currentHash = SongList[id].hash;
    this.switchSong(currentHash);    //切歌
    this.playSet();                  //切歌设置
    this.setData({
      listShow: false,
      SongList: SongList,
    });
  },
  //切歌设置，解决换歌不能播放问题
  playSet: function () {
    var that = this;
    wx.showToast({ title: '加载音乐', icon: 'loading', duration: 500 })
    this.audioCtx.seek(0);
    this.audioCtx.pause();
    this.setData({ isPlaying: true });
    var timer = setTimeout(function () {
      that.audioCtx.play();
      that.setData({ isPlaying: false });
      that.latelySong();             //最近听歌列表
      that.changeCollectShow();      //判断歌曲是否收藏了
    }, 500);
  },
  //切歌
  switchSong: function (hash) {
    music.getSongInfo(hash, res => {
      this.setData({
        song: res,
        lyrics: res.lyrics
      });
    });
    this.setData({
      colorShow: hash
    });
  },
  //随机切换上一首
  beforeSong:function(){
    this.EndChangeSong();
  },
  //随机切换下一首
  afterSong: function () {
    this.EndChangeSong();
  },
  //播放完自动随机切歌
  EndChangeSong:function(){
    var len = this.data.SongList.length;
    var k =  Math.floor(Math.random() * len)
    var hash = this.data.SongList[k].hash;
    this.switchSong(hash);    //切歌
    this.playSet();           //切歌设置
  },
  onShow:function(){
    this.setData({listShow: false});
  },
  //页面载入事件处理函数
  onLoad: function (options) {
    var SongList = app.globalData.theSongList;
    var hash = app.globalData.hash;
    //获取播放器
    this.audioCtx = wx.createAudioContext('musicAudio');
    if (app.globalData.hash) {
      //获得歌曲列表
      var arr = [];
      for (var i = 0, len = SongList.length; i < len; i++) {
        arr.push({ filename: SongList[i].filename, hash: SongList[i].hash })
      }
      this.setData({ SongList: arr });
      this.switchSong(hash);    //切歌
      this.playSet();           //切歌设置
    } else {
      this.setData({ isPlaying: true });
      wx.showModal({
        title: '未发现音乐', content: '请选择音乐播放', success: function (res) {
          if (res.confirm) { wx.switchTab({url: '../index/index',}); } 
        } 
      });
    }
    this.setData({ playlist: playlist, latelySong: latelySong });
  },
  onShareAppMessage: function () {
    return {
      title: '享听 —— 听你想听！',
      desc: '这是ercyao制作的音乐微信小程序',
      path: '/pages/index/index'
    }
  }
})