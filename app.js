listarPessoas();

let inputNome = document.querySelector("#inputNome")
let inputDNas = document.querySelector("#inputDtnasc")
let inputTrel = document.querySelector("#inputTiporel")
let addButton = document.querySelector("#btnSalvarNova")
   
// Ao clicar no botão Salvar
addButton.addEventListener('click', function () {
    criarPessoa(inputNome.value, inputDNas.value, inputTrel.value);

});

// Função para criar um registro no Firebase
function criarPessoa (inputNome, inputDNas, inputTrel) {

    let data = {
        nome:    inputNome,
        dtnasc:  inputDNas,
        tiporel: inputTrel,
        pontos:  0
    };

    // Incluir nova Pessoa na Realtime database do Firebase
    
    return dbRef.child(`pessoas/${userUid}`).push(data);
    //return pessoaRef.push(data);
}


function listarPessoas() {
    const userListUI = document.getElementById("lista-pessoas");

    pessoaRef.on("value", snap => {
        userListUI.innerHTML = ""

        snap.forEach(childSnap => {
            let userKey = childSnap.key
            //console.log(userKey)
            if (userKey === userUid) {
                let relPerson = childSnap.val()
                
                // loop para listar todas as pessoas ref. somente ao user logado.
                for (let chave in relPerson){
                    let dados = relPerson[chave]

                    let $li = document.createElement("tr");

                    // edit icon
                    let editIconUI = document.createElement("td");
                    editIconUI.innerHTML = ' <a class="link" data-bs-whatever="'+ dados.nome + '|' 
                                        + chave + '" data-bs-toggle="modal" data-bs-target="#editModal"> ✎ </a>';  

                    // delete icon
                    let deleteIconUI = document.createElement("td");
                    deleteIconUI.innerHTML = '<i class="material-icons btnDel">&#xE872;</i>';
                    deleteIconUI.setAttribute("pid", chave);
                    deleteIconUI.addEventListener("click", deleteButtonClicked)

                    let pontosLinkUI = document.createElement("span");
                    pontosLinkUI.innerHTML  = 
                    '<td><a class="link" data-bs-whatever="'+ dados.nome + '|' + chave +
                    '" data-bs-toggle="modal" data-bs-target="#pontosModal" >'+ parseInt (dados.pontos) + "</a></td>"
                    pontosLinkUI.setAttribute("pid", chave);

                    $li.innerHTML =       "<td>" + dados.nome    + "</td>" +
                                        "<td>" + dados.dtnasc  + "</td>" +
                                        "<td>" + descreverRel(dados.tiporel) + "</td>" ;
                    
                    $li.append(pontosLinkUI);
                    $li.append(editIconUI);
                    $li.append(deleteIconUI);

                    userListUI.append($li);
                }
            }
        });
    })

};

function deleteButtonClicked(e){
    e.stopPropagation();

    let userID = e.target.getAttribute("pid");
    let pIdRef = dbRef.child('pessoas/' + userID);
    
    console.log(userID)

    pIdRef = dbRef.child(`pessoas/${userUid}/` + userID)
    pIdRef.remove();
}

let pontosModal = document.querySelector("#pontosModal")

pontosModal.addEventListener('show.bs.modal', function(event){
    let modalEv = event.relatedTarget
    let dados = modalEv.getAttribute('data-bs-whatever')
    let dadosPessoa = dados.split("|")

    pontosModal.querySelector(".modal-title").textContent = dadosPessoa[0]
    pontosModal.querySelector("#chavePessoa").value = dadosPessoa[1]
})


let btnSalvarPontos = document.querySelector("#btnSalvarPontos")

btnSalvarPontos.addEventListener('click', function(){
    let totalRange = document.querySelectorAll(".pontos")
    let totalPontos = 0

    for (let i=0, len=totalRange.length; i<len;i++){
        totalPontos += parseInt(totalRange[i].value)
    }

    let userID = pontosModal.querySelector('#chavePessoa').value
    const pIdRef = dbRef.child(`pessoas/${userUid}/` + userID)
        
    // atualizar pontos da pessoa.
    pIdRef.update( {pontos: totalPontos})
})

function descreverRel(tiporel) {
    switch (parseInt(tiporel) ) {
        case 1 : rel= "Conjuge"; break;
        case 2 : rel= "Companheiro(a)"; break;
        case 3 : rel= "Namorado(a)"; break;
        case 4 : rel= "Pai"; break;
        case 5 : rel= "Mãe"; break;
        case 6 : rel= "Filho(a)"; break;
        case 7 : rel= "Amigo(a)"; break;
        case 8 : rel= "Tio(a)"; break;
        case 9 : rel= "Irmãos"; break;
        case 10: rel= "Avós"; break;
        case 11: rel= "Outros"; break;
        default: rel= "Outros";
    }
    return rel;
}

// --------------------------
// EDIT
// --------------------------
let editModal = document.getElementById('editModal')

editModal.addEventListener('show.bs.modal', function (event) {

    //set user id to the hidden input field
    //document.querySelector(".edit-userid").value = e.target.getAttribute("pid");
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes

    var recipient = button.getAttribute('data-bs-whatever')
    var dadosPessoa = recipient.split("|")
    // Update the modal's content.
    const pIdRef = dbRef.child(`pessoas/${userUid}/` + dadosPessoa[1]);

    // set data to the user field
    pIdRef.on("value", snap => {
        dados = snap.val();
        editModal.title = "Editar " + dados.nome;
        document.querySelector("#inputDtnascE").value = dados.dtnasc;
        document.querySelector("#inputNomeE").value = dados.nome;
        document.querySelector("#inputTiporelE").value = dados.tiporel;
        document.querySelector("#chavePessoaE").value = dadosPessoa[1];
    });

    const saveBtn = document.querySelector("#btnSalvarEdit");
    saveBtn.addEventListener("click", saveUserBtnClicked)
})


function saveUserBtnClicked() {
    const pID = document.querySelector("#chavePessoaE").value;
    const pIdRef = dbRef.child(`pessoas/${userUid}/` + pID)

    let edtnasc = document.querySelector("#inputDtnascE").value ;
    let enome = document.querySelector("#inputNomeE").value ;
    let etiporel = document.querySelector("#inputTiporelE").value;

    let editDados = {
        nome:    enome,
        dtnasc:  edtnasc,
        tiporel: etiporel,
    };

    pIdRef.update(editDados);
}
