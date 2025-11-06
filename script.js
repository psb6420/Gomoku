$(function () {
  // 기본 준비
  $("#bdp .button").removeAttr("href");

  // 보드 크기 계산
  var ROWS = $("#bdp .galo").length;
  var COLS = $("#bdp .galo:first > div").length;

  // 상태값
  var board = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); // 0: 비어있음, 1: 빨강, 2: 파랑
  var gameStarted = false;
  var gameOver = false;
  var turn = 1; // 1=빨강, 2=파랑

  // 각 버튼에 좌표 태그(data-r, data-c) 부여
  $("#bdp .galo").each(function (r) {
    $(this).children("div").each(function (c) {
      $(this).find(".button").attr({ "data-r": r, "data-c": c });
    });
  });

  // 승리 판단 함수 (양방향 카운트)
  function checkWin(r, c, color) {
    function countDir(dr, dc) {
      let cnt = 1;

      // 정방향
      let rr = r + dr, cc = c + dc;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === color) {
        cnt++; rr += dr; cc += dc;
      }

      // 역방향
      rr = r - dr; cc = c - dc;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === color) {
        cnt++; rr -= dr; cc -= dc;
      }
      return cnt;
    }

    return (
      countDir(1, 0) >= 5 ||   // 세로
      countDir(0, 1) >= 5 ||   // 가로
      countDir(1, 1) >= 5 ||   // 대각 ↘
      countDir(1, -1) >= 5     // 대각 ↙
    );
  }

  // 오목 시작 버튼
  $(".omok").on("click", function () {
    gameStarted = true;
    $(".omok").hide();
    $("#bdp .button").css("background-color", "inherit").removeClass("have");
  });

  // 알 놓기(게임 중에만, 게임 종료 후엔 무시)
  $("#bdp").on("click", ".button", function (e) {
    if (!gameStarted || gameOver) return;

    var $btn = $(this);
    var r = +$btn.attr("data-r");
    var c = +$btn.attr("data-c");

    // 이미 놓인 자리면 무시
    if (board[r][c] !== 0 || $btn.hasClass("have")) return;

    // 현재 턴 색으로 표시
    if (turn === 1) {
      $btn.css("background-color", "red");
    } else {
      $btn.css("background-color", "blue");
    }
    $btn.addClass("have");
    board[r][c] = turn;

    // 승리 체크
    if (checkWin(r, c, turn)) {
      gameOver = true;
      setTimeout(function () {
        alert((turn === 1 ? "빨강" : "파랑") + "이 이겼습니다!");
      }, 0);
      return; // 이후 클릭은 모두 무시됨
    }

    // 턴 변경
    turn = (turn === 1 ? 2 : 1);
  });

  // 시작 전 미리보기(좌클/휠클/우클) — 게임 시작/종료 후에는 비활성
  $("#bdp").on("mousedown", ".button", function (event) {
    if (gameStarted || gameOver) return false; // 시작 후엔 동작 막기
    var $target = $(event.target);
    if (event.button === 0) $target.css("background-color", "red");
    if (event.button === 1) $target.css("background-color", "inherit");
    if (event.button === 2) $target.css("background-color", "blue");
  });

  // 재시작 (페이지 새로고침 대신 상태만 초기화)
  $(".restart").on("click", function () {
    board.forEach(row => row.fill(0));
    $("#bdp .button").css("background-color", "inherit").removeClass("have");
    gameStarted = false;
    gameOver = false;
    turn = 1;
    $(".omok").show();
  });
});