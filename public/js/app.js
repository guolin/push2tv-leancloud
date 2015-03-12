$( document ).ready(function(){

    var player, guid, chat,
        appid  = 'fpj2ki9n5sjv9bq6ksk9jhnbrfct4jzg5hzt9e37if092ny7';

    player = videojs(document.getElementById('video'));
    player.muted(true);
    var default_url = "media/splash-bg.mp4";
    player.src(default_url);
    player.play();

    // step1: 准备数据（获取deviceid，socket链接，短链接，）
    if(!$.cookie("DeviceID")){
        guid = getGuid();
        $.cookie("DeviceID", guid);
    }else{
        guid = $.cookie("DeviceID")
    }

    switch_step(".step0");



    chat = new AVChatClient({
      appId: appid,
      peerId: guid,
      secure:true,
      watchingPeerIds: [guid+'-remote']
    })

    //var socket = io.connect();
    //
    
    switch_step(".step0");

    chat.open().then(function(){
        console.log("链接成功");
        var remoteUrl = "http://"+window.location.host+"/remote.html%23"+guid;
        $.getJSON("/api/short?url="+remoteUrl, function(data){
            console.log(data);
            remoteUrl = data.urls[0].url_short;
            $("#qrcode").qrcode(remoteUrl);
            $("#remote_url").text(remoteUrl);
            $("#remote_url").attr("href", remoteUrl);

            switch_step(".step1");
        });
    }, function(err){
        console.log(err);

    });

    chat.on('online', function(peers) {
      //ready
      console.log("遥控器就位");
      $(".home-link-btn").hide();
      switch_step(".step2");
    });

    chat.on('offline', function(peers) {
      //返回
      $(".home-link-btn").show();
      switch_step(".step1");
    });

    chat.on('message', function(data){
        //播放 QQ
        console.log(data.msg);
        getQQVideo(data.msg).done(function(data){
            play_url(data, player);
        });
    });


});

var play_url = function(url, player){
    console.log("播放地址： "+url);
    //$("#video").removeClass("bg-video");
    $("#video").addClass("main-video");
    $("video").attr("src", url);
    //player.src(data.src);
    player.muted(false);
    player.volume(0.6);
    player.play();
}

var switch_step = function(step){
    $(".step0").hide();
    $(".step2").hide();
    $(".step1").hide();
    $(".home-content .container").removeClass('hide');
    $(step).show(500);
};

var getGuid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

var getQQVideo = function(vid){
    var url = "http://vv.video.qq.com/geturl?otype=json&charge=0&callback=abc&vid="+vid;
    var dtd = $.Deferred();
    $.ajax({
        url:url,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data){
            var videoUrl = data.vd.vi[0].url;
            dtd.resolve(videoUrl);
        }
    });
    return dtd.promise();
};

var getYoukuVideo = function(vid){
    function getFileIDMixString(seed){
        var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(''),
            mixed = [],index;
        for (var i=0, len = source.length; i< len;i++){
            seed = (seed * 211 + 30031) % 65536;
            index = Math.floor(seed/65536 * source.length);
            mixed.push(source[index]);
            source.splice(index,1);
        }
        return mixed.join('');
    };
    function getFileID(fileid, seed){
        var mixed = getFileIDMixString(seed), ids= fileid.split("*"), realId = [], idx;
        for (var i=0; i< ids.length; i++){
            idx = parseInt(ids[i],10);
            realId.push(mixed.charAt(idx));
        }
        return realId.join('');
    };
    $.ajax({
        url: 'http://v.youku.com/player/getPlaylist/VideoIDS/' + vid + '/Pf/4?__callback=',
        dataType: "jsonp",
        jsonp: "__callback",
        success: function(param){
            var d      = new Date(),
                fileid = getFileID(param.data[0]['streamfileids']['3gphd'], param.data[0]['seed']),
                sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
                k      = param.data[0]['segs']['3gphd'][0]['k'],
                st     = param.data[0]['segs']['3gphd'][0]['seconds'];
            $.ajax({
                url: 'http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1&callback=',
                dataType: "jsonp",
                jsonp: "callback",
                success: function(param){
                    console.log(param[0]['server']);
                }
            })
        }
    });
};
