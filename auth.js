const auth = firebase.auth();

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            document.getElementById('login').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('user-email').textContent = userCredential.user.email;
            document.getElementById('game').style.display = 'block';
        })
        .catch(error => {
            console.error("Error logging in:", error);
        });
}

function logout() {
    auth.signOut().then(() => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('game').style.display = 'none';
    }).catch(error => {
        console.error("Error logging out:", error);
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('game').style.display = 'block';
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('game').style.display = 'none';
    }
});
