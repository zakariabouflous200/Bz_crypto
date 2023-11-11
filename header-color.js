window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section'); // Sélectionnez toutes les sections
    const headerLogo = document.querySelector('header .logo a'); // Sélectionnez le logo dans le header
    const headerLinks = document.querySelectorAll('header .links a'); // Sélectionnez les liens dans le header

    let isWhiteSection = false; // Indicateur pour savoir si la section actuellement visible a un arrière-plan blanc

    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Vérifiez si la section a un arrière-plan blanc
            const backgroundColor = window.getComputedStyle(section).backgroundColor;
            if (backgroundColor === 'rgb(255, 255, 255)') {
                // La section est visible et a un arrière-plan blanc, mettez les éléments du header en noir
                headerLogo.style.color = 'black';

                headerLinks.forEach(function(link) {
                    link.style.color = 'black';
                });

                isWhiteSection = true;
            } else {
                // Réinitialisez les styles du header si la nouvelle section n'a pas d'arrière-plan blanc
                headerLogo.style.color = 'white';

                headerLinks.forEach(function(link) {
                    link.style.color = 'white';
                });

                if (!isWhiteSection) {
                    isWhiteSection = false;
                }
            }
        }
    });

    // Réinitialisez les styles du header si aucune section avec un arrière-plan blanc n'est visible
    if (!isWhiteSection) {
        headerLogo.style.color = 'white';

        headerLinks.forEach(function(link) {
            link.style.color = 'white';
        });
    }
});
