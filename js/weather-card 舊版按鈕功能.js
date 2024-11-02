// =============================================
// 網頁設置
// =============================================
const reportTime = document.querySelector('.report-time');
const cardRegion = document.querySelector('.card-region');
const btnGroup = document.querySelectorAll('.btn');
const allBtn = document.querySelector('#all-area');
const northernBtn = document.querySelector('#northern-area');
const centralBtn = document.querySelector('#central-area');
const southernBtn = document.querySelector('#southern-area');
const easternBtn = document.querySelector('#eastern-area');
const outlyingBtn = document.querySelector('#outlying-area');

allBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[0];
    showData();
});
northernBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[1];
    showData();
});
centralBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[2];
    showData();
});
southernBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[3];
    showData();
});
easternBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[4];
    showData();
});
outlyingBtn.addEventListener('click', () => {
    cardRegion.innerHTML = '';
    nowArea = area[5];
    showData();
});

// =============================================
// 現在時間
// =============================================
const clock = document.querySelector('.clock');

// setting function to get system's time data
function getNewTime() {
    // 創建一個 Java script 內建的`date()`物件 取得現在時間
    const time = new Date();
    const date = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();
    // clock 顯示文字 = date取的時間數據 以 當地時間字串 呈現
    clock.textContent = `現在時間：${year}-${month + 1}-${date} ${time.toLocaleTimeString()}`;
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
            // console.log('data', data);

            // 整理資料 (另外寫一個自定義function叫做organizationData去整理他)
            orientationData(data);

            // 顯示資料
            showData();


        })
};


// 簡化並排列氣象局的資料
function orientationData(data) {
    // 將從API拿出來放到data資料中的location放到陣列locationData中
    const locationData = data.records.location; //data中包含在location後的東西都會被抓進來
    // 對放進陣列的資料逐個做整理 foreach
    console.log(locationData[0].weatherElement[0].time[0].startTime);

    reportTime.textContent = `預報時間：${locationData[0].weatherElement[0].time[0].startTime}～${locationData[0].weatherElement[0].time[0].endTime}`;
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
// area [0]全部 [1]北部 [2]中部 [3]南部 [4]東部 [5]外島
let area = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
    ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'],
    ['宜蘭縣', '花蓮縣', '臺東縣'],
    ['澎湖縣', '金門縣', '連江縣'],
];

let nowArea = area[0];

function showData() {
    // 用我們希望的順序(nowArea陣列的元素)去抓orgData內的資料
    nowArea.forEach((city) => { //陣列內的元素以city這個名稱代表，帶入下列指令       
        cityData = orgData[city]; //用城市名稱抓 (因為跟物件內對象字一樣所以可以這樣用)
        // 例: orgData[臺中市] = 臺中市的cityData

        //console.log(cityData); //確認cityData有沒有正確被抓到
        // console.log(city, cityData);
        showOneCard(city, cityData);
    });
};

function showOneCard(city, cityData) {
    cardRegion.innerHTML +=
        `<div class="card">
        <div class="img-area">
        <span class="city-name">${city}</span>
        <img src="./img/${cityData.wxValue}.svg" alt="">
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