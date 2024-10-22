const locations = [
  { location: "티르코네일", npc: "상인 네루" },
   { location: "던바튼", npc: "상인 누누" },
   { location: "카브", npc: "상인 아루" },
   { location: "반호르", npc: "상인 라누" },
   { location: "이멘마하", npc: "상인 메루" },
   { location: "탈틴", npc: "상인 베루" },
   { location: "타라", npc: "상인 에루" },
   { location: "벨바스트", npc: "상인 피루" },
   { location: "스카하", npc: "상인 세누" },
   { location: "켈라베이스", npc: "테일로" },
   { location: "카루", npc: "귀넥" },
   { location: "코르", npc: "리나" },
   { location: "오아시스", npc: "얼리" },
   { location: "필리아", npc: "켄" },
   { location: "발레스", npc: "카디" },
   { location: "페라", npc: "데위" },
   { location: "칼리다", npc: "모락" },
];

const mabibase_url = "https://api.na.mabibase.com/assets/item/icon/";
const mabibase_url_filter = "?colors=";
const mabibase_jumoney = [
  "5110005",
  "5110006",
  "5110007",
  "5110008",
  "5110009",
  "5110010",
  "2041",
  "2042",
  "2043",
  "5110014",
  "5110015",
  "5110016",
  "5110017",
  "5110018",
  "5110019",
  "5110020",
  "5110021",
  "5110022",
  "5110023",
  "5110024",
  "5110025",
  "5110044",
];



// API 요청 URL
const url = "https://open.api.nexon.com/mabinogi/v1/npcshop/list";

// hex 색상을 RGB로 변환하는 함수
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `(${r}, ${g}, ${b})`;
}

let fetchedData = []; // 전체 데이터를 저장할 변수

//필터링
function isWithinTolerance(colorA, colorB, tolerance) {
  const rDiff = Math.abs(colorB.r - colorA.r);
  const gDiff = Math.abs(colorB.g - colorA.g);
  const bDiff = Math.abs(colorB.b - colorA.b);

  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
}

// RGB 값을 비교하기 위한 헬퍼 함수
function parseRgb(rgbString) {// RGB 값을 비교하기 위한 헬퍼 함수
  const rgbValues = rgbString
    .replace(/[^0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .map(Number);
  if (rgbValues.length !== 3 || rgbValues.some(value => isNaN(value) || value === undefined)) {return null;}
  return { r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] };}

function filterData() {
  const anywhereColorInput = document.getElementById("anywhereColor").value;
  const outerColorInput = document.getElementById("outerColor").value;
  const romanColorInput = document.getElementById("romanColor").value;
  const innerColorInput = document.getElementById("innerColor").value;
  const tolerance =
    parseInt(document.getElementById("toleranceInput").value, 10) || 10;

  const anywhereColor = anywhereColorInput
    ? parseRgb(anywhereColorInput)
    : null;
  const outerColor = outerColorInput ? parseRgb(outerColorInput) : null;
  const romanColor = romanColorInput ? parseRgb(romanColorInput) : null;
  const innerColor = innerColorInput ? parseRgb(innerColorInput) : null;

  document.querySelectorAll(".cell").forEach((td) => {
    const color1 = td.querySelector(".color_01")
      ? window.getComputedStyle(td.querySelector(".color_01")).backgroundColor
      : null;
    const color2 = td.querySelector(".color_02")
      ? window.getComputedStyle(td.querySelector(".color_02")).backgroundColor
      : null;
    const color3 = td.querySelector(".color_03")
      ? window.getComputedStyle(td.querySelector(".color_03")).backgroundColor
      : null;

    let show = true;

    // anywhereColorInput 조건 추가
    if (anywhereColor) {
      const matchesAnyColor = [color1, color2, color3].some((color) => {
        if (color) {
          const colorRgb = parseRgb(color); // filterParseRgb 대신 parseRgb 사용
          // tolerance를 사용하여 색상 비교
          return isWithinTolerance(anywhereColor, colorRgb, tolerance);
        }
        return false;
      });
      show = matchesAnyColor; // 하나라도 맞으면 show가 true
    }

    if (outerColor && color1) {
      const color1Rgb = parseRgb(color1);
      show = show && isWithinTolerance(outerColor, color1Rgb, tolerance);
    }

    if (romanColor && color2) {
      const color2Rgb = parseRgb(color2);
      show = show && isWithinTolerance(romanColor, color2Rgb, tolerance);
    }

    if (innerColor && color3) {
      const color3Rgb = parseRgb(color3);
      show = show && isWithinTolerance(innerColor, color3Rgb, tolerance);
    }

    // 조건에 맞는 td만 보여줍니다
    if (show) {
      td.classList.remove("hidden");
    } else {
      td.classList.add("hidden");
    }
  });
  filterToggle = 1;
}

function resetFilterData() {
  document.querySelectorAll(".cell").forEach((td) => {
    td.classList.remove("hidden");
  });
  filterToggle = 0;
}
let filterToggle = 0;
// 필터 버튼에 이벤트 리스너 추가
document.getElementById("filterButton").addEventListener("click", function () {
  console.log(filterToggle)
  if (filterToggle != 1) {
    console.log('필터링합니다')
    filterData();
  } else {
    resetFilterData();
  }
});
document.getElementById("autoFilter").addEventListener("change", function () {
  if (this.checked) {
    // 체크박스가 체크되었을 때 실행할 함수

    filterData();

  } else {
    resetFilterData();
  }
});




window.onload = function () {
  console.log('온로드');

  // 로컬 스토리지에서 API 키 가져오기
  const storedApiKey = localStorage.getItem("apiKey");
  if (storedApiKey) {
    document.getElementById("apiKeyInput").value = storedApiKey; // 가져온 키를 입력 필드에 설정
  }

  // 로컬 스토리지에서 서버 및 채널 값 가져오기
  const storedServer = localStorage.getItem("server");
  const storedChannel = localStorage.getItem("channel");
  if (storedServer) {
    document.getElementById("serverSelect").value = storedServer; // 서버 선택 설정
  }
  if (storedChannel) {
    document.getElementById("channelInput").value = storedChannel; // 채널 입력 설정
  }

  // locations 배열을 기반으로 locationSelect에 옵션 추가
  const locationSelect = document.getElementById("locationSelect");
  locations.forEach(({ location }) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });

  // RGB 색상 및 오차 범위 값 가져오기
  const anywhereColor = localStorage.getItem("anywhereColor");
  const storedOuterColor = localStorage.getItem("outerColor");
  const storedRomanColor = localStorage.getItem("romanColor");
  const storedInnerColor = localStorage.getItem("innerColor");
  const storedTolerance = localStorage.getItem("tolerance");
  
  if (anywhereColor) {
    document.getElementById("anywhereColor").value = anywhereColor; // anywhereColor를 올바르게 설정
  }
  if (storedOuterColor) {
    document.getElementById("outerColor").value = storedOuterColor;
  }
  if (storedRomanColor) {
    document.getElementById("romanColor").value = storedRomanColor;
  }
  if (storedInnerColor) {
    document.getElementById("innerColor").value = storedInnerColor;
  }
  if (storedTolerance) {
    document.getElementById("toleranceInput").value = storedTolerance;
  }
};

document.getElementById("apiKeyInput").addEventListener("input", function () {
  const apiKey = this.value;
  localStorage.setItem("apiKey", apiKey);
});

document.getElementById("serverSelect").addEventListener("change", function () {
  const server = this.value;
  localStorage.setItem("server", server);
});

document.getElementById("channelInput").addEventListener("input", function () {
  const channel = this.value;
  localStorage.setItem("channel", channel);
});


//////////////////////////////////////

//api 호출
async function fetchData() {
  const resultList = [];
  const serverName = document.getElementById("serverSelect").value;
  const channelNumber = document.getElementById("channelInput").value;
  const apiKey = document.getElementById("apiKeyInput").value;

  const headers = {
    accept: "application/json",
    "x-nxopen-api-key": apiKey,
  };

  for (const { location, npc } of locations) {
    try {
      const items = await fetchLocationData(npc, serverName, channelNumber, headers);
      resultList.push({ location, items });
    } catch (error) {
      displayError(error);
      return 0;
    }
  }

  fetchedData = resultList; // 받아온 데이터를 저장
  return resultList;
}

async function fetchLocationData(npc, serverName, channelNumber, headers) {
  const params = new URLSearchParams({
    npc_name: npc,
    server_name: serverName,
    channel: channelNumber,
  });

  const response = await fetch(`${url}?${params}`, { headers });
  if (!response.ok) {
    const errortext = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, ${errortext}`);
  }

  const data = await response.json();
  return processShops(data.shop);
}

function processShops(shops) {
  const items = [];

  const filteredShops = shops.filter((shop) => shop.tab_name === "주머니");
  for (const shop of filteredShops) {
    for (const item of shop.item) {
      const itemDisplayName = item.item_display_name;
      const imageUrl = item.image_url;

      if (imageUrl.includes("item_color=")) {
        const selectedColors = extractColors(imageUrl);
        items.push({ itemDisplayName, colors: selectedColors, imageUrl });
      }
    }
  }

  return items;
}

function extractColors(imageUrl) {
  const encodedString = imageUrl.split("item_color=")[1];
  const decodedString = decodeURIComponent(encodedString);
  const colors = JSON.parse(decodedString);

  // 필요한 색상만 선택
  const selectedColors = {};
  const colorKeys = ["color_01", "color_02", "color_03"];
  
  colorKeys.forEach((key) => {
    if (colors[key]) {
      selectedColors[key] = colors[key].replace("#", "").toLowerCase();
    }
  });

  return selectedColors;
}

function displayError(error) {
  const content = document.getElementById("content");
  content.innerHTML = `<div style="color: red;">오류 발생: ${error.message}</div>`;
}
////////////////////////////////////

// API 정보 배치 렌더링
function renderData(filteredData) {
  const content = document.getElementById("content");
  content.innerHTML = ""; // 기존 내용을 초기화

  filteredData.forEach(({ location, items }) => {
    const locationDiv = document.createElement("div");
    locationDiv.className = "location";
    locationDiv.textContent = location;
    content.appendChild(locationDiv);

    const table = document.createElement("div");
    table.className = "table"; // 테이블 클래스 추가
    let row = document.createElement("div");
    row.className = "row"; // row 클래스 추가

    items.forEach(({ itemDisplayName, colors, imageUrl }, itemIndex) => {
      const cell = document.createElement("div");
      cell.className = "cell"; // cell 클래스 추가

      // 왼쪽과 오른쪽을 나누기 위한 div 생성
      const container = document.createElement("div");
      container.className = "container";
      const upDiv = document.createElement("div");
      upDiv.className = "itemName";
      const downDiv = document.createElement("div");
      // downDiv.style.display = "flex"; // 수평 배치

      // 왼쪽 부분: 색상 박스
      const leftDiv = document.createElement("div");
      leftDiv.style.flex = "1"; // 왼쪽 div가 1배 비율
      leftDiv.className="bgColor"
      upDiv.innerHTML = `${itemDisplayName}`; // 아이템 이름 추가

      for (const [colorName, colorValue] of Object.entries(colors)) {
        const colorBox = document.createElement("div");
        
        colorBox.className = `color-box ${colorName}`;
        colorBox.style.backgroundColor = "#" + colorValue;
        colorBox.style.width = "20px"; // 색상 박스의 너비
        colorBox.style.height = "20px"; // 색상 박스의 높이
        // colorBox.style.display = "inline-block"; // 색상 박스를 가로로 나열
        leftDiv.appendChild(colorBox);
        leftDiv.innerHTML += `${hexToRgb("#" + colorValue)}<br>`;
        // console.log(`colorvalue:${colorValue} ,${hexToRgb(colorValue)} `);
      }
      const [hex1, hex2, hex3] = Object.values(colors).slice(0, 3);
      mabibase_color = [hex1, hex2, hex3].map((hex) => `0x${hex}`).join("%2C");

      // 오른쪽 부분: 이미지
      const rightDiv = document.createElement("div");
      rightDiv.style.flex = "1"; // 오른쪽 div가 1배 비율
      const img = document.createElement("img");
      img.src =
        mabibase_url +
        mabibase_jumoney[itemIndex] +
        mabibase_url_filter +
        mabibase_color;
      // 이미지 로드 실패 시 대체 이미지 설정
      img.onerror = function () {
        console.log("이미지 로드 실패:", img.src);
        img.src = "no_image.png"; // 대체 이미지 경로
      };

      img.alt = itemDisplayName; // 이미지 설명
      img.style.width = "58px"; // 이미지의 최대 너비를 100%로 설정
      img.style.height = "auto"; // 자동 높이 조절
      img.style.paddingBottom = "3px";

      const img0 = document.createElement("img");
      img0.src = imageUrl;
      img0.style.maxWidth = "64px";

      rightDiv.appendChild(img0);
      rightDiv.appendChild(img);

      // 왼쪽과 오른쪽 div를 container에 추가
      downDiv.appendChild(leftDiv);
      downDiv.appendChild(rightDiv);
      container.appendChild(upDiv);
      container.appendChild(downDiv);

      cell.appendChild(container);
      row.appendChild(cell);

      // 행에 6개의 셀이 추가되면 새 행 생성
      if (row.children.length % 6 === 0) {
        table.appendChild(row);
        row = document.createElement("div");
        row.className = "row"; // 새 행 클래스 추가
      }
    });

    // 남은 셀이 있을 경우 마지막 행에 추가
    if (row.children.length > 0) {
      table.appendChild(row);
    }

    content.appendChild(table);
  });
  const cells = document.querySelectorAll(".cell");
  // new ChannelingHandler(cells);
}

// locationSelect 변경 시 필터링된 데이터 렌더링
document.getElementById("locationSelect").addEventListener("change", () => {
  const selectedLocation = document.getElementById("locationSelect").value;
  const filteredData =
    selectedLocation === "전체"
      ? fetchedData // 전체 선택 시 모든 데이터 표시
      : fetchedData.filter(({ location }) => location === selectedLocation); // 선택된 위치에 해당하는 데이터만 필터링

  renderData(filteredData);
});

//채널바꾸면 lastNextResetTime null 만들어서 fetch 되게
document.getElementById("channelInput").addEventListener("change", function() {
  console.log('채널변경')
  lastNextResetTime = null; // 값이 변경될 때 lastNextResetTime을 null로 설정
});

// 버튼 클릭 시 데이터 가져오기 및 렌더링
document.getElementById("fetchButton").addEventListener("click", async () => {
  if (
    lastNextResetTime &&
    lastNextResetTime.getTime() === nextResetTime.getTime()
  ) {
    console.log("아직 시간 안바뀜");
    return;
  }

  const data = await fetchData();
  if (data) {
    renderData(data);
    if (document.getElementById("autoFilter").checked) {
      console.log("자동필터링 실행");
      filterData();
    }
    lastNextResetTime = nextResetTime;
  }
});

//////////////////////////////


// API 키 입력 필드에 이벤트 리스너 추가
document.getElementById("apiKeyInput").addEventListener("input", function () {
  const apiKey = this.value; // 입력값 가져오기
  localStorage.setItem("apiKey", apiKey); // 로컬 스토리지에 저장
});

// 서버 선택 필드에 이벤트 리스너 추가
document.getElementById("serverSelect").addEventListener("change", function () {
  const server = this.value; // 선택한 서버 가져오기
  localStorage.setItem("server", server); // 로컬 스토리지에 저장
});

// 채널 입력 필드에 이벤트 리스너 추가
document.getElementById("channelInput").addEventListener("input", function () {
  const channel = this.value; // 입력값 가져오기
  localStorage.setItem("channel", channel); // 로컬 스토리지에 저장
});

// RGB 색상 입력 필드에 이벤트 리스너 추가
document.getElementById("anywhereColor").addEventListener("input", function () {
  const anywhereColor = this.value; // 입력값 가져오기
  localStorage.setItem("anywhereColor", anywhereColor); // 로컬 스토리지에 저장
});

document.getElementById("outerColor").addEventListener("input", function () {
  const outerColor = this.value; // 입력값 가져오기
  localStorage.setItem("outerColor", outerColor); // 로컬 스토리지에 저장
});

document.getElementById("romanColor").addEventListener("input", function () {
  const romanColor = this.value; // 입력값 가져오기
  localStorage.setItem("romanColor", romanColor); // 로컬 스토리지에 저장
});

document.getElementById("innerColor").addEventListener("input", function () {
  const innerColor = this.value; // 입력값 가져오기
  localStorage.setItem("innerColor", innerColor); // 로컬 스토리지에 저장
});

// 오차 범위 입력 필드에 이벤트 리스너 추가
document
  .getElementById("toleranceInput")
  .addEventListener("input", function () {
    const tolerance = this.value; // 입력값 가져오기
    localStorage.setItem("tolerance", tolerance); // 로컬 스토리지에 저장
  });



  

////////////////////////////
const totalMinutesInDay = 24 * 60; // 24시간을 분으로 변환
const intervalMinutes = 36; // 초기화 간격 36분
const totalIntervals = totalMinutesInDay / intervalMinutes; // 36분으로 나눈 시간 조각의 수

let previousResetTime = null; // 이전 초기화 시간
let timerId = null; // 타이머 ID
let nextResetTime = null; // 글로벌 변수로 nextResetTime 선언
let lastNextResetTime = null;
let resetTime = null; // 1타임 전 시간을 저장할 변수

function updateNextResetTime() {
  const currentTime = new Date();

  // 현재 시간을 분으로 변환
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // 현재 간격
  const currentInterval = Math.floor(currentMinutes / intervalMinutes);
  const nextInterval = (currentInterval + 1) % totalIntervals;

  // 다음 초기화 시간 계산
  const nextResetMinutes = nextInterval * intervalMinutes;
  const nextResetHours = Math.floor(nextResetMinutes / 60);
  const nextResetMinutesRemainder = nextResetMinutes % 60;

  nextResetTime = new Date(); // 글로벌 변수에 현재 nextResetTime 할당
  nextResetTime.setHours(nextResetHours, nextResetMinutesRemainder, 0, 0);

  // 남은 시간 계산
  const timeRemaining = nextResetTime - currentTime;

  // 만약 현재 시간이 다음 초기화 시간보다 늦다면 다음 날로 설정
  if (timeRemaining < 0) {
    nextResetTime.setDate(nextResetTime.getDate() + 1);
  }

  // 1타임 전 시간을 계산
  resetTime = new Date(nextResetTime);
  resetTime.setMinutes(resetTime.getMinutes() - intervalMinutes); // 36분 전

  // 초 단위로 업데이트
  const secondsRemaining = Math.ceil((nextResetTime - currentTime) / 1000);

  // 시간 변경 시 함수 호출
  if (
    previousResetTime &&
    previousResetTime.getTime() !== nextResetTime.getTime()
  ) {
    console.log("시간 바뀜"); // 시간 변경 메시지

    // 체크박스가 체크되어 있을 때만 fetchData 실행
    if (document.getElementById("autoFetchCheckbox").checked) {
      // 10분 후에 fetchData 실행
      if (timerId) {
        clearTimeout(timerId); // 이전 타이머 정리
      }
      timerId = setTimeout(async () => {
        const data = await fetchData(); // 데이터를 가져오는 함수
        if (data) {
          renderData(data); // 가져온 데이터를 렌더링하는 함수
          if (document.getElementById("autoFilter").checked) {
            console.log("자동필터링 실행");
            filterData();
          }
          notification("주머니 업데이트");
        }
      }, 10 * 60 * 1000); // 10분 후
    }
  }

  // 현재 초기화 시간을 이전 시간으로 저장
  previousResetTime = nextResetTime;

  // 결과를 표시
  document.getElementById(
    "next_time"
  ).innerText = `이번 시간: ${resetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} ~ ${nextResetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} (남은 시간: ${secondsRemaining}초)`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateNextResetTime();
  setInterval(updateNextResetTime, 1000);
});
////////////////////////////

//윈도우 알림 띄우기
function notification(msg) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotification(msg);
      }
    });
  } else {
    showNotification(msg);
  }
}

function showNotification(msg) {
  const notification = new Notification("제목", {
    body: msg,
    // icon: "아이콘 URL" // 선택 사항
  });

  notification.onclick = () => {
    window.focus();
  };
}

// ChannelingHandler 클래스 정의
class ChannelingHandler {
  constructor(cells) {
    this.cells = cells;
    this.init();
  }

  init() {
    this.cells.forEach((cell) => {
      cell.addEventListener("click", () => this.handleCellClick(cell));
    });
  }

  handleCellClick(cell) {
    const itemName = this.getItemName(cell);
    const rgbCodes = this.getRGBCode(cell); // RGB 코드 가져오기
    const confirmationMessage = `${itemName}를 기준으로 채널링할까요?\nRGB Codes: ${rgbCodes.join(', ')}`;

    if (this.confirmAction(confirmationMessage)) {
      this.logCompletion(itemName);
    }
  }

  getItemName(cell) {
    return cell.querySelector(".container .itemName").textContent;
  }
  //rgb 코드 리스트
  getRGBCode(cell) {
    const colorBoxes = cell.querySelectorAll('.color-box'); // color-box 요소 선택
    const rgbCodes = Array.from(colorBoxes).map(box => {
      const bgColor = window.getComputedStyle(box).backgroundColor; // 배경색 가져오기
      return bgColor; // RGB 값 반환
    });
    return rgbCodes; // 배열로 반환
  }

  confirmAction(message) {
    return confirm(message);
  }

  logCompletion(itemName,rgbCodes) {

    console.log(`${itemName} 순회완료`);
  }
}
