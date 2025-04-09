function pop_up() {
    window.open("../popup/popup.html", "popup test", "width=400, height=400, left=100, top=100, resizable=yes, scrollbars=yes");
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