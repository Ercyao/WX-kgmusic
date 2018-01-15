//index.js
//获取应用实例
var app = getApp();
var music = require('../../utils/music.js');

Page({
  data: {
    navbar: [
      '推荐', '分类', '搜索'
    ],
    songDate:'',
    banner: [],                  // 轮播图
    Newsong: [],                 // 新歌首发
    Rankclass: [],               // 排行榜分类
    Singerclass: [],             // 歌手分类
    Hotsearch: [],               // 热门搜索
    searchInput:'',
    inputFocus: false,           // 搜索框是否获取焦点
    scrollviewH: 0,              // 搜索结果的scrollview高度
    searchHistorys: [],          // 搜索历史记录
    Searchlist: [],              // 搜索结果
    searchBtnShow: false,        // 搜索框部分是否显示
    searchHotShow: true,         // 热门搜索是否显示
    searchHistoryShow: false,    // 搜索历史是否显示
    searchResultShow: false,     // 搜索结果是否显示
    currentTab: 0,               // 导航栏切换索引
    toView: 0,
    pageSize: 5,                 // 每次翻页大小
    totalPages: 0,               // 共有多少页
    currentPage: 1,              // 当前页码是
    animationData: {},           // 启动动画
    motto: '欢迎来到享听\n听你想听！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 删除文本框文字icon
  cancelBtnTap:function(){
    this.setData({
      inputFocus: true,
      searchInput: '',
    }) 
  },
  // 搜索取消
  SearchCancel: function () {
    that.setData({
      searchHotShow: true,
      searchHistoryShow: false,
      searchResultShow: false,
      searchCancelShow: false,
      searchKeyword: '',
      inputFocus: false
    });
  },
  // 文本框获取焦点
  FocusTap:function(e){
    var searchKeyword = this.data.searchKeyword;
    this.setData({
      searchBtnShow: true,
      searchHotShow: false,
      searchHistoryShow: true,
      searchResultShow: false
    })
  },
  // 文本框输入时
  inputChangeTap: function (e) {
    this.setData({searchKeyword: e.detail.value})
  },
  // 文本框提交
  inputConfirmTap:function(e){ 
    var searchKeyword = e.detail.value;
    var searchHistorys = this.data.searchHistorys;
    var that=this;
    if (searchKeyword.trim()) {
      if (searchHistorys.length > 0) {
        if (searchHistorys.indexOf(searchKeyword) < 0) {
          searchHistorys.unshift(searchKeyword);
        }
      } else {
        searchHistorys.push(searchKeyword);
      }
      wx.setStorage({
        key: "searchHistorysKey",
        data: searchHistorys,
        success: function () {
          that.setData({ searchHistorys: searchHistorys });
        }
      });
    }
    this.setData({ 
      searchKeyword: searchKeyword,
      searchHotShow: false, 
      searchHistoryShow: false, 
      searchResultShow: true, 
      Searchlist: [] 
    });
    this.onFetchSearchList();
  },
  // 搜索结果
  onFetchSearchList: function () {
    var searchKeyword = this.data.searchKeyword;
    music.getSearchMusic(searchKeyword,res => {
      this.setData({
        Searchlist: this.data.Searchlist.concat(res.data.info)
      });
    });
  },
  // 清除所有历史记录
  onSearchHistoryDeleteAll: function () {
    var that = this;
    wx.removeStorage({
      key: 'searchHistorysKey',
      success: function (res) {
        that.setData({ searchHistorys: [] });
      }
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 跳到到Play播放页面
  onPlayTap: function (e) {
    let hash = e.currentTarget.dataset.hash;
    app.globalData.hash = hash;
    app.globalData.theSongList = this.data.Newsong;
    wx.switchTab({
      url: '../play/play',
      success: function (e) {    //刷新页面
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  // 跳到到Ranklist排行榜列表页面
  onRanklistTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ranklist/ranklist?rankid=' + id
    });
  },
  // 跳到Singerlist歌手列表页面
  onSingerlistTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../singerlist/singerlist?classid=' + id
    });
  },
  // 新歌首发    点击翻上一页
  previousMove: function (e) {
    for (var i = this.data.Newsong.length; i > 0; i--) {
      if (i === this.data.toView) {
        this.setData({
          toView: i - 5,
          currentPage: i / 5
        })
        break
      }
    }
  },
  // 新歌首发    点击翻下一页
  nextMove: function(e){ 
    for (var i = 0; i < (this.data.Newsong.length-5); i++) {
      if (i === this.data.toView) {
        this.setData({
          toView: i+5,
          currentPage: (i + 10)/5
        })
        break
      }
    }
  },
  // 导航栏操作
  onNavbarTap: function (e) {
    this.setData({ currentTab: e.currentTarget.dataset.index });
  },
  onShow:function(){
    this.setData({
      currentTab:0,
      searchHotShow: true,
      searchHistoryShow: false,
      searchResultShow: false,
    });
  },
  onReady: function (e) {  
    //启动动画
    var animation = wx.createAnimation({
      duration: 1000,
      delay:1500,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.rotateY(90).opacity(0).step();
    this.setData({ 
      animationData: animation.export()
    })
  },
  onLoad: function () { 
    wx.showLoading({ title: '数据加载中...', mask: true });
    //推荐频道  新歌数据
    music.getNewsong(res => {
      wx.hideLoading();
      var pageSize=5;
      var Newsong = res.data;
      var totalPages = Math.ceil(Newsong.length / pageSize);
      this.setData({
        banner: res.banner,
        Newsong: Newsong,
        totalPages: totalPages
      });
    });
    //分类频道  排行榜分类
    music.getRankclass(res => {
      this.setData({
        Rankclass: res.rank.list
      })
    });
    //分类频道  歌手分类
    music.getSingerclass(res => {
      this.setData({
        Singerclass: res.list
      });
    });
    //搜索频道  热门搜索
    music.getHotSearch(res => {
      this.setData({
        Hotsearch: res.data.info
      });
    });
    // 设置search 结果scrollview的高度
    wx.getSystemInfo({
      success: res=>{
        this.setData({
          scrollviewH: res.windowHeight - 90
        });
      }
    });
    // 历史浏览记录 从本地缓存中获取前10条数据
    var searchHistorys = wx.getStorageSync('searchHistorys') || [];
    if (searchHistorys.length > 0) {
      this.setData({
        searchHistorys:searchHistorys.length >= 10? searchHistorys.slice(0, 10): searchHistorys
      });
    }
    //启动页数据
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }, 
  onShareAppMessage: function () {
    return {
      title: '享听 —— 听你想听！',
      desc: '这是ercyao制作的音乐微信小程序',
      path: '/pages/index/index'
    }
  }
})
