import { session_set, session_get, session_check } from './js_session.js';
import { encrypt_text, decrypt_text, getDecryptedSessionData } from './js_crypto.js';
import { generateJWT, checkAuth } from './js_jwt_token.js';

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
    
    // 로그인 시도 횟수 초기화
    if (!localStorage.getItem('login_count')) {
        localStorage.setItem('login_count', '0');
    }
    // 제한 시간 초기화
    if (!localStorage.getItem('login_restriction_time')) {
        localStorage.setItem('login_restriction_time', '0');
    }

    // 저장된 회원가입 데이터 확인
    const decryptedData = getDecryptedSessionData("Session_Storage_join");
    if (decryptedData) {
        console.log("저장된 회원가입 데이터:", JSON.parse(decryptedData));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    init(); // 쿠키에서 아이디 가져오기
    // checkAuth(); // 인증 검사
    // init_logined(); // 로그인 시 세션 복호화
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
    const loginBtn = document.getElementById('login_btn');
    const emailInput= document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');

    // 로그인 제한 시간 체크
    const restrictionTime = parseInt(localStorage.getItem('login_restriction_time')) || 0;
    const currentTime = Date.now();
    
    if (restrictionTime > currentTime) {
        const remainingTime = Math.ceil((restrictionTime - currentTime) / 1000);
        alert(`로그인이 제한되었습니다. ${remainingTime}초 후에 다시 시도해주세요.`);
        return false;
    }

    // 로그인 시도 횟수 증가
    let loginCount = parseInt(localStorage.getItem('login_count')) || 0;
    loginCount++;
    localStorage.setItem('login_count', loginCount.toString());

    const c = '아이디, 패스워드를체크합니다';
    alert(c);
    alert(`현재 로그인 시도 횟수: ${loginCount}회`);

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedPassword = check_xss(passwordValue);
    // check_xss 함수로 비밀번호 Sanitize
    const sanitizedEmail = check_xss(emailValue);
    // check_xss 함수로 비밀번호 Sanitize
    const idsave_check = document.getElementById('idSaveCheck');

    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);

    if (emailValue === '') {
        alert('이메일을입력하세요.');
        return false;
    }

    if (passwordValue === '') {
        alert('비밀번호를입력하세요.');
        return false;
    }

    if (emailValue.length < 5) {
        alert('아이디는최소5글자이상입력해야합니다.');
        return false;
    }
    if (emailValue.length > 15) {
        alert('이메일은15글자이하로입력해야합니다.');
        return false;
    }
    if (passwordValue.length < 12) {
        alert('비밀번호는반드시12글자이상입력해야합니다.');
        return false;
    }
    if (passwordValue.length > 20) {
        alert('비밀번호는20글자이하로입력해야합니다.');
        return false;
    }

    // 연속된 문자나 숫자 체크 (3글자 이상 반복)
    const hasRepeatingPattern = /(.)\1{2,}/.test(passwordValue);
    if (hasRepeatingPattern) {
        alert('비밀번호에3글자이상연속되는문자나숫자가포함되어있습니다.');
        return false;
    }

    // 연속된 숫자나 문자 체크 (2개 이상 연속)
    const hasSequentialPattern = /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba)/i.test(passwordValue);
    if (hasSequentialPattern) {
        alert('비밀번호에연속된문자나숫자가포함되어있습니다.');
        return false;
    }

    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/) !== null; // 정규식으로 특수문자 확인 리눅스에서 많이 사용

    if (!hasSpecialChar) {
        alert('패스워드는특수문자를1개이상포함해야합니다.');
        return false;
    }

    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;

    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는대소문자를1개이상포함해야합니다.');
        return false;
    }
    if (!sanitizedEmail) { // Sanitize된 비밀번호 사용
        // 로그인 실패 시 카운트 증가 및 제한 시간 설정
        if (loginCount >= 3) {
            const restrictionEndTime = currentTime + (60 * 1000); // 1분 제한
            localStorage.setItem('login_restriction_time', restrictionEndTime.toString());
            alert('로그인 시도가 3회 실패하여 1분간 로그인이 제한됩니다.');
        }
        return false;
    }
    if (!sanitizedPassword) { // Sanitize된 비밀번호 사용
        // 로그인 실패 시 카운트 증가 및 제한 시간 설정
        if (loginCount >= 3) {
            const restrictionEndTime = currentTime + (60 * 1000); // 1분 제한
            localStorage.setItem('login_restriction_time', restrictionEndTime.toString());
            alert('로그인 시도가 3회 실패하여 1분간 로그인이 제한됩니다.');
        }
        return false;
    }
    if(idsave_check.checked == true) { // 아이디 체크 o
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); // 1일 저장, 쿠키 이름은 id
        alert("쿠키 값 :" + emailValue);
    }
    else{ // 아이디 체크 x
        setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
    }

    // 로그인 성공 시 카운트와 제한 시간 초기화
    localStorage.setItem('login_count', '0');
    localStorage.setItem('login_restriction_time', '0');

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    session_set(); // 세션 생성
    localStorage.setItem('jwt_token', jwtToken);
    loginForm.submit();
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
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    }
    else {
        alert("세션 스토리지 지원 x");
    }
}
function logout(){
    session_del(); // 세션 삭제
    localStorage.setItem('login_count', '0'); // 로그아웃 시 카운트 초기화
    localStorage.setItem('login_restriction_time', '0'); // 로그아웃 시 제한 시간 초기화
    location.href='../index.html';
}