document.getElementById("search_btn").addEventListener("click", search_message);
//document.getElementById("search_btn2").addEventListener("click", search_message2);

function search_message() {
    alert("검색을 수행합니다!");
}

/*function search_message2() {
    alert("검색을 시작합니다~");
}*/


function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`; // 새 창에서 구글 검색 URL
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기
    return false; // 기본 동작 방지
}