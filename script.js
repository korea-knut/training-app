// 타이머 함수: 세트 타이머
function startSetTimer() {
  let time = 45;  // 세트 타이머 시간 (45초)
  const display = document.getElementById("set-timer");  // 타이머 화면 표시 요소
  const interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;  // 타이머 화면에 표시
    time--;
    if (time < 0) {
      clearInterval(interval);  // 타이머 종료
      display.textContent = "완료!";
    }
  }, 1000);
}

// 타이머 함수: 휴식 타이머
function startRestTimer() {
  let time = 60;  // 휴식 타이머 시간 (60초)
  const display = document.getElementById("rest-timer");  // 타이머 화면 표시 요소
  const interval = setInterval(() => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;  // 타이머 화면에 표시
    time--;
    if (time < 0) {
      clearInterval(interval);  // 타이머 종료
      display.textContent = "휴식 끝!";
    }
  }, 1000);
}

// GPT API 요청 함수
async function getGPT() {
  const input = document.getElementById("mealInput").value;

  // 클라이언트에서 직접 API 요청 대신 서버로 요청을 보냄
  const response = await fetch('/api/gpt', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input: input })
  });

  const data = await response.json();
  
  if (response.status === 429) {
    document.getElementById("response").innerText = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    return;
  }

  if (data.choices && data.choices[0]) {
    document.getElementById("response").innerText = data.choices[0].message.content;
  } else {
    document.getElementById("response").innerText = "GPT 응답 오류 발생!";
  }
}


// 홈 화면에 추가 (PWA 기능)
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
