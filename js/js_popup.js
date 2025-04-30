function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
     document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}
function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "popupYN") {
                return cookie_name[1];
            }
        }
    }
    return ;

}
function pop_up() {
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck != "N"){
    window.open("../popup/popup.html", "popup test", "width=1280, height=720, resizable=yes, scrollbars=no");
    }
}
function closePopup() {
    if (document.getElementById('check_popup').value) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        self.close();
    }
}
function show_clock(){
    let currentDate= new Date(); // 현재시스템날짜객체생성
   let divClock= document.getElementById('divClock'); /// divClock라는 id를 가진 html요소를 가져옴
    let msg = "현재시간: ";
    if(currentDate.getHours()>12){  // 12시보다크면오후아니면오전
   msg += "오후";
    msg += currentDate.getHours()-12+"시";
    }
    else {
    msg += "오전";
    msg += currentDate.getHours()+"시";
    }
    msg += currentDate.getMinutes()+"분";
    msg += currentDate.getSeconds()+"초";
    divClock.innerText= msg;    //텍스트 넣어주는 애애
    if (currentDate.getMinutes()>58) {    //정각1분전빨강색출력
   divClock.style.color="white";
    }
    setTimeout(show_clock, 1000);  //1초마다갱신
   }

function over(obj) {
    obj.src="../image/r6-siege-x-logo.avif";
}
function out(obj) {
    obj.src="../image/r6s_logo.png";
}


//화살표 함수
// const over = (obj) => {
//     obj.src="../image/r6-siege-x-logo.avif";
// }
// const over = (obj) => {
//     obj.src="../image/r6s_logo.png";
// }

//팝업창을 닫는 함수
// var close_time; //시간 정보
// var close_time2; //10초 설정

// clearTimeout(close_time); //재호출 정지
// close_time=setTimeout("close_window()", 10000); //1/1000초 지정, 바로시작
// show_time(); //실시간 시간 보여주기기

// function show_time() {
//     let divClock = document.getElementById('Time');
//     divClock.innerText = close_time2; //10초 삽입 시작작
//     close_time2--; //1초씩 감소소
// setTimeout("show_time()", 1000); //1초마다 갱신신
// }

// function close_window() { //함수정의
//     window.close(); //윈도우 닫기
//     alert("10초가 지나서 창을 닫습니다.");
// }
