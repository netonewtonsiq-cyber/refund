//Seleciona elementos do formulario

const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")


//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

amount.oninput = () => {   //observa quando entra conteudo no input
    let value = amount.value.replace(/\D/g,"") //substitui todas as letras por nada

    //Transforma o valor em centavos
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)   //entao pega o valor substituido acima, e joga ele no campo do amount
}  

function formatCurrencyBRL(value) {  //Função para formatar o valor em R$
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

//Captura os elementos onsubmit
form.onsubmit = (event) => {
    event.preventDefault() //evita que quando clicar no botao, recarregue os inputs e limpe-os

    const newExpense = {   //Cria um objeto com detalhes das despesas
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    expenseAdd(newExpense)
}

//função para adicionar os itens na lista
function expenseAdd(newExpense){
    try {
        //Cria o elemento para add o item (li) na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //Adiciona nome e categoria na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        //Cria o Valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`
        
        //Cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")
        
        
        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista
        expenseList.append(expenseItem)

        formClear() //Limpa os campos após adicionado uma despesa

        //Atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

//Função que atualiza os totais
function updateTotals(){
    try {
        //Recupera todos os itens (LI) da listaa (UL)
        const items = expenseList.children

        //Atualiza a qtde de itens da lista
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //Variavel que incrementa o total
        let total = 0

        //FOr para percorrer cada item li da lista ul
        for(item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            //Converte o valor para float
            value = parseFloat(value)

            //Verifica se é um numero valido
            if(isNaN(value)){
                return alert("Não foi possivel calcular. O numero nao é um numero valido")
            }

            //Incrementar o valor total
            total += Number(value)

        }

        //Criar a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$ que será exibido pela small com estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //limpa conteudo do elemento 
        expensesTotal.innerHTML = ""

        //Adiciona o simbolo e o valor total formatado
        expensesTotal.append(symbolBRL, total)

        

    } catch (error) {
        console.log(error)
        alert("Não possivel atualizar o total")
        
    }
}

//Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
    //Verifica se o elemento clicado é o icone de remover
if(event.target.classList.contains("remove-icon")){
    //Obter a li pai do elemento clicado
    const item = event.target.closest(".expense")
    item.remove()  //remove o item da lista

}

updateTotals()


})


//Função que limpa depois do item adicionado

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
}