export function initFirstTab() {
    function loadData() {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.coingecko.com/api/v3/exchange_rates', true);
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText).rates;
                let array = [];
                for (let key in data) {
                    array.push(data[key]);
                }
                resolve(array);
            }
            xhr.onerror = () => reject('Error!');
            xhr.send();

        })

    }

    loadData().then(function (currencies) {
        const tbody = document.getElementById('tbody-rates');
        const thead = document.getElementById('thead-rates');
        thead.innerHTML = `
            <tr>
                <th>Name</th> <th>Ammout of coins to buy 1 BTC</th>
            </tr>`;
        tbody.innerHTML = '';
        currencies.shift();
        currencies.forEach(currency => {
            const tr = document.createElement('tr');
            tr.innerHTML = (`<td>${currency.name}</td> <td>${currency.value}</td>`);
            tbody.appendChild(tr);
        })
    }).catch((error) => {
        alert(error);
    })

}
