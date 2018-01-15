//数字过滤器
function formatNum(n) {
  n = n.toString();
  return (n / 10000).toFixed(1) + '万';
}

//时间过滤器
function formatTime(t){
  t = (parseInt(t));
  var minute = t / 60;
  var minutes = parseInt(minute);
  if (minutes < 10) {minutes = "0" + minutes;}
  var second = t % 60;
  var seconds = parseInt(second);
  if (seconds < 10) {seconds = "0" + seconds;}
  var time = "" + minutes + "" + ":" + "" + seconds + "";
  return time;
}

//解析歌词
function parseLyric(lrc) {
  var lyrics = lrc.split("\n");
  var lrcObj = {};
  for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i]);
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    var timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    var clause = lyric.replace(timeReg, '');
    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
      var t = timeRegExpArr[k];
      var min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
      var time = min * 60 + sec;
      lrcObj[time] = clause;
    }
  }
  return lrcObj;
}

//获取热门搜索
function getHotSearch(callback) {
  wx.request({
    url: 'http://mobilecdn.kugou.com/api/v3/search/hot',
    data: {
      format: 'json',
      plat: 0,
      count:30
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        // var data = res.data;
        // data.data.hotkey = data.data.hotkey.slice(0, 8)
        callback(res.data);
      }
    }
  })
}

//获取搜索结果
function getSearchMusic(keyword, callback) {
  wx.request({
    url: 'http://mobilecdn.kugou.com/api/v3/search/song',
    data: {
      format: 'json',
      keyword: keyword,
      page:1,
      pagesize:20,
      showtype:1
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}



//音乐新歌榜
function getNewsong(callback) {
  wx.request({
    url: 'http://m.kugou.com/?json=true',
    data: {
      json: true
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          list[i].duration = formatTime(list[i].duration);
        }
        callback(res.data);
      }
    }
  });
}
// 音乐排行榜
function getRankclass(callback) {
  wx.request({
    url: 'http://m.kugou.com/rank/list',
    data: {
      json: true
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}
//排行版分类歌曲列表
function getRanklist(rankid,callback) {
  wx.request({
    url: 'http://m.kugou.com/rank/info',
    data: {
      json: true,
      rankid: rankid
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        var ranklist = res.data.songs.list;
        for (var i = 0; i < ranklist.length; i++) {
          ranklist[i].duration = formatTime(ranklist[i].duration);
        }
        callback(res.data, ranklist[0]);
      }
    }
  })
}
//歌手分类列表
function getSingerclass( callback) {
  wx.request({
    url: 'http://m.kugou.com/singer/class',
    data: {
      json: true
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}
//歌手分类的歌手列表
function getSingerlist(classid,callback) {
  wx.request({
    url: 'http://m.kugou.com/singer/list',
    data: {
      json: true,
      classid: classid
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}
//音乐歌单
function getSongmenu(callback) {
  wx.request({
    url: 'http://m.kugou.com/plist/index',
    data: {
      json: true
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  });
}
//歌单下的音乐列表
function getSonglist(specialid,callback) {
  wx.request({
    url: 'http://m.kugou.com/plist/list',
    data: {
      json: true,
      specialid: specialid
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        var ranklist = res.data.list.list.info;
        for (var i = 0; i < ranklist.length; i++) {
          ranklist[i].duration = formatTime(ranklist[i].duration);
        }
        callback(res.data);
      }
    }
  });
}
//音乐歌单
function getSongmenu(callback) {
  wx.request({
    url: 'http://m.kugou.com/plist/index',
    data: {
      json: true
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  });
}


// 获取单首歌曲的信息
function getSongInfo(hash, callback) {
  wx.request({
    url: 'http://www.kugou.com/yy/index.php?r=play/getdata',
    data: {
      hash: hash
    },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        var song = res.data.data;
        song.lyrics = parseLyric(song.lyrics);
        callback(res.data.data);
      }
    }
  });
}
module.exports = {
  getNewsong: getNewsong,
  getRankclass: getRankclass,
  getRanklist: getRanklist,
  getSingerclass: getSingerclass,
  getSingerlist: getSingerlist,
  getSongmenu: getSongmenu,
  getSonglist: getSonglist,
  getHotSearch: getHotSearch,
  getSearchMusic: getSearchMusic,
  getSongInfo: getSongInfo
}