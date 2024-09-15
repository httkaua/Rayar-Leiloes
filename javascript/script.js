let acc_nick = 'kusco'; // nick do usuário

let initialBidValue = document.getElementById('initialBidValue').textContent; // Valor mínimo de lance inicial
initialBidValue = initialBidValue.replace("R$ ","");
initialBidValue = initialBidValue.replace(",",".");
initialBidValue = parseFloat(initialBidValue);

const bids = []; // array de lances do leilão
let top_10_bids = [
    {nick: "defAccount",
        bid_value: initialBidValue,
        year: new Date().getFullYear().toString(),
        month: new Date().getMonth().toString(),
        day: new Date().getDate().toString(),
        hours: new Date().getHours().toString(),
        minutes: new Date().getMinutes().toString(),
        seconds: new Date().getSeconds().toString(),
        timeIso: new Date().toISOString()
    }
]; // lance padrão para não deixar a array vazia

const DaySet = 0.0001; // Tempo do cronômetro em dias

// Momento do fim do leilão
const TimeFromNow = new Date().getTime() + (DaySet * 24 * 3600 * 1000);

// Status do leilão, 'Em aberto' ou 'Encerrado'
let stopwatch_status = document.getElementById('stopwatch_status');
stopwatch_status.textContent = "Em aberto"

// Botão 'Dar lance'
const darlance = document.getElementById('bid_amount')

// Anunciar vencedor do leilão, quando encerrado
function winner() {
    const winner_nick = bids_table.rows[1].cells[0].textContent;
    const winner_bid = bids_table.rows[1].cells[1].textContent;
    const overlay = document.getElementById('overlay');
    const contWinner = document.getElementById('contWinner');
    const WindowWinnerNick = document.getElementById('WindowWinnerNick');
    const WindowWinnerBid = document.getElementById('WindowWinnerBid');
    const winner_button = document.getElementById('winner_button');
    const xButton = document.getElementById('xButton');

    // exibir na tela a janela
    overlay.style.display = 'block'
    contWinner.style.display = 'block'

    // se o leilão não tiver nenhum lance, encerre com uma janela de aviso, senão, parabenize o vencedor
    if (winner_bid == "") {
        WindowWinnerNick.innerHTML = `Leilão encerrado sem arremates`;
        WindowWinnerBid.innerHTML = ``;
    } else {
        WindowWinnerNick.innerHTML = `O vencedor deste leilão é ${winner_nick}, parabéns!`;
        WindowWinnerBid.innerHTML = `Arremate final: ${winner_bid}`;
    }

    // fechar a janela ao clicar em um botão
    winner_button.addEventListener("click", event => {
        contWinner.style.display = 'none'
        overlay.style.display = 'none'
    });

    // fechar a janela ao clicar em um botão
    xButton.addEventListener("click", event => {
        contWinner.style.display = 'none'
        overlay.style.display = 'none'
    });

};

// Cronômetro
function countdown() {
    let interval = setInterval(() => {

        // Elementos HTML do cronômetro
        let stopwatch_hours = document.getElementById('stopwatch_hours');
        let stopwatch_minutes = document.getElementById('stopwatch_minutes');
        let stopwatch_seconds = document.getElementById('stopwatch_seconds');

        // tempo atual em milissegundos
        
        const currentDate = new Date().getTime();

        // contar segundos restantes até o fim do leilão
        let totalSeconds = Math.floor((TimeFromNow - currentDate) / 1000);

        // verificar se o tempo acabou
        if (totalSeconds <= 0) {
            clearInterval(interval) // interromper execução setInterval
            stopwatch_hours.innerHTML = '00';
            stopwatch_minutes.innerHTML = '00';
            stopwatch_seconds.innerHTML = '00';
            stopwatch_status.innerHTML = 'Encerrado';

            winner();
            return;
        }

        // Converter para horas, minutos e segundos restantes
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        // Atualizar o HTML com os valores formatados, chamando a função formatZero()
        stopwatch_hours.innerHTML = formatZero(hours);
        stopwatch_minutes.innerHTML = formatZero(minutes);
        stopwatch_seconds.innerHTML = formatZero(seconds);
        
    }, 1000);
};

countdown();

// Função para formatar o tempo com zero à esquerda, se necessário
function formatZero(value) {
    return value < 10 ? '0' + value : value;
}

// Separar os 10 maiores lances
function top10() {

        // caso contenha o lance padrão, excluir.
        if (top_10_bids.length > 0) {
            try {
                const accountDefaultIndex = top_10_bids.findIndex(top_10_bids => top_10_bids.nick === "defAccount");
                if (accountDefaultIndex !== -1) {
                    top_10_bids.splice(index, accountDefaultIndex);
                }
            } catch (error) {
                
            };
        };
        
        top_10_bids = bids.sort((a, b) => b.bid_value - a.bid_value); // ordem decrescente
        top_10_bids = top_10_bids.slice(0, 10); // separar top 10
        return top_10_bids;
        
};

// 'Dar lance'
darlance.addEventListener("click", event => {

    top10();

    let bid_input = document.getElementById('bid_input').value;
    bid_input = parseFloat(bid_input);
    const returnNewBid = document.getElementById('returnNewBid');

    let bidValues = bids.map(bids => bids.bid_value);
    let biggestBid = parseFloat(Math.max(...bidValues));

    // subtração (usada para verificar se o lance a ser feito é maior)
    const minus = bid_input - biggestBid;

    // se o leilão já foi encerrado
    if (stopwatch_status.textContent !== 'Em aberto') {
        returnNewBid.innerHTML = 'Infelizmente, este leilão já foi encerrado.';
        return;
    }

    // Se campos vazios
    if (!bid_input || !acc_nick) {
        returnNewBid.innerHTML = 'Insira o valor do seu lance!';
        return;
    }

    // Se não numérico
    if (isNaN(bid_input)) {
        returnNewBid.innerHTML = 'Insira apenas números!';
        return;
    }

    // se o lance for menor ou igual a um já feito
    if (bid_input <= biggestBid) {
        biggestBid = biggestBid.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
            });
        returnNewBid.innerHTML = 'Faça um lance maior! Atual: ' + biggestBid;
        return;
    }

    // se o lance for menor que o valor inicial
    if (bid_input <= initialBidValue) {
         returnNewBid.innerHTML = 'Valor abaixo do mínimo: ' + initialBidValue;
        return;
    }

    // registrar lance
    else {
        const today = new Date();
        const bid_year = today.getFullYear().toString(); //toString() para evitar problemas de conversão
        const bid_month = today.getMonth().toString();
        const bid_day = today.getDate().toString();
        const bid_hours = today.getHours().toString();
        const bid_minutes = today.getMinutes().toString();
        const bid_seconds = today.getSeconds().toString();
        const timeIso = today.toISOString();
    
        // objeto com os dados do lance feito
        const new_bid = {nick: acc_nick,
            bid_value: bid_input,
            year: bid_year,
            month: bid_month,
            day: bid_day,
            hours: bid_hours,
            minutes: bid_minutes,
            seconds: bid_seconds,
            timeIso: timeIso
        };
        
        // incluir na array de lances
        bids.push(new_bid);

        // chamando funções auxiliares
        top10();
        clean_submit();
        update_bids_table();
    };
});

// limpar campo submit
function clean_submit() {
    let bid_input = document.getElementById('bid_input');
    bid_input.value = '';
    const returnNewBid = document.getElementById('returnNewBid');
    returnNewBid.innerHTML = '';
};

// inserir dados na tabela de lances
function update_bids_table() {

    // tabela HTML
    const bids_table = document.getElementById('bids_table');

    // alimentar cada linha (exceto cabeçalho) da tabela HTML
    for(let i = 1; i < top_10_bids.length + 1; i++) {

        // células da tabela
        const table_nick = bids_table.rows[i].cells[0] // nick
        const table_value = bids_table.rows[i].cells[1] // valor do lance
        const table_date = bids_table.rows[i].cells[2] // data
        const table_hour = bids_table.rows[i].cells[3] // hora

        // Formatação de moeda
        let bidFormat = top_10_bids[i-1].bid_value;
        bidFormat = bidFormat.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        });

        // Tempo em formato ISO
        const bidDateHourStr = top_10_bids[i-1].timeIso;
        const bidDateHour = new Date(bidDateHourStr);

        // Data
        const day = String(bidDateHour.getDate()).padStart(2, '0');
        const month = String(bidDateHour.getMonth() + 1).padStart(2, '0');
        const year = bidDateHour.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Horário
        let timeToTable = bidDateHour.toString();
        timeToTable = timeToTable.split(' ')[4];

        // Inserção na tabela
        table_nick.innerHTML = top_10_bids[i-1].nick;
        table_value.innerHTML = bidFormat;
        table_date.innerHTML = formattedDate;
        table_hour.innerHTML = timeToTable;
    };
};

// PENDENTE: Inserir If Else em Winner() quando vazio, estilizar janela suspensa a exibir vencedor