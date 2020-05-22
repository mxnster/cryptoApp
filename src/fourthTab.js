export function initFourthTab() {
  const selectFrom = document.getElementById('from');
  const selectTo = document.getElementById('to');
  const input = document.getElementById('value');

  function loadCoinsList() {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coingecko.com/api/v3/coins/list', true);
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      }
      xhr.send(null);
    })
  }
  function loadVSCoinsList() {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies', true);
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      }
      xhr.send(null);
    })
  }

  async function renderOptions() {
    const coinsList = await loadCoinsList();
    const coinsVSList = await loadVSCoinsList();
    for (let i = 0; i < 50; i++) {
      const html = `<option class="dropdown-item" value="${coinsList[i].id}">${coinsList[i].name}</option>`
      selectFrom.insertAdjacentHTML('beforeend', html);
    }
    coinsVSList.forEach(coin => {
      const html = `<option class="dropdown-item" value="${coin}">${coin.toUpperCase()}</option>`
      selectTo.insertAdjacentHTML('beforeend', html);
    });

    input.addEventListener('input', updateResult);

    selectFrom.addEventListener('change', function () {
      const firstCoin = selectFrom.value;
      const secondCoin = selectTo.value;
      loadRatesFor(firstCoin, secondCoin);
      updateResult();
    })

    selectTo.addEventListener('change', function () {
      const firstCoin = selectFrom.value;
      const secondCoin = selectTo.value;
      loadRatesFor(firstCoin, secondCoin);
      updateResult();
    })

  }
  renderOptions();

  async function updateResult() {
    const firstCoin = selectFrom.value;
    const secondCoin = selectTo.value;
    const val = input.value;
    const rate = await loadRatesFor(firstCoin, secondCoin);
    const result = val * rate;
    document.getElementById('result').innerText = result.toFixed(6);
  }

  function loadRatesFor(from, to) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`, true);
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        const rate = data[`${from}`][`${to}`];
        resolve(rate);
        
      }
      xhr.send(null);
    })
  }
 
}
