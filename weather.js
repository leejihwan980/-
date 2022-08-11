const weather= document.querySelector("js-weather");
//API키 입력
const COORDS="6dedd6bcc6e811544949829bbb88b6e1";
function getWeather(lat,lng){
    fetch(
    'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=6dedd6bcc6e811544949829bbb88b6e1'
    )
    .then(function(response){// .then = fetch가 완료 된 후 실행됨
        return response.json();
    })
    .then(function(json){
        const temperature=json.main.temp;
        const place=json.name;
        weather.innerText = `${temperature} @ ${place}`;
    })
}
function saveCoords(coordsObj){//local storage에 저장
    localStorage.setItem(COORDS,JSON.stringify(coordsObj));
}

function handleGeoSuccess(position){//요청 수락
    const latitude=position.coords.latitude;
    const longitude=position.coords.longitude;
    const coordsObj={
        latitude,
        longitude,
    };
    saveCoords(coordsObj);//local strage에 저장
}

function handleGeoError(){//요청 거절
    console.log("Not allowed");
}

function askForCoords() {//사용자 위치 요청
    navigator.geolocation.getCurrentPosition(handleGeoSuccess,handleGeoError);
}

function loadCoords(){
    const loadedCoords=localStorage.getItem(COORDS)//localstorage에서 위치정보 가져옴
    if(loadCoords==null){
        askForCoords();

    }else{
        const parseCoords=JSON.parse(loadedCoords);//json형식을 객체타입으로 바꿔서 저장->parseCoords[lat,lon]
        getWeather(parseCoords.latitude, parseCoords.longitude); // 날씨 요청 함수

    }
}

function init()
{
    loadCoords();
}

init();