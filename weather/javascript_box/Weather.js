const getJSON = function(url,callback){
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url,true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        const status=xhr.status;
        if(status==200){
            callback(null,xhr.response);
        }else{
            callback(status,xhr.response);
        }
    };
    xhr.send();
};

const getAddress = function(lat, lng){
		$.ajax({
    		url : 'https://dapi.kakao.com/v2/local/geo/coord2address.json?x=' + lng + '&y=' + lat,
        type : 'GET',
        headers : {
        	'Authorization' : 'KakaoAK 4bb8c93d8c5f76b608d493203a0abd11'
        },
        success : function(data) {
        	//console.log(data);
          let address = data.documents[0].address.region_1depth_name;

          address += " " + data.documents[0].address.region_2depth_name;
          address += " " + data.documents[0].address.region_3depth_name
          
          let location= document.querySelector('.location');
  			  location.append(address);
        },
        error : function(e) {
        	console.log(e);
        }
    })
}


//const Direction = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW','NW', 'NNW', 'N'];


function getDate(){

		let date = new Date();
    let year = date.getFullYear().toString();
    let month = transDateFormat(date.getMonth()+1);
    let day= date.getDate();
    let hours= date.getHours();
    let minutes= date.getMinutes();
    let cur = {};
    cur['year'] = year;
    cur['month'] = month;
    cur['day'] = day;
    cur['hours'] = hours;
    cur['minutes'] = minutes;
    
    return cur;
}

function transDateFormat(date){
		
    if(date.month < 10){
        date.month = "0" + date.month;
    }
    if(date.day < 10){
    		date.day = "0" + date.day;
    }
    if(date.hours < 10){
    		date.hours = "0" + date.hours;
    }
    if(date.minutes < 10){
    		date.minutes = "0" + date.minutes;
    }
    
    return date;
    
    
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
    }else{
        console.log("지오 로케이션 없음");
    }
};


function locationError(error){
    var errorTypes = {
        0 : "무슨 에러냥~",
        1 : "허용 안눌렀음",
        2 : "위치가 안잡힘",
        3 : "응답시간 지남"
    };
    var errorMsg = errorTypes[error.code];
    console.log(errorMsg)
}
// locationError

var geo_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000,
    timeout           : 27000
};
// geo_options

// LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {

        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}
// dfs_xy_conv

function locationSuccess(p){
    var latitude = p.coords.latitude, longitude = p.coords.longitude;

    getAddress(latitude, longitude); // 현재 좌표를 지명으로 표시

    var rs = dfs_xy_conv("toXY",latitude,longitude); // 위도/경도 -> 기상청 좌표x / 좌표 y 변환
		requestMinMaxWeather(rs.nx, rs.ny, getDate());
    requestCurWeather(rs.nx, rs.ny, getDate());
    
}
// locationSuccess

function requestCurWeather(nx, ny, date){

		if(date.minutes < 40){
    		date.hours = date.hours- 1;
        date.minutes = 0;
    }
    else{
    		date.minutes = 0;
    }
		date = transDateFormat(date);
		
		let url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?';
    url += 'serviceKey=GaxrGgNHrS7DEO5Gv8QEQ0OmHMiOJNHlL2JOExGSfhHLlKcs4TqlxGAVN3xUAW%2FYWKOVC6z%2Fx8SwaTy9ujMUEQ%3D%3D'; 
    url += '&numOfRows=10&pageNo=1&dataType=JSON';
    url += '&base_date=' + date.year + date.month + date.day;
    url += '&base_time=' + date.hours + date.minutes;
    url += '&nx=' + nx;
    url += '&ny=' + ny;
    /*
    let icon=document.querySelector('.icon');
    icon.innerHTML='<p>'+ url + '</p>';
    */
    getJSON(url,
    function(err,data){
        if(err!=null){
            alert("Error: " + err);
        }
        else{
        		const Direction = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서','북서', '북북서', '북'];
        		let currentHumidity = document.querySelector('.humidity');
        		let currentTemp=document.querySelector('.current-temp');
            let currentWindSpeed = document.querySelector('.currentWindSpeed');
            let currentFeelsLike = document.querySelector('.currentFeelsLike');
            let currentWindDirection = document.querySelector('.currentWindDirecton');
            
            var temp = parseFloat(data.response.body.items.item[3].obsrValue);
            var humidity = parseFloat(data.response.body.items.item[1].obsrValue);
            var windSpeed = parseFloat(data.response.body.items.item[7].obsrValue);
            var windDirect = parseFloat(data.response.body.items.item[5].obsrValue);
            var feels_like = Math.round(getNewHeatSCT(temp, humidity)*10)/10;
            var wD = Direction[getWindDirction(windDirect)];
            
           	currentTemp.append(`${temp}℃`);
            currentHumidity.append(`${humidity}%`);
            currentWindSpeed.append(`${wD} ${windSpeed}m/s`);
            
            currentFeelsLike.append(`${feels_like}℃`);
            
        }
    });
    
}


function requestSky(nx, ny, date){
		
}



function requestMinMaxWeather(nx, ny, date){

		if(date.hour < 2 || (date.hour == 2 && date.minutes < 10)){
    		date.day -= 1;
        date.hours = 2;
        date.minutes = 0;
        
    }
		else{
    	date.hours = 2;
    	date.minutes = 0;
    }
    date = transDateFormat(date);
    
    var curDate = getDate();
    curDate = transDateFormat(curDate);
    var today = curDate.year + curDate.month + curDate.day;
    
    let url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?';
    url += 'serviceKey=GaxrGgNHrS7DEO5Gv8QEQ0OmHMiOJNHlL2JOExGSfhHLlKcs4TqlxGAVN3xUAW%2FYWKOVC6z%2Fx8SwaTy9ujMUEQ%3D%3D'; 
        /*API 키*/
    url += '&numOfRows=700&pageNo=1&dataType=JSON';
    url += '&base_date=' + date.year + date.month + date.day;
    url += '&base_time=' + date.hours + date.minutes;
    url += '&nx=' + nx;
    url += '&ny=' + ny;
    
    
    /*
    let icon=document.querySelector('.icon');
    icon.innerHTML='<h1>'+ url + '</h1>';
		*/
		
    getJSON(url,
    function(err,data){
        if(err!=null){
            alert("Error: " + err);
        }
        else{
            var result = data.response.body.items.item.filter(minTemp => minTemp.category == "TMN" && minTemp.fcstDate == today);
            let minTemp = document.querySelector('.min-temp');
            minTemp.append(`${result[0].fcstValue}℃`);
            result = data.response.body.items.item.filter(maxTemp => maxTemp.category == "TMX" && maxTemp.fcstDate == today);
            let maxTemp = document.querySelector('.max-temp');
            maxTemp.append(`${result[0].fcstValue}℃`);
            
						
            
        }
    });
    

}


	// 겨울철 체감온도 계산함수: 풍속 
	function getNewWCT(Tdum,Wdum) {
		var T = Tdum.toFloat();
		var W = Wdum.toFloat(); 
		if($("#windSpeedType").val() == "m"){
			W = W*3.6;
		}
		var result = 0.0;
		if ( W > 4.8 ) {
				W = Math.pow(W,0.16);
				result = 13.12 + 0.6215 * T - 11.37 * W + 0.3965 * W * T;
				if(result > T) {
					result = T;
				}
		}
		else {
			result = T;
		}
		return result;
	}
  
	//여름철 체감온도 계산함수:습도 / 5~9월 적용
	function getNewHeatSCT(Tdum,Hdum) {
    var T = Tdum;
		var H = Hdum;
    
		var TW = T*Math.atan(0.151977*(Math.pow(H+8.313659,1/2)))+Math.atan(T+H)-Math.atan(H-1.67633)+0.00391838*Math.pow(H,3/2)*Math.atan(0.023101*H)-4.686035;
		var result = -0.2442+0.55399*TW+0.45535*T-0.0022*Math.pow(TW,2)+0.00278*TW*T+3.0;
		return result;
	}

function getWindDirction(WD){
		return Math.floor((WD + 22.5 * 0.5) / 22.5); 
}

getLocation();