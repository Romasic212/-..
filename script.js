
function showNotification(message, type = 'success') {
    const notificationElement = document.getElementById('notification');
    const notificationMessageElement = document.getElementById('notification-message');

    notificationMessageElement.textContent = message;
    notificationElement.classList.add(type);
    notificationElement.classList.add('show');

    // Hide notification after 3 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.classList.remove(type);
    }, 3000);
}

// Function to display user area after login
function displayUserArea(user) {
    const userArea = document.getElementById('user-area');
    userArea.innerHTML = `
        <div class="user-info">
            <a href="./lkab.html" class="profile-link"><i class="fas fa-user"></i> ${user.username}</a>
            <button id="logout-button" class="btn btn-secondary"><i class="fas fa-sign-out-alt"></i> Выйти</button>
        </div>
    `;

    document.getElementById('logout-button').addEventListener('click', function() {
        sessionStorage.removeItem('loggedInUser');
        updateUserArea();
        showNotification('Вы вышли из аккаунта.', 'success');
    });
}

// Function to show login/register link
function displayLoginRegister() {
    const userArea = document.getElementById('user-area');
    userArea.innerHTML = `
        <a href="./lkab" id="login-register-link" class="user-icon">
            <i class="fas fa-user"></i>
        </a>
    `;

    const loginRegisterLink = document.getElementById('login-register-link'); // Added to define it
    loginRegisterLink.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('login-modal').style.display = "block";
    });
}

function updateUserArea() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
        displayUserArea(JSON.parse(loggedInUser));
    } else {
        displayLoginRegister();
    }
}

// Initial check on page load
updateUserArea();

// Function for slider initialization
function initializeSliders() {
    const sliders = document.querySelectorAll('.merch-slider-container');

    sliders.forEach(sliderContainer => {
        const slider = sliderContainer.querySelector('.merch-slider');
        const navLeft = sliderContainer.querySelector('.nav-button.left');
        const navRight = sliderContainer.querySelector('.nav-button.right');
        const merchItems = slider.querySelectorAll('.merch-item');

        let currentIndex = 0;
        const itemCount = merchItems.length;

        // Function to update the slider position
        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * (100 / getVisibleItems())}%)`;
        }

        // Function to get the number of visible items in the slider
        function getVisibleItems() {
            // Adaptive logic to determine the number of visible elements
            if (window.innerWidth <= 768) {
                return 1; // Show only one item on mobile devices
            } else {
                return 3; // Show 3 items on desktop
            }
        }

        // Function to go to the next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % itemCount;
            updateSlider();
        }

        // Function to go to the previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            updateSlider();
        }

        // Event listeners for navigation buttons
        navLeft.addEventListener('click', prevSlide);
        navRight.addEventListener('click', nextSlide);

        // Event listener for window resize for responsiveness
        window.addEventListener('resize', updateSlider);

        // Initialize the slider
        updateSlider();
    });
}

// Modal functions and initialization
function initializeModals() {
    // Get the login modal
    const loginModal = document.getElementById("login-modal");

    // Get the register modal
    const registerModal = document.getElementById("register-modal");

    // Get the button that opens the modal
    const loginRegisterLink = document.getElementById("login-register-link");

    // Get the <span> element that closes the modal
    const closeButtons = document.querySelectorAll(".close");

    // Get the links to switch between login and register forms
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");


    // When the user clicks on the user icon, open the login modal
    // This part is now handled by the displayLoginRegister function

    // When the user clicks on <span> (x), close the modal
    closeButtons.forEach(function(closeButton) {
        closeButton.onclick = function() {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        }
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    }

    // When the user clicks on "Зарегистрироваться", show the register modal and hide the login modal
    showRegisterLink.onclick = function(event) {
        event.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    }

    // When the user clicks on "Войти", show the login modal and hide the register modal
    showLoginLink.onclick = function(event) {
        event.preventDefault();
        registerModal.style.display = "none";
        loginModal.style.display = "block";
    }

    // Handle login form submission (no database, using localStorage)
    document.getElementById("login-form").addEventListener('submit', function(event) {
                event.preventDefault();

                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                // Retrieve user data from localStorage
                const storedUserData = localStorage.getItem('user');

                if (storedUserData) {
                    const user = JSON.parse(storedUserData);

                    // Check if the entered email and password match the stored values
                    if (email === user.email && password === user.password) {
                        console.log("Login successful");
                        loginModal.style.display = "none";
                        // Optionally, store user info in sessionStorage
                        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                        // Redirect to the user's profile page or update the UI
                        updateUserArea(); // Update the user area on successful login
                        showNotification('Вы вошли в аккаунт.', 'success');
                    } else {
                        console.error("Login failed: Invalid credentials");
                        showNotification("Login failed: Invalid credentials", 'error');
                    }
                } else {
                    console.error("Login failed: User not found");
                    showNotification('Login failed: User not found', 'error');
                }
            });

            // Handle registration form submission (no database, using localStorage)
            document.getElementById("register-form").addEventListener('submit', function(event) {
                event.preventDefault();

                const newUsername = document.getElementById("new_username").value;
                const newEmail = document.getElementById("new_email").value;
                const newPassword = document.getElementById("new_password").value;

                // Store the data in localStorage
                const user = {
                    username: newUsername,
                    email: newEmail,
                    password: newPassword
                };

                localStorage.setItem('user', JSON.stringify(user));

                console.log("Registration successful");
                registerModal.style.display = "none";
                // Show the login modal
                loginModal.style.display = "block";
            });
        }

    AOS.init({
        duration: 1700,
        })
// Initialize all functionalities
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeModals();

});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust the offset if needed
                behavior: 'smooth'
            });
        }
    });
});
