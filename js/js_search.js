document.getElementById("search_btn_msg").addEventListener("click", search_message);
//document.getElementById("search_btn2").addEventListener("click", search_message2);

function search_message() {
    alert("검색을 수행합니다!");
}

/*function search_message2() {
    alert("검색을 시작합니다~");
}*/


function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim(); // 검색어로 설정하고 공백 제거
    
    if (!searchTerm) {
        alert("검색어를 입력해주세요!");
        return false;
    }
    if (!searchTerm.includes("병신, 씨발, Tlqkf, fuck, 좆, 좆까, 좆년, 좆만아, 지랄, 병신아, 애@미, 니애미")) {
        alert("검색어에 비방 또는 욕설이 포함되어 있습니다.");
        return false;
    }
    
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`; // 새 창에서 구글 검색 URL
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기
    return false; // 기본 동작 방지
}