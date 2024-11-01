let isGameStarted = false; // ゲームが開始されたかを管理
let isGameInProgress = false; // ゲームが進行中かを管理

// 初期状態でプレイヤー選択ボタンを無効化
document.addEventListener("DOMContentLoaded", () => {
  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.add('disabled-style'));
});

function startGame() {
  const audio = document.getElementById('jankenSound');
  audio.play();
  isGameStarted = true; // スタートボタンが押されたらゲームを開始
  isGameInProgress = false; // 新しいゲームが始まるので進行中フラグをリセット

  // スタートボタンの背景色を赤に変更し、テキストを "Game On!" に変更
  const startButton = document.querySelector('button[onclick="startGame()"]');
  startButton.style.backgroundColor = '#dc2626';
  startButton.textContent = 'Game On!';

  // スタートボタンが押されたときにプレイヤー選択ボタンを有効化
  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.remove('disabled-style'));
}


const drawAudio = new Audio('audio/j2.mp3');
const winAudio = new Audio('audio/j3.mp3');
const loseAudio = new Audio('audio/j4.mp3');
const starAudio = new Audio('audio/syset03-pop-up.mp3');

function playGame(playerChoice) {
  if (!isGameStarted || isGameInProgress) {
    return;
  }

  isGameInProgress = true;

  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.add('disabled-style'));

  const choices = ['グー', 'チョキ', 'パー'];
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];
  let result;
  let resultId;
  let displayTime = 4000;

  const computerHandImg = document.getElementById('computerHand');
  computerHandImg.classList.remove('fade-out', 'fade-in');

  if (computerChoice === 'グー') {
    computerHandImg.src = 'img/chara_play_goo.svg';
  } else if (computerChoice === 'チョキ') {
    computerHandImg.src = 'img/chara_play_choki.svg';
  } else if (computerChoice === 'パー') {
    computerHandImg.src = 'img/chara_play_par.svg';
  }

  if (playerChoice === computerChoice) {
    result = '引き分け！';
    resultId = 'drawStars';
    displayTime = 1000;

    setTimeout(() => {
      drawAudio.play();
      computerHandImg.src = 'img/result_draw.png';

      drawAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(true); // 引き分けのフラグをtrueに設定
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 1000);

  } else if (
    (playerChoice === 'グー' && computerChoice === 'チョキ') ||
    (playerChoice === 'チョキ' && computerChoice === 'パー') ||
    (playerChoice === 'パー' && computerChoice === 'グー')
  ) {
    result = 'あなたの勝ち！';
    resultId = 'winStars';

    setTimeout(() => {
      winAudio.play();
      computerHandImg.src = 'img/result_win.png';

      winAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(false);
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 2000);

  } else {
    result = 'あなたの負け！';
    resultId = 'looseStars';

    setTimeout(() => {
      loseAudio.play();
      computerHandImg.src = 'img/result_lose.png';

      loseAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(false);
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 2000);
  }

  setTimeout(() => {
    computerHandImg.classList.add('fade-out');
    setTimeout(() => {
      computerHandImg.src = 'img/top.svg';
      computerHandImg.classList.remove('fade-out');
      computerHandImg.classList.add('fade-in');
    }, 1000);
  }, displayTime);

  document.getElementById('result').textContent = result;
  document.getElementById('playerChoice').textContent = `あなたの手: ${playerChoice}`;
  document.getElementById('computerChoice').textContent = `コンピューターの手: ${computerChoice}`;
}

function resetGame(isDraw) {
  isGameInProgress = false;
  const startButton = document.querySelector('button[onclick="startGame()"]');
  
  if (!isDraw) {
    // 引き分けでない場合のみ背景色とテキストをリセット
    startButton.style.backgroundColor = ''; // デフォルトの背景色に戻す
    startButton.classList.add('bg-custom'); // .bg-custom クラスを追加してデフォルトの色に戻す
    startButton.textContent = 'Tap to Start!'; // ボタンのテキストをデフォルトに戻す
  }

  if (isDraw || !isGameStarted) {
    const playerButtons = document.querySelectorAll('.playerChoice');
    playerButtons.forEach(button => button.classList.remove('disabled-style'));
  } else {
    isGameStarted = false;
  }
}
