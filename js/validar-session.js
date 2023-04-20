
let userUid
let logOutButton = document.getElementById('logOutButton');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        // Pegar id do usuario logado e buscar os dados no realtime database do firebase
        userUid = user.uid

        const idisplayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;

        let displayName = document.getElementById('displayName');
        let imageUser = document.querySelector("#imagemUser")
                      
        if (idisplayName !== null) displayName.innerText =  idisplayName
        else                       displayName.innerText =  email
        
        if (photoURL !== null)  imageUser.innerHTML = "<img src='"+ photoURL +"' >"
        else imageUser.innerHTML = '<button class="btn btn-lg btn-warning"><i class="fa fa-user "></i></button>'

        // User is signed in.
    } else {
        //alert(" você precisa se autenticar para acessar essa página" );
        window.location.replace("index.html");
        
        // usuario nao esta logado..
    }
});

// Logout
logOutButton.addEventListener('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            displayName.innerText = 'Você não está autenticado';
            validSession = false;
        }, function (error) {
            console.error(error);
        });
});
