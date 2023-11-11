document.addEventListener('DOMContentLoaded', () => {
    // Intégration de l'API CoinGecko pour obtenir la liste des cryptomonnaies prises en charge
    fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json())
        .then(data => {
            const cryptoSelect = document.getElementById('crypto');
            data.forEach(crypto => {
                const option = document.createElement('option');
                option.value = crypto.id;
                option.textContent = crypto.name;
                cryptoSelect.appendChild(option);
            });

            // Écouteur d'événements pour la sélection de cryptomonnaie
            cryptoSelect.addEventListener('change', () => {
                const selectedCryptoId = cryptoSelect.value;

                // Intégration de l'API CoinGecko pour obtenir le prix de la cryptomonnaie sélectionnée
                fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCryptoId}&vs_currencies=usd`)
                    .then(response => response.json())
                    .then(data => {
                        const cryptoPrice = data[selectedCryptoId].usd;
                        const cryptoPriceElement = document.getElementById('crypto-price');
                        const selectedCryptoElement = document.getElementById('selected-crypto');
                        selectedCryptoElement.textContent = `Sélection : ${cryptoSelect.options[cryptoSelect.selectedIndex].text}`;
                        cryptoPriceElement.textContent = `$${cryptoPrice}`;
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des données:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });

    // Écouteur pour le formulaire de transaction
    const transactionForm = document.getElementById('transaction-form');
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const crypto = document.getElementById('crypto').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const recipient = document.getElementById('recipient').value;

        const transactionHistory = document.getElementById('transaction-history');
        const newRow = transactionHistory.insertRow(-1);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = new Date().toLocaleString();
        cell2.innerHTML = crypto;
        cell3.innerHTML = amount;
        cell4.innerHTML = recipient;

        // Effacez les champs du formulaire après la transaction
        document.getElementById('amount').value = '';
        document.getElementById('recipient').value = '';
    });
});
