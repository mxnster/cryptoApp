export function initSecondTab() {
    function loadData() {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.coingecko.com/api/v3/exchanges', true);
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
            }
            xhr.onerror = () => reject('Error!');
            xhr.send();

        })

    }

    loadData().then(function (exchanges) {
        const tbody = document.getElementById('tbody-exchanges');
        const thead = document.getElementById('thead-exchanges');
        thead.innerHTML = `
        <tr>
            <th>№</th> <th>Name</th> <th>Year</th> <th>Country</th> <th>Volume</th>
        </tr>`
        tbody.innerHTML = '';
        let position = 1;
        exchanges.forEach(exchange => {
            const tr = document.createElement('tr');
            tr.innerHTML = (`<td>${position++}</td>
                         <td><img src="${exchange.image}" height = 16px > <a href="${exchange.url}">${exchange.name}</a></td>
                         <td>${exchange.year_established}</td>
                         <td>${exchange.country}</td>
                         <td>${exchange.trade_volume_24h_btc_normalized.toFixed(2)}</td>
        
                         `);
            tbody.appendChild(tr);
        });
    }).catch((error) => {
        alert(error);
    })
}
