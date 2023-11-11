document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#crypto-table tbody");
    const canvas = document.getElementById("crypto-chart");
    const ctx = canvas.getContext("2d");
    const detailsContainer = document.getElementById("crypto-details");

    let cryptoData = []; // Stocker les données des cryptomonnaies
    let selectedCrypto = null; // Cryptomonnaie sélectionnée

    async function fetchCryptoData() {
        try {
            const response = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=true"
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    function updateCryptoTable(cryptoData) {
        tableBody.innerHTML = "";
        cryptoData.forEach((crypto) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${crypto.name}</td>
                <td>${crypto.symbol}</td>
                <td>${crypto.current_price.toFixed(2)}</td>
                <td>${crypto.market_cap.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);

            // Ajouter un gestionnaire de clic à chaque ligne du tableau
            row.addEventListener("click", async () => {
                selectedCrypto = crypto;
                showCryptoDetails(selectedCrypto);
                await drawPriceChart(selectedCrypto.id);
            });
        });
    }

    function showCryptoDetails(crypto) {
        // Afficher les informations détaillées
        const cryptoName = document.getElementById("crypto-name");
        const cryptoSymbol = document.getElementById("crypto-symbol");
        const cryptoPrice = document.getElementById("crypto-price");
        const cryptoMarketCap = document.getElementById("crypto-market-cap");

        cryptoName.textContent = crypto.name;
        cryptoSymbol.textContent = crypto.symbol;
        cryptoPrice.textContent = `$${crypto.current_price.toFixed(2)}`;
        cryptoMarketCap.textContent = `$${crypto.market_cap.toLocaleString()}`;

        // Afficher le conteneur des détails
        detailsContainer.style.display = "block";
    }

    async function drawPriceChart(cryptoId) {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`
            );
            const data = await response.json();
    
            console.log("Données de l'API : ", data);
    
            if (!data || !data.prices || data.prices.length === 0) {
                console.error("Aucune donnée de prix disponible.");
                return;
            }
    
            const canvasWidth = 1200;
            const canvasHeight = 600; 
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
    
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
            const prices = data.prices.map((priceData) => priceData[1]);
    
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
    
            const yAxisStep = (maxPrice - minPrice) / 6; // Définir le nombre d'étapes sur l'axe Y (6 étapes)
            const xAxisStep = Math.floor(prices.length / 6); // Définir le nombre d'étapes sur l'axe X (6 étapes)
    
            // Dessiner les étiquettes de l'axe Y
            for (let i = 0; i <= 6; i++) {
                const price = minPrice + i * yAxisStep;
                const y = canvasHeight - ((price - minPrice) / (maxPrice - minPrice)) * canvasHeight;
                ctx.fillText(`$${price.toFixed(2)}`, 5, y - 5);
            }
    
            // Dessiner les étiquettes de l'axe X
            for (let i = 0; i <= 6; i++) {
                const index = i * xAxisStep;
                if (index < prices.length) {
                    const timestamp = data.prices[index][0];
                    const date = new Date(timestamp);
                    const x = (i / 6) * canvasWidth;
                    ctx.fillText(date.toLocaleDateString(), x, canvasHeight + 15);
                }
            }
    
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
    
            for (let i = 0; i < prices.length; i++) {
                const price = prices[i];
                const x = (i / (prices.length - 1)) * canvasWidth;
                const y = canvasHeight - ((price - minPrice) / (maxPrice - minPrice)) * canvasHeight;
    
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
    
            ctx.stroke();
        } catch (error) {
            console.error("Erreur lors de la récupération des données historiques :", error);
        }
    }

    async function updateCryptoData() {
        cryptoData = await fetchCryptoData();
        if (!cryptoData) return;

        updateCryptoTable(cryptoData);

        if (cryptoData.length > 0) {
            selectedCrypto = cryptoData[0];
            showCryptoDetails(selectedCrypto);
            await drawPriceChart(selectedCrypto.id);
        }
    }

    
    updateCryptoData();
});
