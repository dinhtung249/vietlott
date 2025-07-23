let currentGame = '645';
let results = [];

function switchGame(gameType) {
  currentGame = gameType;
  document.getElementById('result').innerText = '';
  loadData();
}

async function loadData() {
  try {
    const res = await fetch(`data/${currentGame}.json`);
    const text = await res.text();
    results = text.trim().split('\n').map(line => JSON.parse(line));
  } catch (error) {
    document.getElementById('result').innerText = 'Không thể tải dữ liệu.';
  }
}

function checkNumbers() {
  const input = document.getElementById('numberInput').value;
  const numbers = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

  if (numbers.length !== 6) {
    document.getElementById('result').innerText = '❗ Vui lòng nhập đúng 6 số, cách nhau dấu phẩy.';
    return;
  }

  let jackpots = [];

  for (const draw of results) {
    const winning = draw.result;

    // 6/45: đơn giản
    if (currentGame === '645') {
      const matched = numbers.filter(n => winning.includes(n));
      if (matched.length === 6) {
        jackpots.push(`🎯 Trúng 6/6 kỳ #${draw.id} (${draw.date})`);
      }

    } else if (currentGame === '655') {
      const first6 = winning.slice(0, 6);
      const bonus = winning[6];
      const matchedMain = numbers.filter(n => first6.includes(n));
      const matchedBonus = numbers.includes(bonus);

      if (matchedMain.length === 6) {
        jackpots.push(`🎯 Jackpot 1 tại kỳ #${draw.id} (${draw.date})`);
      } else if (matchedMain.length === 5 && matchedBonus) {
        jackpots.push(`🥈 Jackpot 2 tại kỳ #${draw.id} (${draw.date})`);
      }
    }
  }

  if (jackpots.length > 0) {
    document.getElementById('result').innerHTML = jackpots.join('<br>');
  } else {
    document.getElementById('result').innerText = '🙁 Không trúng Jackpot nào.';
  }
}

// Load mặc định
loadData();
