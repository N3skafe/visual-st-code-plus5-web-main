import { session_set, session_get, session_check } from './js_session.js';
import { encrypt_text, decrypt_text } from './js_crypto.js';
import { generateJWT, checkAuth } from './js_jwt_token.js';

document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지가 로그인이나 로그아웃 페이지인지 확인
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const isLogoutPage = currentPath.includes('logout.html');
    
    // 로그인이나 로그아웃 페이지가 아닐 때만 토큰 검사
    if (!isLoginPage && !isLogoutPage) {
        checkAuth(); // 인증 검사
        init_logined(); // 로그인 시 세션 복호화
    }
    
    // 로그아웃 버튼 이벤트 리스너 추가
    const logoutBtn = document.getElementById('logout_btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function init_logined(){
    if(sessionStorage){
        decrypt_text(); // 복호화 함수
    }
    else{
        alert("세션 스토리지 지원 x");
    }
}

const check_input = () => {
    const loginForm = document.getElementById('login_form');
};

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
            if (cookie_name[0] == "id") { //쿠키 이름 id 
                return cookie_name[1];
            }
        }
    }
    return ;

}
const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
   if (sanitizedInput !== input) {
    // XSS 공격 가능성 발견 시 에러 처리
   alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
    }
    // Sanitized된 값 반환
   return sanitizedInput;
    };
    document.getElementById("login_btn").addEventListener('click', check_input);

function session_del() {//세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        localStorage.removeItem('jwt_token'); // JWT 토큰도 삭제
        
        // 쿠키 삭제
        setCookie("id", "", -1); // 만료일을 과거로 설정하여 쿠키 삭제
        
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    }
    else {
        alert("세션 스토리지 지원 x");
    }
}

export function logout(){
    session_del(); // 세션 삭제
    window.location.href = '../index.html';
}