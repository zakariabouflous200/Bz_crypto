// Gestionnaire d'événements pour l'inscription
document.getElementById('register-button').addEventListener('click', () => {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Effectuez des validations côté client pour l'inscription
    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
    } else {
        // Stockez les données localement en utilisant localStorage
        const userData = {
            firstname,
            lastname,
            email,
            password
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert("Inscription réussie !");
    }
});

// Gestionnaire d'événements pour la connexion
document.getElementById('login-button').addEventListener('click', () => {
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    // Récupérez les données stockées localement
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (loginEmail === userData.email && loginPassword === userData.password) {
            alert("Connexion réussie !");
            // Redirigez l'utilisateur vers une page de tableau de bord ou effectuez d'autres actions.
        } else {
            alert("Informations d'identification incorrectes.");
        }
    } else {
        alert("Aucun compte trouvé.");
    }
});
