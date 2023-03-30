
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
    return pessoaRef.push(data);
}


function listarPessoas() {
    const userListUI = document.getElementById("lista-pessoas");

    pessoaRef.on("value", snap => {

        userListUI.innerHTML = ""

        snap.forEach(childSnap => {

            let chave = childSnap.key,
                dados = childSnap.val()
            
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
                                  "<td>" + dados.tiporel + "</td>" ;
            
            $li.append(pontosLinkUI);
            $li.append(editIconUI);
            $li.append(deleteIconUI);

            userListUI.append($li);

        });
    })

};

function deleteButtonClicked(e){
    e.stopPropagation();

    let userID = e.target.getAttribute("pid");
    const pIdRef = dbRef.child('pessoas/' + userID);
    
    pIdRef.remove();
}

let pontosModal = document.querySelector("#pontosModal")

pontosModal.addEventListener('show.bs.modal', function(event){
    let modalEv = event.relatedTarget
    let dados = modalEv.getAttribute('data-bs-whatever')
    let dadosPessoa = dados.split("|")

    pontosModal.querySelector(".modal-title").textContent = dadosPessoa[0]
    pontosModal.querySelector("#chavePessoa").textContent = dadosPessoa[1]
})


let btnSalvarPontos = document.querySelector("#btnSalvarPontos")

btnSalvarPontos.addEventListener('click', function(){
    let totalRange = document.querySelectorAll(".pontos")
    let totalPontos = 0

    for (let i=0, len=totalRange.length; i<len;i++){
        totalPontos += parseInt(totalRange[i].value)
    }

    alert(totalPontos)

})
