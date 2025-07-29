
let currentGame = '645';
let results = [];

function switchGame(gameType) {
  currentGame = gameType;

  if (gameType === 'stat') {
    document.getElementById('checkSection').style.display = 'none';
    document.getElementById('statSection').style.display = 'block';
    document.getElementById('title').innerText = "📊 Thống kê theo số đầu tiên";
  } else {
    document.getElementById('checkSection').style.display = 'block';
    document.getElementById('statSection').style.display = 'none';
    document.getElementById('title').innerText = `🔍 Kiểm tra kết quả ${gameType}`;
    loadData();
  }

  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn' + gameType)?.classList.add('active');
}

async function loadData() {
  try {
    const res = await fetch(`data/${currentGame}.json`);
    const text = await res.text();
    results = text.trim().split('\n').map(line => JSON.parse(line));
  } catch {
    document.getElementById('result').innerText = 'Không thể tải dữ liệu.';
  }
}

function checkNumbers() {
  const input = document.getElementById('numberInput').value;
  const numbers = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  if (numbers.length !== 6) {
    document.getElementById('result').innerText = '❗ Vui lòng nhập đúng 6 số.';
    return;
  }

  let jackpots = [];

  for (const draw of results) {
    const winning = draw.result;
    if (currentGame === '645') {
      if (numbers.filter(n => winning.includes(n)).length === 6) {
        jackpots.push(`🎯 Trúng 6/6 kỳ #${draw.id} (${draw.date})`);
      }
    } else if (currentGame === '655') {
      const first6 = winning.slice(0, 6);
      const bonus = winning[6];
      const matched = numbers.filter(n => first6.includes(n));
      const hasBonus = numbers.includes(bonus);
      if (matched.length === 6) {
        jackpots.push(`🎯 Jackpot 1 tại kỳ #${draw.id} (${draw.date})`);
      } else if (matched.length === 5 && hasBonus) {
        jackpots.push(`🥈 Jackpot 2 tại kỳ #${draw.id} (${draw.date})`);
      }
    }
  }

  document.getElementById('result').innerHTML = jackpots.length > 0
    ? jackpots.join('<br>')
    : '🙁 Không trúng Jackpot nào.';
}

async function runStatistics() {
  const number = parseInt(document.getElementById('statNumber').value);
  const game = document.getElementById('statGame').value;

  if (isNaN(number) || number < 1 || number > 45) {
    document.getElementById('statResult').innerText = '❗ Vui lòng nhập số từ 1 đến 45.';
    return;
  }

  try {
    const res = await fetch(`data/${game}.json`);
    const text = await res.text();
    const data = text.trim().split('\n').map(line => JSON.parse(line));
    const matches = data.filter(d => d.result[0] === number);
    if (matches.length === 0) {
      document.getElementById('statResult').innerText = 'Không tìm thấy kỳ nào có số này ở đầu.';
    } else {
      const lines = matches.map(d => `#${d.id} (${d.date}): ${d.result.join(', ')}`);
      document.getElementById('statResult').innerText = lines.join('\n');
    }
  } catch {
    document.getElementById('statResult').innerText = 'Không thể tải dữ liệu.';
  }
}

loadData();
