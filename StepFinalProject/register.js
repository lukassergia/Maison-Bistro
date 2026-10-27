const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    registerMessage.textContent = "Creating your account...";

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) {
            throw error;
        }

        if (data.session) {
            registerMessage.textContent = "Account created successfully!";
            window.location.href = "menu.html";
        } else {
            registerMessage.textContent =
                "Account created! Check your email to confirm your account.";
        }

    } catch (error) {
        registerMessage.textContent = error.message;
    }
});