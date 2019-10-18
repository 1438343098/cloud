var init = {
    appid: "RANIkEKxsvi7IbmYzTkIL6MX-gzGzoHsz",
    appkey: "bL7eAMgiGdnK29nJ42jmCHhW",
    sendname: prompt("请输入你的姓名"),
    jsname: prompt("请输入接收者的姓名"),
    scrolldown: document.getElementsByTagName("section")[0].scrollTop = 99999999999,            //将滚动条显示在最下面
}
//1.初始化储存SDK
AV.init({
    appId: init.appid,
    appKey: init.appkey
});
//初始化时事通讯SDK   
var realtime = new AV.Realtime({
    appId: init.appid,
    plugins: [AV.TypedMessagesPlugin],              // 富媒体消息插件
});

/*封装创建会话的方法
*@sendname:发送信息的人
*@jsname:接收信息的人
*@return:已创建完成的会话
**/
init.conversation = function (sendname, jsname) {
    var r = realtime.createIMClient(sendname).then(function (my) {
        return my.createConversation({
            members: [init.jsname],
            name: init.sendname + "&" + init.jsname
        });
    });

    return r;
}

/*
*使用创建好的会话，发送信息
*@message:要发送的内容
*@type:消息类型1:文本消息2:图像消息
*/
init.sendMessage = function (message, sendname, jsname, type) {
    var r = null, t = type || 1;
    switch (t) {
        case 1:
            r = init.conversation(sendname, jsname).then(function (conversation) {
                return conversation.send(new AV.TextMessage(message));
            });
            break;
        case 2:
            r = init.conversation(sendname, jsname).then(function (conversation) {
                return conversation.send(new AV.ImageMessage(message));
            });
            break;
    }
    return r;
}

//发送完毕之后的回调
//message:要发送的内容
init.callBack = function (message, sendname, jsname) {
    init.sendMessage(message, sendname, jsname).then(function (me) {
        console.log("发送成功", me);
        //将输入框清空
        document.getElementById("send-text").value = "";
        //将信息显示在页面
        document.getElementsByTagName("section")[0].innerHTML += "<div class='my'><div class='my-say'>" + me._lctext + "</div><div class='my-head'></div></div>";
        //将滚动条显示在最下面
        init.scrolldown;
    });
}

//点击发送
document.getElementById("send").onclick = function () {
    var m = document.getElementById("send-text").value;
    init.callBack(m, init.sendname, init.jsname);
}


//接收信息
init.getInfo = function (jsname) {
    realtime.createIMClient(jsname).then(function (you) {
        you.on("message", function (message, conversation) {
            console.log("接收到的信息", message);
            //将接收到的信息填充到页面,需要判断接收到的消息类型,来填充至页面
            if (message.from != init.sendname) {
                if (message.type == -1) {
                    // 文本信息
                    document.getElementsByTagName("section")[0].innerHTML += "<div class='other'><div class='other-head'></div><div class='other-say'>" + message.text + "</div></div>";
                } else if (message.type == -2) {
                    // 图像信息
                    document.getElementsByTagName("section")[0].innerHTML += "<div class='other'><div class='other-head'></div><div class='other-say'>" + "<img src='" + message.content._lcfile.url + "' />" + "</div></div>";
                }
            } else {
                // 有点问题
                if (message.type == -2) {
                    // 图像信息
                    document.getElementsByTagName("section")[0].innerHTML += "<div class='my'><div class='my-say'>" + "<img src='" + message.content._lcfile.url + "' />" + "</div><div class='my-head'></div></div>";
                }
            }
            init.scrolldown;
        });
    }).catch(console.error);
}

// 发送图片
document.getElementById('file').onchange = function (e) {
    // 获取到图片或者文件的相关信息,如果只是发送图片 可以判断一下选择的类型
    var fileUploadControl = e.target.files[0];
    var file = new AV.File(fileUploadControl.name, fileUploadControl);
    file.save().then(function () {
        return init.sendMessage(file, init.sendname, init.jsname, 2);
    }).then(function () {
        console.log('发送成功');
    }).catch(console.error.bind(console));
}

// 发送表情
document.getElementById('emojiContent').onclick = function (e) {
    var httpUrl = e.target.getAttribute('src');
    var file = new AV.File.withURL('emoji' + parseInt(Math.random() * 99999) + 1, httpUrl);
    file.save().then(function () {
        return init.sendMessage(file, init.sendname, init.jsname, 2);
    }).then(function () {
        console.log('发送成功表情');
    }).catch(console.error.bind(console));
}
//调用接收信息的方法
init.getInfo(init.jsname);
