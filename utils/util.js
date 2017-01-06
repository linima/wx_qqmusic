function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//过滤器
function formatWan(n){
  n = n.toString();
  return (n/10000).toFixed(1) +'万';
}

//获取推荐频道数据
function getRecommend(callback) {
  wx.request({
    url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'GET',
    header: {'content-Type': 'application/json'},
    success: function(res){
      if(res.statusCode == 200){
        callback(res.data);
      }
    }
  })
}

//获取热门搜索
function getHotSearch(callback){
  wx.request({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'GET',
    header: {'content-Type': 'application/json'},
    success: function(res){
      if(res.statusCode == 200){
        let data = res.data;
        data.data.hotkey = data.data.hotkey.slice(0,8)
        callback(data);
      }
    }
  })
}

//获取搜索结果
function getSearchMusic(keyword, page, callback){
  wx.request({
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: keyword,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      p: page,
      remoteplace: 'txt.mqq.all',
      _: Date.now()
    },
    method: 'GET',
    header: {'content-Type': 'application/json'},
    success: function(res){
      if(res.statusCode == 200){
        callback(res.data);
      }
    }
  })
}


/*
** 排行榜相关api
*/

//获取排行榜频道数据
function getToplist(callback){
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    data: {
      format: 'json',
      g_tk: 5381,
      uin: 0,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: Date.now()
    },
    method: 'GET',
    header: {'content-Type': 'application/json'},
    success: function(res){
      if(res.statusCode == 200){
        let data = res.data;
        let toplist = data.data.topList;
        for(let i=0; i<toplist.length; i++){
          toplist[i].listenCount = formatWan(toplist[i].listenCount);
        }
        callback(data);
      }
    }
  })
}
//获取排行榜详细信息
function getToplistInfo(id, callback){
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      tpl: 3,
      page: 'detail',
      type: 'top',
      topid: id,
      _: Date.now()
    },
    method: 'GET',
    header: {'Content-Type': 'application/json'},
    success: function(res){
      if(res.statusCode == 200){
        callback(res.data);
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  getRecommend: getRecommend,
  getHotSearch: getHotSearch,
  getSearchMusic: getSearchMusic,
  getToplist: getToplist,
  getToplistInfo: getToplistInfo
}