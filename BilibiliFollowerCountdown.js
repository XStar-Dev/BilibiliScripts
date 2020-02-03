// Bilibili Follower Countdown B站UP主粉丝数倒计时脚本 Powered By jQuery and Bilibili API
// Author : iStar丶Forever
// 适用范围 : 各项数据超过1万的UP主（因为我没有针对1W以下写判断）
// 使用方法 : 
// 1.打开指定UP主的个人空间，按F12调用开发人员工具，切换到控制台（Console），复制下列代码回车
// 2.输入FollowerCountdown()，回车启动程序即可开始倒计时，输入stop=1可提前停止
// 3.在达成目标粉丝数之前，控制台和上方的搜索栏将持续刷新数据，并同步更新页面中的粉丝数
// 4.如果粉丝数达成，将更新获赞数和播放数，保证显示数据的实时性，并同步在控制台和弹框中显示统计数据和达成时间
// 5.如果出现请求的数据提前超过目标，将强制修正数据，如果缩短实时请求间隔时间，可以避免这个问题，实际结果会在控制台中显示出来，可以自行测试
// 如果你有好的意见，请务必反馈给我，我将尽可能地完善此脚本

var uid=316381099; // UP主用户UID
var targetFollower=888888; // 目标粉丝数
var offset=0; // 允许存在的误差，建议最大不超过3
var interval=1000; // 实时请求时间间隔，单位是ms
var stop=0; // 在控制台输入stop=1即可马上停止倒计时
function showAchieve(){
    alert("倒计时完成，截图纪念! \r\n目标粉丝数："+targetFollower+"\r\n达成时间："+Date()+"");
}
function FollowerCountdown(){
    $.getJSON(
        "https://api.bilibili.com/x/relation/stat?vmid="+uid, // 请求Bilibili API查询数据
        function(res1){
            if(!stop){ // 判断暂时参数是否发生更改
                $(".nav-search-keyword").attr("placeholder","当前粉丝数："+res1.data.follower); // 更新上方搜索框粉丝数
                $(".n-data-v:eq(1)").html(Math.round(res1.data.follower/1000)/10+"万"); // 更新粉丝数显示（保留一位小数）
                $(".n-data-v:eq(1)").parent().attr("title",res1.data.follower.toLocaleString()); // 更新鼠标指针显示粉丝数
                // 更新控制台输出数据
                // console.log("当前粉丝数："+res1.data.follower);
                // 判断是否已经到达误差范围内，仅当满足要求时更新获赞数和播放数保证数据实时性便于截图
                if(targetFollower-res1.data.follower <= offset){
                    $.getJSON("https://api.bilibili.com/x/space/upstat?mid="+uid,function(res2){ // 请求Bilibili API查询数据
                        // 更改参数暂停所有延时事件，防止多重调用
                        stop=1; 
                        // 避免数据提前超出目标，执行强制修正
                        $(".nav-search-keyword").attr("placeholder","当前粉丝数："+targetFollower);
                        $(".n-data-v:eq(1)").html(Math.round(targetFollower/1000)/10+"万");
                        $(".n-data-v:eq(1)").parent().attr("title",targetFollower.toLocaleString());
                        // 更新获赞数和播放数显示（保留一位小数）
                        $(".n-data-v:eq(2)").html(Math.round(res2.data.likes/1000)/10+"万");
                        $(".n-data-v:eq(3)").html(Math.round(res2.data.archive.view/1000)/10+"万");
                        // 输出调试信息
                        console.log("倒计时完成，统计数据，目标粉丝数："+targetFollower);
                        console.log("粉丝数："+res1.data.follower+"，获赞数："+res2.data.likes+"，播放数："+res2.data.archive.view+"");
                        console.log("达成时间："+Date());
                        // 使用Timeout方法解决DOM操作滞后问题
                        setTimeout("showAchieve()",10);
                    });
                }else{
                    setTimeout("FollowerCountdown()",interval); // 间隔指定时间后再度请求数据
                }
            }
        }
    )
}