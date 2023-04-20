// Buttons
let authEmailPassButton = document.getElementById('authEmailPassButton');
let authFacebookButton = document.getElementById('authFacebookButton');
let authTwitterButton = document.getElementById('authTwitterButton');
let authGoogleButton = document.getElementById('authGoogleButton');
let authGitHubButton = document.getElementById('authGitHubButton');
let authAnonymouslyButton = document.getElementById('authAnonymouslyButton');
let createUserButton = document.getElementById('createUserButton');
let logOutButton = document.getElementById('logOutButton');

// Inputs
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');

// Displays
let displayName = document.getElementById('displayName');

// Criar novo usuário
createUserButton.addEventListener('click', function () {
    firebase
        .auth()
        .createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function () {
            alert('Bem vindo ' + emailInput.value);
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

// Autenticar com E-mail e Senha
authEmailPassButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function (result) {
            console.log(result);
            //displayName.innerText = 'Bem vindo, ' + emailInput.value;
            //alert('Autenticado ' + emailInput.value);
            window.location.pathname = "/lista.html"

        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

// Logout
logOutButton.addEventListener('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            displayName.innerText = 'Você não está autenticado';
            alert('Você se deslogou');
            validSession = false;
        }, function (error) {
            console.error(error);
        });
});

// Autenticar Anônimo
authAnonymouslyButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInAnonymously()
        .then(function (result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, desconhecido';
            alert('Autenticado Anonimamente');
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

// Autenticar com GitHub
authGitHubButton.addEventListener('click', function () {
    // Providers
    let provider = new firebase.auth.GithubAuthProvider();
    signIn(provider);
});

// Autenticar com Google
authGoogleButton.addEventListener('click', function () {
    // Providers
    let provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
});

// Autenticar com Facebook
authFacebookButton.addEventListener('click', function () {
    // Providers
    let provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
});

// Autenticar com Twitter
authTwitterButton.addEventListener('click', function () {
    // Providers
    let provider = new firebase.auth.TwitterAuthProvider();
    signIn(provider);
});

function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (result) {
            console.log(result);
            let token = result.credential.accessToken;
            displayName.innerText = 'Bem vindo, ' + result.user.displayName;
            window.location.pathname = "/lista.html"
        }).catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
        });
}

