document.addEventListener('DOMContentLoaded', function() {
    // ... (Ваш существующий код) ...

    // Function to reveal elements on scroll
    function reveal() {
        const reveals = document.querySelectorAll(".hidden");

        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const revealTop = reveals[i].getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                reveals[i].classList.add("show");
            } else {
                reveals[i].classList.remove("show"); // Removed to prevent re-animation
            }
        }
    }

    // Add event listener for scroll
    window.addEventListener("scroll", reveal);

    // Initial reveal on page load
    reveal();
});