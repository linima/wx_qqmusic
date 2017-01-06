var util = require('../../utils/util.js')

var app = getApp()

Page({
	data: {
		playingSong: {},
		songUrl: '',
		songImg: '',
		songState: {
			progress: 0,
			currentPosition: '00:00',
			duration: '00:00'
		},
		isPlaying: true,
		lyric: ''
	},
	onLoad: function(){
		console.log('playsong onLoad');

		let that = this;
		let songdata = app.globalData.songData;
		
		that.setData({
			playingSong: songdata,
			songUrl: 'http://ws.stream.qqmusic.qq.com/C100' + songdata.songmid + '.m4a?fromtag=38',
			songImg: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songdata.albummid + '.jpg',
		});

		let thatData = that.data;
		wx.playBackgroundAudio({
			dataUrl: thatData.songUrl,
			title: thatData.playingSong.songname,
			coverImgUrl: thatData.songImg,
			success: function(res){
				//do something
			}
		});
	},
	onReady: function(){
		console.log('playsong onReady');
		let that = this;
		that.songPlay();

		wx.onBackgroundAudioPlay(function(){
			console.log('播放了');
			that.songPlay();
		});
	},
	timeToString: function(duration){
		let str = '';
		let minute = parseInt(duration/60) < 10 ? ('0'+ parseInt(duration/60)) : (parseInt(duration/60));
		let second = duration%60 < 10 ? ('0'+duration%60) : (duration%60);
		str = minute+':'+second;
        return str;
	},
	songPlay: function(){
		let that = this;
		let inv = setInterval(function(){
			wx.getBackgroundAudioPlayerState({
				success: function(res){
					if(res.status == 1){
						that.setData({
							isPlaying: true,
							songState: {
								progress: res.currentPosition/res.duration*100,
								currentPosition: that.timeToString(res.currentPosition),
								duration: that.timeToString(res.duration)
							}
						})
					}else{
						that.setData({
							isPlaying: false
						});
						clearInterval(inv);
					}
				}
			});
		}, 1000);
	},
	songToggle: function(){
		let that = this;

		if(that.data.isPlaying){
			wx.pauseBackgroundAudio();
		}else{
			wx.playBackgroundAudio({
				title: that.data.playingSong.songname,
				coverImgUrl: that.data.songImg
			});
		};

		that.songPlay();
	}
})