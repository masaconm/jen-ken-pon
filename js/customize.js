// JavaScript Document
//20241101 勝敗結果引き分け後のplayerButtonsの反応を改善する修正


let isGameStarted = false;
let isGameInProgress = false;

// 初期状態でプレイヤー選択ボタンを無効化
document.addEventListener("DOMContentLoaded", () => {
  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.add('disabled-style'));
});

/**
 * ゲームを開始する関数
 * - スタートボタンが押されたときに、音声を再生し、ゲーム状態を更新
 * - プレイヤー選択ボタンを有効化し、スタートボタンの見た目を変更
 */
function startGame() {
  const audio = document.getElementById('jankenSound');
  audio.play();
  isGameStarted = true;
  isGameInProgress = false;

  const startButton = document.querySelector('button[onclick="startGame()"]');
  startButton.style.backgroundColor = '#dc2626';
  startButton.textContent = 'Game On!';

  // プレイヤー選択ボタンを有効化
  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.remove('disabled-style'));
}

// オーディオファイルのロード
const drawAudio = new Audio('audio/j2.mp3'); // 引き分け時の音声
const winAudio = new Audio('audio/j3.mp3'); // 勝利時の音声
const loseAudio = new Audio('audio/j4.mp3'); // 敗北時の音声
const starAudio = new Audio('audio/syset03-pop-up.mp3'); // 星エフェクト音声

/**
 * プレイヤーが選択した手に基づいてゲームを実行する関数
 * - プレイヤーの選択とコンピューターの選択により勝敗を判定
 * - 結果を表示し、対応する音声や画像を再生
 * 
 * @param {string} playerChoice - プレイヤーの選択（「グー」「チョキ」「パー」）
 */
function playGame(playerChoice) {
  if (!isGameStarted || isGameInProgress) {
    return;
  }

  isGameInProgress = true; // ゲームが進行中であることを設定

  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.add('disabled-style')); // ボタンを無効化

  const choices = ['グー', 'チョキ', 'パー'];
  const computerChoice = choices[Math.floor(Math.random() * choices.length)]; // ランダムでコンピューターの手を選択
  let result;
  let resultId;
  let displayTime = 4000;

  const computerHandImg = document.getElementById('computerHand');
  computerHandImg.classList.remove('fade-out', 'fade-in'); // アニメーションリセット

  // コンピューターの選択に応じた画像を設定
  if (computerChoice === 'グー') {
    computerHandImg.src = 'img/chara_play_goo.svg';
  } else if (computerChoice === 'チョキ') {
    computerHandImg.src = 'img/chara_play_choki.svg';
  } else if (computerChoice === 'パー') {
    computerHandImg.src = 'img/chara_play_par.svg';
  }

  // プレイヤーとコンピューターの手に基づく勝敗判定と結果表示
  if (playerChoice === computerChoice) {
    result = '引き分け！';
    resultId = 'drawStars';
    displayTime = 1000;

    // 引き分け時はボタンと進行中フラグを即座にリセット
    playerButtons.forEach(button => button.classList.remove('disabled-style'));
    isGameInProgress = false; // フラグをリセット

    setTimeout(() => {
      drawAudio.play(); // 引き分け音声の再生
      computerHandImg.src = 'img/result_draw.png';

      drawAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(true); // 引き分けのフラグを立ててゲームをリセット
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 1000);

  } else if (
    (playerChoice === 'グー' && computerChoice === 'チョキ')
    || (playerChoice === 'チョキ' && computerChoice === 'パー')
    || (playerChoice === 'パー' && computerChoice === 'グー')
  ) {
    result = 'あなたの勝ち！';
    resultId = 'winStars';

    setTimeout(() => {
      winAudio.play(); // 勝利音声の再生
      computerHandImg.src = 'img/result_win.png';

      winAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(false); // ゲームをリセット
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 2000);

  } else {
    result = 'あなたの負け！';
    resultId = 'looseStars';

    setTimeout(() => {
      loseAudio.play(); // 敗北音声の再生
      computerHandImg.src = 'img/result_lose.png';

      loseAudio.onended = () => {
        starAudio.play();
        starAudio.onended = () => {
          resetGame(false); // ゲームをリセット
        };
        document.getElementById(resultId).innerHTML += '<img src="img/star.png" class="w-[30px] max-[430px]:w-[20px] inline-block max-[430px]:max-w-fit" alt="star">';
      };
    }, 2000);
  }

  // 結果の表示
  setTimeout(() => {
    computerHandImg.classList.add('fade-out'); // アニメーション開始
    setTimeout(() => {
      computerHandImg.src = 'img/top.svg'; // 初期状態に戻す
      computerHandImg.classList.remove('fade-out');
      computerHandImg.classList.add('fade-in');
    }, 1000);
  }, displayTime);

  document.getElementById('result').textContent = result;
  document.getElementById('playerChoice').textContent = `あなたの手: ${playerChoice}`;
  document.getElementById('computerChoice').textContent = `コンピューターの手: ${computerChoice}`;
}

/**
 * ゲームのリセットを行う関数
 * - ゲーム進行状態をリセットし、ボタンと表示を初期化
 * 
 * @param {boolean} isDraw - 引き分けかどうかのフラグ
 */
function resetGame(isDraw) {
  isGameInProgress = false; // ゲーム進行中のフラグをリセット
  const startButton = document.querySelector('button[onclick="startGame()"]');

  if (!isDraw) {
    startButton.style.backgroundColor = ''; // デフォルトの背景色に戻す
    startButton.classList.add('bg-custom'); // デフォルトの色を設定
    startButton.textContent = 'Tap to Start!'; // ボタンのテキストをデフォルトに戻す
  }

  const playerButtons = document.querySelectorAll('.playerChoice');
  playerButtons.forEach(button => button.classList.remove('disabled-style')); // ボタンを有効化

  if (!isDraw) {
    isGameStarted = false; // 引き分けでない場合はゲーム開始フラグをリセット
  }
}
