document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#crypto-table tbody");
    const canvas = document.getElementById("crypto-chart");
    const ctx = canvas.getContext("2d");
    const detailsContainer = document.getElementById("crypto-details");

    let cryptoData = [];
    let hoveredCrypto = null; 

    async function fetchCryptoData() {
        try {
            const response = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false"
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
            row.addEventListener("click", () => {
                showCryptoDetails(crypto);
            });
        });
    }

    function showCryptoDetails(crypto) {
        const cryptoName = document.getElementById("crypto-name");
        const cryptoSymbol = document.getElementById("crypto-symbol");
        const cryptoPrice = document.getElementById("crypto-price");
        const cryptoMarketCap = document.getElementById("crypto-market-cap");

        cryptoName.textContent = crypto.name;
        cryptoSymbol.textContent = crypto.symbol;
        cryptoPrice.textContent = `$${crypto.current_price.toFixed(2)}`;
        cryptoMarketCap.textContent = `$${crypto.market_cap.toLocaleString()}`;


        detailsContainer.style.display = "block";
    }

    function hideCryptoDetails() {

        detailsContainer.style.display = "none";
    }

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxPrice = Math.max(...cryptoData.map((crypto) => crypto.current_price));
        const barWidth = canvas.width / cryptoData.length;

        cryptoData.forEach((crypto, index) => {
            const barHeight = (crypto.current_price / maxPrice) * canvas.height;
            const x = index * barWidth;
            const y = canvas.height - barHeight;

            ctx.fillStyle = hoveredCrypto === crypto ? "blue" : "gray"; // Met en évidence la crypto survolée
            ctx.fillRect(x, y, barWidth, barHeight);


            if (hoveredCrypto === crypto) {
                // Afficher des informations au survol
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.fillText(`Price: $${crypto.current_price.toFixed(2)}`, x + 10, y - 10);
                ctx.fillText(`Market Cap: $${crypto.market_cap.toLocaleString()}`, x + 10, y - 30);
            }
        });
    }

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Vérifiez si la souris est sur une crypto
        hoveredCrypto = cryptoData.find(
            (crypto, index) => x >= (index * canvas.width) / cryptoData.length && x <= ((index + 1) * canvas.width) / cryptoData.length && y >= canvas.height - (crypto.current_price / cryptoData[0].current_price) * canvas.height
        );

        drawChart(); // Redessine le graphique avec la mise en évidence
    });

    canvas.addEventListener("mouseout", () => {
        hoveredCrypto = null;
        drawChart(); // Efface la mise en évidence
    });

    async function updateCryptoData() {
        cryptoData = await fetchCryptoData();
        if (!cryptoData) return;

        updateCryptoTable(cryptoData);

        // Mettez à jour le graphique dans le canvas
        drawChart();

        requestAnimationFrame(updateCryptoData);
    }

    // Chargez initialement les données et démarrez les mises à jour
    fetchCryptoData().then((data) => {
        cryptoData = data;
        updateCryptoTable(cryptoData);
        drawChart();
        updateCryptoData();
    });
});
