// =============================================
// 網頁設置
// =============================================
const reportTime = document.querySelector('.report-time');
const cardRegion = document.querySelector('.card-region');
const btnGroup = document.querySelectorAll('.btn');

btnGroup.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        cardRegion.innerHTML = '';
        getcities(index);
        showcards(min, max);
    })
});

// =============================================
// 現在時間
// =============================================
const clock = document.querySelector('.clock');
// setting function to get system's time data
function getNewTime() {
    // 創建一個 Java script 內建的`date()`物件 取得現在時間
    const time = new Date();
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const date = time.getDate().toString().padStart(2, '0');
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');


    // clock 顯示文字 = date取的時間數據 以 當地時間字串 呈現
    clock.textContent = `現在時間：${year}/${month}/${date} ${hours}:${minutes}`;
}
getNewTime();

// setting a inerval controler (寫入 箭頭函數 或 自定義的函數名稱**只要名稱就好ㄌ, interval 單位是毫秒)
// setInterval(() => { }, interval);
// setInterval(函數名稱, interval);
// 把剛剛設定好顯示時間數據的函數放進去 
let clockInterval = setInterval(getNewTime, 1000);

// =============================================
// 資料處理
// =============================================

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-968C59D5-BB9D-4213-A018-D3A9021A6A1B&format=JSON'
let orgData = {};
dataProcess();

function dataProcess() {
    // 去url取資料
    fetch(url)
        // 成功得到回應 將promise傳到下一個then (註:then是fetch的'方法(method)'有對象的函數 類似function(但要有對象){} )
        .then(function (response) {
            // 接收資料 接著 以json格式傳到下一個then
            return response.json();
        })
        // 接收資料 將資料存放到dataAll
        .then(function (data) {
            // 整理資料 (另外寫一個自定義function叫做organizationData去整理他)
            orientationData(data);
            // 顯示資料
            showcards(1, 22);
        })
};

// 簡化並排列氣象局的資料
function orientationData(data) {
    // 將從API拿出來放到data資料中的location放到陣列locationData中
    const locationData = data.records.location; //data中包含在location後的東西都會被抓進來
    // 對放進陣列的資料逐個做整理 foreach

    let startTime = locationData[0].weatherElement[0].time[0].startTime.substr(0, 16).replaceAll('-','/');
    let endTime = locationData[0].weatherElement[0].time[0].endTime.substr(0,16).replaceAll('-','/');
    reportTime.textContent = `預報時間：${startTime}～${endTime}`;

    locationData.forEach((location) => { //locationData中每個對象取名以loaction代表

        // let 變數名稱 = 從locationData陣列要抓的資料
        let locationName = location.locationName; //每個對象(location)中的locationName
        let wx = location.weatherElement[0].time[0].parameter.parameterName;
        let wxValue = location.weatherElement[0].time[0].parameter.parameterValue;
        let pop = location.weatherElement[1].time[0].parameter.parameterName;
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        let ci = location.weatherElement[3].time[0].parameter.parameterName;
        let maxT = location.weatherElement[4].time[0].parameter.parameterName;

        // 將剛剛定義好的資料套進去物件orgData
        // 每個locationName做為一個對象
        // 每個對象中，包含屬性:startTime,endTime,wx...等，屬性的內容為上面定義的變數抓到的資料
        orgData[locationName] = {
            //屬性 : 上面定義的變數
            // startTime: startTime,
            // endTime: endTime,
            wx: wx,
            wxValue: wxValue,
            pop: pop,
            minT: minT,
            ci: ci,
            maxT: maxT
        }
    })
};

// 以陣列分類並排序城市名稱

let cities = ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];
console.log(cities);

let city;
let min = 1;
let max = 22;
// cities 0全部1-22 1北部1-7 2中部8-13 3南部14-16 4東部17-19 5外島20-22
function getcities(index) {
    switch (index) {
        case 0:
            min = 1; max = 22;
            break;
        case 1:
            min = 1; max = 7;
            break;
        case 2:
            min = 8; max = 13;
            break;
        case 3:
            min = 14; max = 16;
            break;
        case 4:
            min = 17; max = 19;
            break;
        case 5:
            min = 20; max = 22;
            break;
        default:
            console.log('例外處理');
            break;
    }
}

function showcards(min, max) {
    for (let i = min - 1; i < max; i++) {
        city = cities[i];
        cityData = orgData[city];
        showOneCard(city, cityData);
    }
}

function showOneCard(city, cityData) {
    cardRegion.innerHTML +=
        `<div class="card" data-aos="zoom-in-up">
        <div class="img-area">
        <span class="city-name">${city}</span>
        <img src="./img/${cityData.wxValue}.png" alt="">
        </div>
        <div class="text-area">
        <span>${cityData.wx}</span>
        <span>溫度：${cityData.minT}°C ~ ${cityData.maxT}°C</span>
        <span>${cityData.ci}</span>
        <span class="rainy-rate"><i class="fa-solid fa-cloud-showers-heavy"></i>&nbsp;降雨機率：${cityData.pop}%</span>
        </div>
    </div>`;
    // 每個變數區域記得要有cityData不然抓不到東西
};