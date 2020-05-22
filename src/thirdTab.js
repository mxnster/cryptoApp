export function initThirdTab() {
    const tbody = document.getElementById('tbody-coins');

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

    async function renderInterface() {
        const thead = document.getElementById('thead-coins');
        thead.innerHTML = `
        <tr>
            <th>№</th> <th>Coin name</th> <th>Graph</th>
        </tr>`
        tbody.innerText = '';
        const coins = await loadCoinsList();
        let position = 1;
        for (let i = 0; i < 100; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = (`<td>${position++}</td>
                 <td data-id="${coins[i].id}" class="select">${coins[i].name} (${coins[i].symbol})</td>
                 <td> 
                 <button data-button-id="${coins[i].id}" class="btn btn-info">
                    <svg class="bi bi-graph-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"/>
                        <path fill-rule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
                 </svg>
               </button> </td>
                 `);
            tbody.appendChild(tr);
        }
    }

    function getCoinData(id) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.coingecko.com/api/v3/coins/${id}?localization=false`, true);
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
            }
            xhr.send(null);
        })
    }
    const fade = document.getElementById('fade');
    const close = document.getElementById('close');
    const container = document.getElementById('container');
    close.addEventListener('click', function () {
        fade.style.display = 'none';
    });
    fade.addEventListener('click', function (e) {
        if (e.target.getAttribute('id') == "fade") {
            fade.style.display = 'none';
        }
    });
    async function renderDescription(id) {

        fade.style.display = 'block';
        container.innerText = 'Loading...'
        const data = await getCoinData(id);
        container.innerHTML = `
            <img src="${data.image.small}">
            <p>Name: ${data.name}</p>
            <p>Description: ${data.description.en}</p>
            <p>Change the coin value to the dollar over the past day: ${data.market_data.price_change_percentage_24h_in_currency.usd} %</p>
            `;
    }

    tbody.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-id')) {
            let coinID = e.target.getAttribute('data-id');
            renderDescription(coinID);

        }
        if (e.target.hasAttribute('data-button-id')) {
            let coinID = e.target.getAttribute('data-button-id');
            renderGraph(coinID);

        }
    });

    function getCoinTickers(id) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=btc&days=1000`, true);
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText).prices;
                resolve(data);
            }
            xhr.send(null);
        })
    }

    async function renderGraph(id) {
        fade.style.display = 'block';
        container.innerText = 'Drawing...'
        const data = await getCoinTickers(id);
        console.log(data);
        
        data.sort((a, b) => a - b);
        const chart = Highcharts.chart('container', {

            title: {
                text: 'Coin graph in compare with BTC'
            },

            xAxis: {

            },

            yAxis: {

            },

            series: [{
                data: data,
                pointStart: 1
            }]
        });
    }



    renderInterface();

}