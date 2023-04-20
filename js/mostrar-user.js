firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let displayName = document.getElementById('displayName');
        
        const idisplayName = user.displayName;
        const email = user.email;
              
        if (idisplayName !== null) displayName.innerText = 'Logado: ' + idisplayName
        else                       displayName.innerText = 'Logado: ' + email
        
        // User is signed in.
    } 
  });

