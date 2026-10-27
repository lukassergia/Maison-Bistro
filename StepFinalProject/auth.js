// Supabase project settings
const SUPABASE_URL = "https://tvjqsmdpeovgoghoshfc.supabase.co";
const SUPABASE_KEY = "sb_publishable_4p9xh5uCf6pLCEd4lHUSpw_giuwLvIl";

// Create the Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


function updateNavbar(session) {
    const loginLink = document.getElementById("loginLink");
    const userGreeting = document.getElementById("userGreeting");
    const logoutButton = document.getElementById("logoutButton");

    const user = session?.user;

    if (loginLink) {
        loginLink.hidden = !!user;
    }

    if (userGreeting) {
        userGreeting.hidden = !user;
        userGreeting.textContent = user
            ? `Hi, ${user.user_metadata?.full_name || user.email.split("@")[0]}`
            : "";
    }

    if (logoutButton) {
        logoutButton.hidden = !user;
    }
}

async function initNavbar() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error.message);
        return;
    }

    updateNavbar(data.session);
}

initNavbar();

supabaseClient.auth.onAuthStateChange((event, session) => {
    updateNavbar(session);
});

document.getElementById("logoutButton")?.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error(error.message);
        return;
    }

    window.location.href = "index.html";
});