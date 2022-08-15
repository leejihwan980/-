const getJSON= function(url,callback){
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url,true);
    xhr.responseType='json';
    xhr.onload=function(){
        const status=xhr.status;
        if(status==200){
            callback(null,xhr.response);
        }else{
            callback(status,xhr.response);
        }
    };
    xhr.send();
};

getJSON('https:api.openweathermap.org/data/2.5/weather?q=daegu&appid=6dedd6bcc6e811544949829bbb88b6e1&units=metric',
function(err,data){
    if(err!=null){
        alert("요류요"+err);
    }
    else{
        loadWeather(data);
    }
});

function loadWeather(data){
    let location= document.querySelector('.location');
    let currentTime=document.querySelector('.current-time');
    let currentTemp=document.querySelector('.current-temp');
    let feelsLike=document.querySelector('.feels-like');
    let minTemp=document.querySelector('.min-temp');
    let maxTemp=document.querySelector('.max-temp');
    let icon=document.querySelector('.icon');
    let weatherIcon=data.weather[0].icon;

    let date=new Date();
    let month =date.getMonth()+1;
    let day=date.getDate();
    let hours=date.getHours();
    let minutes=date.getMinutes();

    location.append(data.name);
    currentTemp.append(`${data.main.temp}℃`);
    feelsLike.append(`체감온도 :${data.main.feels_like}℃`);
    maxTemp.append(` ${data.main.temp_max}℃`);
    minTemp.append(`${data.main.temp_min}℃`);
    icon.innerHTML=`<img src='http://openweathermap.org/img/wn/${weatherIcon}.png'>`;
    currentTime.append(`${month}월${day}일 ${hours}: ${minutes}`);
}
