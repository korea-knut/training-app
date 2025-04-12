// dotenv 패키지 사용 (Node.js 환경에 필요한 부분)
require('dotenv').config(); // 이 코드는 서버 환경에서만 동작합니다.

async function getGPT() {
  const input = document.getElementById("mealInput").value;

  // 환경 변수에서 API 키 가져오기
  const openaiApiKey = process.env.OPENAI_API_KEY;  // 이 부분을 환경 변수로 불러옴

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`  // 여기에서 API 키를 사용
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `다음은 오늘의 식단이야:\n${input}\n전문 트레이너처럼 피드백을 해줘.`
        }
      ]
    })
  });

  if (response.status === 429) {
    document.getElementById("response").innerText = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    return;
  }

  const data = await response.json();
  console.log("GPT 응답 확인:", data);

  if (data.choices && data.choices[0]) {
    document.getElementById("response").innerText = data.choices[0].message.content;
  } else {
    document.getElementById("response").innerText = "GPT 응답 오류 발생!";
  }
}

// 요일별 루틴 자동 설정
const day = new Date().getDay(); // 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
let routineHTML = "";

if (day === 1 || day === 3) { // 월, 수
  routineHTML = `
    <li><input type="checkbox"> 네거티브 풀업</li>
    <li><input type="checkbox"> 푸쉬업</li>
    <li><input type="checkbox"> 플랭크</li>`;
} else if (day === 2 || day === 4) { // 화, 목
  routineHTML = `
    <li><input type="checkbox"> 스쿼트</li>
    <li><input type="checkbox"> 런지</li>
    <li><input type="checkbox"> 힙 브릿지</li>`;
} else if (day === 5) { // 금
  routineHTML = `
    <li><input type="checkbox"> 철봉 매달리기</li>
    <li><input type="checkbox"> 케틀벨 로우</li>
    <li><input type="checkbox"> 데드버그</li>`;
} else {
  // 토(6), 일(0) → 휴식
  routineHTML = `<li>💤 오늘은 휴식일입니다!</li>`;
}

document.getElementById("routine").innerHTML = routineHTML;

// 세트 타이머
function startSetTimer() {
  let time = 45;
  const display = document.getElementById("set-timer");
  const interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(interval);
      display.textContent = "완료!";
    }
  }, 1000);
}

// 휴식 타이머
function startRestTimer() {
  let time = 60;
  const display = document.getElementById("rest-timer");
  const interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(interval);
      display.textContent = "휴식 끝!";
    }
  }, 1000);
}

// PWA 설치
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  deferredPrompt = event;
  document.getElementById('installBtn').style.display = 'inline-block';

  document.getElementById('installBtn').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 앱을 설치함');
      } else {
        console.log('사용자가 앱 설치를 거부함');
      }
      deferredPrompt = null;
    });
  });
});
