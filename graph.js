// Obtenez le canvas et son contexte
const canvas = document.getElementById("crypto-canvas");
const ctx = canvas.getContext("2d");

// Fonction pour récupérer les données de toutes les cryptomonnaies depuis l'API CoinGecko
async function fetchAllCryptoData() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h");
        const data = await response.json();

        // Sélectionnez les colonnes de données que vous souhaitez afficher
        const cryptoData = data.map((crypto) => ({
            name: crypto.name,
            price: crypto.current_price,
        }));

        // Créez un graphique à barres à l'aide de D3.js
        createBarChart(cryptoData);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Fonction pour créer un graphique à barres avec D3.js
function createBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    const svg = d3.select(canvas)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelles pour l'axe X et l'axe Y
    const x = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.price)])
        .nice()
        .range([height, 0]);

    // Créer les barres du graphique à barres
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.price))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.price))
        .attr("fill", "steelblue");

    // Ajouter l'axe X
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Ajouter l'axe Y
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Ajouter des étiquettes aux barres
    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.price) - 5)
        .attr("text-anchor", "middle")
        .text((d) => d.price.toFixed(2));

}

// Appel de la fonction pour récupérer les données au chargement de la page
fetchAllCryptoData();
