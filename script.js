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
  const input = document.getElementById("mealInput").value;  // 사용자가 입력한 식단

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your_openai_api_key_here"  // API 키는 보안상의 이유로 서버 측에서 처리해야 함
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
