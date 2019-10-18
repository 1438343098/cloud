var init = {
    appid: "RANIkEKxsvi7IbmYzTkIL6MX-gzGzoHsz",
    appkey: "bL7eAMgiGdnK29nJ42jmCHhW",
    sendname: prompt("请输入你的姓名"),
    jsname: prompt("请输入接收者的姓名"),
    scrolldown: document.getElementsByTagName("section")[0].scrollTop = 99999999999, //将滚动条显示在最下面

}
//1.初始化储存SDK
AV.init({
    appId: init.appid,
    appKey: init.appkey
});
//初始化时事通讯SDK   
var realtime = new AV.Realtime({
    appId: init.appid,
    plugins: [AV.TypedMessagesPlugin],  //富媒体消息插件
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

/**
*使用创建好的会话，发送信息
*@message:要发送的内容
*/
init.sendMessage = function (message, sendname, jsname) {
    var r = init.conversation(sendname, jsname).then(function (conversation) {
        return conversation.send(new AV.TextMessage(message));
    });
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
            console.log("接收到的信息", message.text);
            //将接收到的信息填充到页面
            if (message.from != init.sendname) {
                document.getElementsByTagName("section")[0].innerHTML += "<div class='other'><div class='other-head'></div><div class='other-say'>" + message.text + "</div></div>";
            }

            init.scrolldown;
        });
    }).catch(console.error);
}


//调用接收信息的方法
init.getInfo(init.jsname);
