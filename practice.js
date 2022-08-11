var lon = '경도';
var lat = '위도';
.ajax({
url: 'https://apis.daum.net/local/geo/coord2addr?apikey=발급받은API키&longitude=' + lon + '&latitude=' + lat + '&inputCoordSystem=WGS84&output=json',
type: 'GET',
cache: false,
context: {},
crossOrigin: true,
success: function(data) {
    var jsonObj = $.parseJSON(data);
    var contentText = document.getElementById('content');
        contentText.innerHTML += "<br>동네 이름 : " + jsonObj.name + " / 전체 주소 : " + jsonObj.fullName + " / 나라 : " + jsonObj.name0;
},error:function(request,status,error){
    alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
}
});