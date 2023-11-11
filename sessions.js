// Code pour vérifier la session sur le tableau de bord (dashboard.html)
document.addEventListener('DOMContentLoaded', () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        document.getElementById('welcome-message').textContent = `Bienvenue, ${userData.firstname} !`;
    } else {
        window.location.href = 'account.html';
    }
});
