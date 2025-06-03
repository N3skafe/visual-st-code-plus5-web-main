import { session_set, session_get, session_check } from './js_session.js';

// 암호화 키 (실제 프로덕션에서는 환경 변수나 보안 저장소에서 관리해야 함)
const SECRET_KEY = 'your-secret-key-123';

function encodeByAES256(key, data){ //키값과 암호화 할 데이터
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""), // IV 초기화 벡터
        padding: CryptoJS.pad.Pkcs7, // 패딩
        mode: CryptoJS.mode.CBC // 운영 모드
    });
    return cipher.toString();
}

function decodeByAES256(key, data){
    const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString(CryptoJS.enc.Utf8);
}

// 문자열을 암호화하는 함수
export function encrypt_text(text) {
    try {
        // CryptoJS를 사용하여 AES 암호화 수행
        const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY);
        return encrypted.toString();
    } catch (error) {
        console.error('암호화 중 오류 발생:', error);
        return null;
    }
}

// 암호화된 문자열을 복호화하는 함수
export function decrypt_text(encryptedText) {
    try {
        // CryptoJS를 사용하여 AES 복호화 수행
        const decrypted = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('복호화 중 오류 발생:', error);
        return null;
    }
}

// 세션 스토리지에서 암호화된 데이터를 가져와 복호화하는 함수
export function getDecryptedSessionData(key) {
    const encryptedData = sessionStorage.getItem(key);
    if (encryptedData) {
        const decryptedData = decrypt_text(encryptedData);
        console.log('복호화된 데이터:', decryptedData);
        return decryptedData;
    }
    return null;
}