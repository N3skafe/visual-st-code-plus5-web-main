import { session_set2 } from './js_session.js';
import { encrypt_text } from './js_crypto.js';

function join(){ // 회원가입기능
    let form = document.querySelector("#join_form"); // 로그인폼식별자
    let name = document.querySelector("#form3Example1c");
    let email = document.querySelector("#form3Example3c");
    let password = document.querySelector("#form3Example4c");
    let re_password= document.querySelector("#form3Example4cd");
    let agree = document.querySelector("#form2Example3c");
    const nameRegex = /^[가-힣]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    form.action= "../index.html"; // 로그인성공시이동
    form.method= "get"; // 전송방식

    if(name.value.length=== 0 || email.value.length=== 0 || password.value.length=== 0 || re_password.length=== 0){
        alert("회원가입폼에모든정보를입력해주세요.");
    }
    if (!nameRegex.test(name.value)) { // 이름 검사
        alert("이름은 한글만 입력 가능합니다.");
        name.focus();
        return;
    }
    if (!emailRegex.test(email.value)) { // 이메일 검사
        alert("이메일 형식이 올바르지 않습니다.");
        email.focus();
        return;
    }
    if (!pwRegex.test(password.value)) { // 비밀번호 검사
        alert("비밀번호는 8자 이상이며 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
        password.focus();
        return;
    }
    if (password.value !== re_password.value) { // 비밀번호 일치 검사
        alert("비밀번호가 일치하지 않습니다.");
        re_password.focus();
        return;
    }
    if (!agree.checked) { // 약관 동의 확인
        alert("약관에 동의하셔야 가입이 가능합니다.");
        return;
    }

    else{
        const newSignUp = new SignUp(name.value, email.value, password.value, re_password.value); // 회원가입정보객체생성
        const encryptedData = encrypt_text(JSON.stringify(newSignUp)); // 데이터 암호화
        sessionStorage.setItem("Session_Storage_join", encryptedData); // 암호화된 데이터 저장
        console.log("암호화된 데이터:", encryptedData);
        form.submit(); // 폼실행
    }
}

// 이벤트리스너
document.addEventListener('DOMContentLoaded', () => {
    const joinBtn = document.getElementById('join_btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', join);
    }
});

class SignUp {
    constructor(name, email, password, re_password) {
        // 생성자 함수: 객체 생성 시 회원 정보 초기화
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }

    // 전체 회원 정보를 한 번에 설정하는 함수
    setUserInfo(name, email, password, re_password) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }

    // 전체 회원 정보를 한 번에 가져오는 함수
    getUserInfo() {
        return {
            name: this._name,
            email: this._email,
            password: this._password,
            re_password: this._re_password
        };
    }
}