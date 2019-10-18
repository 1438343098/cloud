


var td = "";
var time = [];
var talkPageindex = 1;                                            //查看更多历史信息
var selfval = "";
var myheadsrc = "";                   //聊天中我的头像--默认地址
var otherheadsrc = "";               //聊天中别人的头像--默认地址
var receive = "";
var sorceId = $("#kehuid").val();                    //这个类型用于判断进入聊天窗口的来源
var send = $("#cendid").val();                    //这个类型用于判断进入聊天窗口的来源
var updown = $("#isWork").val();                                   //上下线状态1.在线，0.不在线
var appId = "S97IyPXeT0wvwWvoNqURPHvK-gzGzoHsz";
var appKey = "1vkXES21dAHHPqUJpLmoGmKB";
var topFlag = false;  //置顶标识  true置顶 false置底
//置顶置底函数
function scrollTopFn(topFlag) {
    if (topFlag) {
        $("#conDetail").scrollTop(0);
    } else {
        $("#conDetail").scrollTop(999999999);
    }
}
/*
*
*填充时间
*
*/
function appendtime(time, showtime) {
    if (time.length > 1) {
        if ((time[time.length - 1] - time[time.length - 2]) / 1000 / 60 > 3) {
            return $(".conDetail").append("<p class='tc'>" + showtime + "</p>");
        }
    }
}
/*
*填充自身发送的内容
*mytext:自身发送的文本信息
*myheadsrc:头像
*/
function appendMyText(mytext, myheadsrc) {
    var myhtmltext = "<div class='other myself'><ul><li><span>" + mytext + "</span><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
    $(".conDetail").append(myhtmltext);
}
/*
*填充自身发送的内容
*myimg:自身发送的图片信息
*myheadsrc:头像
*/
function appendMyImg(myimg, myheadsrc) {
    var myhtmlimg = "<div class='other myself'><ul><li><img class='chatImg' src='" + myimg + "' alt=''><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
    $(".conDetail").append(myhtmlimg);
}

/**
*填充自身发送的语音信息
*myaudio:音频地址
*myheadsrc:头像
**/
function appendMyAudio(myaudio, myheadsrc) {
    var myhtmlaudio = "<div class='other myself'><ul><li><span class='laweryuyin'  onclick='playSound(this)'>" + myaudio + "</span><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
    $(".conDetail").append(myhtmlaudio);
}

/*
*
*红包
*/
function redbag(money) {
    var myhtmltext = "<div class='redbag'><p><img src='" + lawyer_domain + "/public/images/redbag.png'><span>收到红包请在APP上查看<small class='red'>红包金额(" + money + ")元</small>红包</span></p></div>";
    $(".conDetail").append(myhtmltext);
}
/*
*
*填充别人发过来的文本信息
*othertext:别人发送的文本
*otherheadsrc:别人的头像
*/
function appendOtherText(othertext, otherheadsrc) {
    var otherhtmltext = "<div class='other'><ul><li><p><img class='chatImg' src='" + otherheadsrc + "' alt='用户头像'></p><span>" + othertext + "</span></li></ul></div>";
    $(".conDetail").append(otherhtmltext);
}

/*
*
*填充别人发过来的文本信息
*othertext:别人发送的文本
*otherheadsrc:别人的头像
*/
function appendOtherImg(othertext, otherheadsrc) {
    var otherhtmlimg = "<div class='other'><ul><li><p><img src='" + otherheadsrc + "' alt='用户头像'></p><img src='" + othertext + "' alt=''></li></ul></div>";
    $(".conDetail").append(otherhtmlimg);

}

/**
*填充别人发过来的音频信息
*otheraudio:音频地址
*otherheadsrc:别人的头像
**/
function appendOtherAudio(otheraudio, otherheadsrc) {
    var otherhtmlaudio = "<div class='other'><ul><li><p><img src='" + otherheadsrc + "' alt='用户头像'></p><span class='useryuyin' onclick='playSound(this)'>" + otheraudio + "</span></li></ul></div>";
    $(".conDetail").append(otherhtmlaudio);
}




/**
*发送图片窗口和文字窗口的显示和影藏窗口的切换
*type:1.显示文本框2.显示图片框
**/
function sendMSGshow(type) {
    if (type == 1) {
        $(".picDiv").hide();
        $("#tarea").show();
        //scrollTopFn(topFlag);
        //$(".conDetail").scrollTop(999999999);
    } else {
        $(".picDiv").show();
        $("#tarea").hide();
        //scrollTopFn(topFlag);
        //$(".conDetail").scrollTop(999999999);
    }
}



//初始化
AV.init({
    appId: appId,
    appKey: appKey
});

var realTime = new AV.Realtime({
    appId: appId,
    plugins: [AV.TypedMessagesPlugin]
});

/**
*
*像另可闹注册聊天用户
*send:用户ID
**/
function createUser(send) {
    var client = realTime.createIMClient(send);
    return client;
}

/**
*
*创建聊天会话
*send:聊天对象的ID
*receive:聊天对象的ID
**/
function create(send, receive) {
    var conv;
    /** 先查询, 如果没有记录再创建, 并且创建时使用 unique 参数 **/
    createUser(send, receive).then(function (conversation) {
        conversation.getQuery().containsMembers([send, receive]).find().then(function (convs) {
            if (convs != null && convs != undefined && convs.length == 1) {
                conv = convs[0];
            }
        }).catch(console.error);
    });

    if (conv == null || conv == undefined) {
        return createUser(send, receive).then(function (conversation) {
            return conversation.createConversation({
                members: [receive],
                transient: false,
                unique: true
            });
        })
    }
    return conv;
}

/**
*聊天中接收信息的方法
*send:聊天对象的ID
*receive:聊天对象的ID
**/
function getInfo(send, receive) {
    if (receive == "") {
        return false;
    }
    createUser(send).then(function (conversation) {
        return conversation.on("message", function (message, conversation) {
            localStorage.setItem("fstime", new Date().getTime());
            var min = "";
            if (new Date().getMinutes() < 10) {
                min = "0" + new Date().getMinutes();
            } else {
                min = new Date().getMinutes();
            }
            localStorage.setItem("showtime", new Date().getHours() + ":" + min);
            time.push(localStorage.getItem("fstime"));
            appendtime(time, localStorage.getItem("showtime"));         /**注意不要调换代码顺序哦不然嘿嘿出问题老子不管哦**/
            if (message.from != send) {
                if (message.content._lctype == "-1") {
                    appendOtherText(message.content._lctext, otherheadsrc, 1);

                }

                if (message.content._lctype == "-2") {
                    appendOtherImg(message.content._lcfile.url, otherheadsrc, 1);

                }

                if (message.content._lctype == "-3") {
                    //语音信息
                    appendOtherImg(message.content._lcfile.url, otherheadsrc, 1);

                }

            } else {

                if (message.content._lctype == "-1") {

                    if (message.content._lctype == "-1" && message.content._lcattrs.money != "0") {
                        //红包
                        redbag(message.content._lcattrs.money);
                    } else {
                        //文本
                        appendMyText(message.content._lctext, myheadsrc, 1);
                    }

                }


                if (message.content._lctype == "-2") {
                    appendMyImg(message.content._lcfile.url, myheadsrc, 1);

                }

                if (message.content._lctype == "-3") {
                    appendMyImg(message.content._lcfile.url, myheadsrc, 1);

                }
            }

            sendMSGshow(1);
        });
    });
}


/**
*点击联系人列表的时候加载得默认10条信息
**/
function readOld(message) {
    if (message.from != send) {
        if (message.content._lctype == "-1") {
            appendOtherText(message.content._lctext, otherheadsrc);

        }
        if (message.content._lctype == "-2") {
            appendOtherImg(message.content._lcfile.url, otherheadsrc);

        }
        if (message.content._lctype == "-3") {
            appendOtherAudio(message.content._lcfile.url, otherheadsrc);
        }
    } else {
        if (message.content._lctype == "-1") {

            if (message.content._lcattrs) {
                //红包
                redbag(message.content._lcattrs.money);
            } else {
                //文本
                appendMyText(message.content._lctext, myheadsrc, 1);
            }

        }
        if (message.content._lctype == "-2") {
            appendMyImg(message.content._lcfile.url, myheadsrc);
        }

        if (message.content._lctype == "-3") {
            appendMyAudio(message.content._lcfile.url, myheadsrc)
        }
    }

    sendMSGshow(1);
}

/**
*获取历史信息的方法
*send：自身ID
*receive：对象ID
**/
function getoldInfo(send, receive) {

    if (receive == "") {
        return false;
    }
    $(".conDetail").html("");

    var limit = 10 * talkPageindex;
    return create(send, receive).then(function (conversation) {
        return conversation.queryMessages({
            limit: limit
        }).then(function (messages) {
            console.log("aaaaa", messages);
            if (messages.length == limit) {
                //$("#selectMore").show();
                var html = "<label id='selectMore' onclick='selectMore();'>点击查看更多</label>";
            } else {
                //$("#selectMore").hide();
                var html = "";
            }
            messages.map(function (message) {

                if (message.from != send) {
                    if (message.content._lctype == "-1") {
                        html += "<div class='other'><ul><li><p><img src='" + otherheadsrc + "' alt='用户头像'></p><span>" + message.content._lctext + "</span></li></ul></div>";
                    }

                    if (message.content._lctype == "-2") {
                        html += "<div class='other'><ul><li><p><img src='" + otherheadsrc + "' alt='用户头像'></p><img class='chatImg' src='" + message.content._lcfile.url + "' alt=''></li></ul></div>";
                    }

                    if (message.content._lctype == "-3") {

                        html += "<div class='other'><ul><li><p><img src='" + otherheadsrc + "' alt='用户头像'></p><span class='useryuyin' onclick='playSound(this)' data-src='" + message.content._lcfile.url + "'></span></li></ul></div>";
                    }

                } else {

                    if (message.content._lctype == "-1") {

                        if (message.content._lcattrs) {
                            //红包
                            html += "<div class='redbag'><p><img src='" + lawyer_domain + "/public/images/redbag.png'><span>收到红包请在APP上查看<small class='red'>红包金额(" + message.content._lcattrs.money + ")元</small>红包</span></p></div>";
                        } else {
                            //文本
                            html += "<div class='other myself'><ul><li><span>" + message.content._lctext + "</span><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
                        }

                    }


                    if (message.content._lctype == "-2") {
                        html += "<div class='other myself'><ul><li><img class='chatImg' src='" + message.content._lcfile.url + "' alt=''><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
                    }

                    if (message.content._lctype == "-3") {

                        html += "<div class='other myself'><ul><li><span class='laweryuyin'data-src='" + message.content._lcfile.url + "'  onclick='playSound(this)'></span><p><img src='" + myheadsrc + "' alt='律师头像'></p></li></ul></div>";
                    }
                }
                console.log(otherheadsrc + "---" + myheadsrc);
                $(".conDetail").html(html);
                scrollTopFn(topFlag);
                var scrTimer = setTimeout(function () {
                    scrollTopFn(topFlag);
                    clearTimeout(scrTimer);
                }, 100)
                /*if (td == 0) {
                    $(".conDetail").scrollTop(999999999);
                } else {
                    $(".conDetail").scrollTop(0);
                }*/
            });

        }).catch(console.error);
    }).catch(console.error);

}

/**
*发送文本信息
*send:聊天对象的ID
*receive:聊天对象的ID
*msg:文本内容
**/
function sendTextMsg(msg, send, receive) {
    return create(send, receive).then(function (conversation) {
        return conversation.send(new AV.TextMessage(msg));
    }).then(function (message) {
        localStorage.setItem("fstime", new Date().getTime());
        var min = "";
        if (new Date().getMinutes() < 10) {
            min = "0" + new Date().getMinutes();
        } else {
            min = new Date().getMinutes();
        }
        localStorage.setItem("showtime", new Date().getHours() + ":" + min);
        time.push(localStorage.getItem("fstime"));
        appendtime(time, localStorage.getItem("showtime"));         /**注意不要调换代码顺序哦不然嘿嘿出问题老子不管哦**/
        appendMyText(msg, myheadsrc);
        scrollTopFn(topFlag);
        sendMSGshow(1);
    }).catch(function () {
        layer.alert("信息发送出错");
    });
}

/**
*
*发送图片的方法
*send:聊天对象的ID
*receive:聊天对象的ID
*obj图片文件
**/
function sendImage(obj, send, receive) {
    if (obj != null && obj != undefined) {
        return create(send, receive).then(function (conversation) {
            var file = new AV.File(obj.name, obj);
            file.save().then(function () {
                return conversation.send(new AV.ImageMessage(file));
            }).then(function (message) {
                localStorage.setItem("fstime", new Date().getTime());
                var min = "";
                if (new Date().getMinutes() < 10) {
                    min = "0" + new Date().getMinutes();
                } else {
                    min = new Date().getMinutes();
                }
                localStorage.setItem("showtime", new Date().getHours() + ":" + min);
                time.push(localStorage.getItem("fstime"));
                appendtime(time, localStorage.getItem("showtime"));         /**注意不要调换代码顺序哦不然嘿嘿出问题老子不管哦**/
                appendMyImg(message._lcfile.url, myheadsrc);
                scrollTopFn(topFlag);
                sendMSGshow(1);
                $(".picDiv").html("");
            });
        }).catch(function () {
            layer.msg("信息发送出错");
        });
    }

}

/**
*判断文本是否为空
**/
function checkText(msg) {
    if (msg != "") {
        return true;
    }
}

/**
*判断图片是否为空
**/
function checkFile(file) {
    if (file != undefined) {
        return true;
    }
}

document.getElementById("files").onclick = function () {
    //首先判断文本框是否为空，如果不为空先发送文本信息
    if (checkText($("#tarea").val())) {
        layer.msg("请将文本信息发送之后再选择图片");
        return false;
    }
    // sendMSGshow(2);
}

//获取URL的方法---实现本地预览
document.getElementById("files").addEventListener("change", function () {
    var f = this.files;

    for (var i = 0; i < f.length; i++) {
        var filereader = new FileReader();
        if (!/image\/\w+/.test(f[i].type)) {
            var filement = document.getElementById("files");
            filement.outerHTML = filement.outerHTML;                        //文件清空
            layer.alert("请选择图片");
            return false;
        }
        filereader.readAsDataURL(f[i]);
        filereader.onload = function (e) {
            apendimg(e.target.result);         //预览图片
            sendMSGshow(2);
        }
    }
    sendMSGshow(1);
});


/**
*发送信息的方法
**/
function s_Info() {
    var msg = $("#tarea").val();
    var file = $("#files")[0].files[0];
    //1.判断用户是要发送图片还是文本
    if (checkText(msg)) {
        if (receive == "") {
            layer.alert("请选择联系人");
            return false;
        }
        sendTextMsg(msg, send, receive);
        $("#tarea").val("");                                            //文本清空
    } else {
        if (receive == "") {
            layer.alert("请选择联系人");
            return false;
        }
        sendImage(file, send, receive);
        $("#files").val("");
    }
}


//点击发送按钮发送文本信息
$("#go").click(function () {
    topFlag = false;
    s_Info();

});


/**
*按Enter发送信息
**/
$(window).keyup(function (evt) {
    if (evt.keyCode == 13) {
        //禁止换行
        evt.cancelBubble = true;
        evt.preventDefault();
        evt.stopPropagation();
        topFlag = false;
        s_Info();

    }

});

/*
*
*预览图片的方法
*src:图片路径
*/
function apendimg(src) {

    $(".picDiv").html("<img src='" + src + "' />");
}

//联系人列表日期展示的处理
function fromDate(date) {
    var year = date.substring(0, 4);
    var month = date.substring(4 + 2, date.lastIndexOf("-"));
    var day = date.substring(date.lastIndexOf("-") + 1, date.lastIndexOf(" "));
    var time = date.substring(date.indexOf(" ") + 1, date.length - 3);
    var d = new Date();
    if (d.getYear() > year || (d.getMonth() + 1) > month || d.getDate() > day) {
        return year + "-" + month + "-" + day;
    } else {
        return time;
    }
}

//获取聊天列表信息人的方法----此方法不能放在窗体加载里面必须第一时间执行
function getUserL() {
    if (sorceId != undefined) {

        receive = sorceId;
    }



    $.ajax({
        url: lawyer_url + "lawyer/pc-advices",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (req) {
            if (req.code == 0) {
                //没有聊天联系人
                return false;
            }

            var html = "";
            for (var i = 0; i < req.data.items.length; i++) {
                if (req.data.items[i].lastTime != undefined) {
                    if (req.data.items[i].unreadNum == 0) {

                        html += "<li class='chatInfo' onclick='intalk(this);' data-id='" + req.data.items[i].userId + "'data-name='" + req.data.items[i].userName + "' data-logo='" + req.data.items[i].logo + "'><div class='headImg'><p><img src='" + req.data.items[i].logo + "' alt='聊天头像'></p></div><div class='chatDetail'><p><span class='name'>" + req.data.items[i].userName + "</span><span class='time'>" + fromDate(req.data.items[i].lastTime) + "</span></p><p><span class='con'>" + req.data.items[i].content + "</span><span class='tc number'>" + "" + "</span></p></div></li>";
                    } else {
                        html += "<li class='chatInfo' onclick='intalk(this);' data-id='" + req.data.items[i].userId + "'data-name='" + req.data.items[i].userName + "' data-logo='" + req.data.items[i].logo + "'><div class='headImg'><p><img src='" + req.data.items[i].logo + "' alt='聊天头像'></p></div><div class='chatDetail'><p><span class='name'>" + req.data.items[i].userName + "</span><span class='time'>" + fromDate(req.data.items[i].lastTime) + "</span></p><p><span class='con'>" + req.data.items[i].content + "</span><span class='tc number'>" + req.data.items[i].unreadNum + "</span></p></div></li>";
                    }

                } else {
                    if (req.data.items[i].unreadNum == 0) {
                        html += "<li class='chatInfo' onclick='intalk(this);' data-id='" + req.data.items[i].userId + "'data-name='" + req.data.items[i].userName + "' data-logo='" + req.data.items[i].logo + "'><div class='headImg'><p><img src='" + req.data.items[i].logo + "' alt='聊天头像'></p></div><div class='chatDetail'><p><span class='name'>" + req.data.items[i].userName + "</span><span class='time'></span></p><p><span class='con'>" + req.data.items[i].content + "</span><span class='tc number'>" + "" + "</span></p></div></li>";
                    } else {
                        html += "<li class='chatInfo' onclick='intalk(this);' data-id='" + req.data.items[i].userId + "'data-name='" + req.data.items[i].userName + "' data-logo='" + req.data.items[i].logo + "'><div class='headImg'><p><img src='" + req.data.items[i].logo + "' alt='聊天头像'></p></div><div class='chatDetail'><p><span class='name'>" + req.data.items[i].userName + "</span><span class='time'></span></p><p><span class='con'>" + req.data.items[i].content + "</span><span class='tc number'>" + req.data.items[i].unreadNum + "</span></p></div></li>";
                    }

                }
            }
            //这里的判断是从哪个端口进来的才确认如何默认第一个聊天列表
            $("#userList").html(html);
            if (sorceId == undefined) {
                //如果是从咨询接口进来的默认获取第一个
                //如果有指定用户则显示指定用户
                if (localStorage.getItem("receive") != null) {
                    receive = localStorage.getItem("receive");
                    $("#userList>[data-id]").filter(function (index) {
                        if ($(this).data().id == receive) {
                            $(this).insertBefore($("#userList>[data-id]").eq(0));
                        }
                    });
                } else {


                    receive = $(".chatInfo").eq(0).data().id + "";                   //获取ID
                }
            } else {
                //如果是从联系客户或者私聊进来的将指定的这个人设置为第一个
                $("#userList>[data-id]").filter(function (index) {
                    if ($(this).data().id == sorceId) {
                        //置顶
                        $(this).insertBefore($("#userList>[data-id]").eq(0));
                    }
                });
            }
            otherheadsrc = $("#userList>[data-id]").eq(0).data().logo;                        //获取头像
            $(".tcname").text($("#userList>[data-id]").eq(0).data().name);                //聊天窗口的对象名字显示
            $(".chatInfo").eq(0).addClass("bgColor");                                      //高亮显示
            myheadsrc = req.data.items[0].lawyerLogo;                                    //我的头像

        },
        error: function (e) {
            console.log("发生错误" + e);
        }
    });
}

(function getUserList() {
    getUserL();
}());


/**
*判断当前音频是否处于播放的方法
**/
function playpaused(audio) {
    if (audio.paused) {
        //处于暂停状态未播放
        return false;
    } else {
        return true;
    }
}

/**
*点击播放或者暂停语音的方法
**/
function playSound(self) {
    var audio = document.getElementById("audio");
    if ((audio.src).toString().toLowerCase() == ($(self).data().src).toString().toLowerCase()) {
        if (playpaused(audio)) {
            audio.pause();
        } else {
            audio.currentTime = 0;
            audio.play();
        }

    } else {
        audio.src = $(self).data().src;
        audio.play();
    }
}
//窗体加载
window.onload = function () {
    td = 0;
    topFlag = false;
    getoldInfo(send, receive);      //获取历史信息
    getInfo(send, receive);         //聊天中接收信息
}

//点击左侧列表进行模拟对话
function intalk(self) {
    td = 1;
    receive = $(self).data().id + "";                   //獲取ID
    localStorage.setItem("receive", receive);           //用于储存指定用户
    var name = $(self).data().name;
    otherheadsrc = $(self).data().logo;
    $(".tcname").text(name);
    //获取对话详情  
    topFlag = false;
    talkPageindex = 1;
    getoldInfo(send, receive);
    //点击选中样式设置
    $(self).addClass("bgColor").siblings().removeClass("bgColor");

}
/*
*
*查看更多信息的方法
*/
function selectMore() {
    td = 1;
    talkPageindex++;
    topFlag = true;
    getoldInfo(send, receive);

}




/**为空的时候**/
$("#search").keyup(function () {
    selfval = $("#search").val();
    if ($.trim(selfval) == "") {
        getUserL();
    }

});

/*****联系人聊表搜索板块*********/

/*$("#search").on('focus',  function() {
    console.log(111);
    searchFn();
});*/
/*$("#search").on('keydown',  function() {
    console.log(111);
    searchFn();
});*/
function searchFn() {
    selfval = $.trim($("#search").val());
    if ($.trim(selfval) == "") {
        return false;
    }

    $(".name").filter(function (index) {
        if ($(".name").eq(index).text().indexOf(selfval) >= 0) {

            $(".name").eq(index).parent().parent().parent().show();
        } else {
            $(".name").eq(index).parent().parent().parent().hide();
        }
    });
}

/*document.getElementById("searchicon").onclick = function(){

}*/

/**
 *上下线状态切换
 **/
$("#updown").click(function () {

    $.ajax({
        type: "GET",
        url: lawyer_url + "lawyer/pc-online",
        data: { isWork: $("#isWork").val() },
        dataType: "text",
        success: function (json) {
            var data = JSON.parse(json).data;
            //改变状态
            if (data.auth) {
                layer.alert("您还未认证, 无法操作此步骤!");
            } else {
                if (data.lawyerDetail.isWork) {
                    layer.msg("上线成功");
                    $(".dline").show();
                    $(".uline").hide();
                    $("#isWork").val("0");

                } else {
                    layer.msg("下线成功");
                    $(".dline").hide();
                    $(".uline").show();
                    $("#isWork").val("1");
                }
            }
        }
    });
});


/**
*快捷回复

$("#kj").click(function () {
    $("#remain").show();
});


$("#remain>p").click(function () {
    $("#tarea").val($(this).text());
    $(this).parent().hide();
});
**/
$(document).on('click', function (e) {
    console.log(e);
    if ($(e.target).eq(0).is($("#search")) || $(e.target).eq(0).is($("#userserch"))) {
        console.log(222222);
        searchFn();
    }
    if ($(e.target).eq(0).is($("#kj")) || $(e.target).eq(1).is($("#kj"))) {

        return;
    }

    $("#remain").hide();
});


//离线状态下的按钮动画
//$("#goNone").click(function(){
//    $(this).addClass("move");
//  })
//document.getElementById("goNone").addEventListener("transitionend", myFunction);
//function myFunction() {
//    this.style.display = "none";
//};
