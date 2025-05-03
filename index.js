function toggleChatbot() {
  const chatbot = document.getElementById('chatbot-container');
  const messages = document.getElementById("messages");
  const toggleIcon = document.getElementById("chatbot-toggle");

  const isOpening = chatbot.style.display !== 'block';
  chatbot.style.display = isOpening ? 'block' : 'none';
  toggleIcon.style.display = isOpening ? 'none' : 'block';

  if (isOpening && messages.childElementCount === 0) {
    const welcomeMessage = document.createElement("p");
    welcomeMessage.innerHTML = `
      <strong class='bot'>Bot:</strong> Olá! 👋
      <br><br>
      Eu sou o <strong>ChatBot FURIA</strong>! 😎
      <br><br>
      Para começar, basta digitar um dos comandos abaixo para interagir com a gente:
      <br><br>
      <strong>Comandos Disponíveis:</strong>
      <ul>
        <li><code>!cs2</code> - Veja os jogos do time FURIA no <strong>CS:GO</strong></li>
        <li><code>!lol</code> - Acompanhe as partidas de <strong>League of Legends</strong></li>
        <li><code>!valorant</code> - Fique por dentro dos jogos de <strong>Valorant</strong></li>
        <li><code>!rocket</code> - Informações sobre o time de <strong>Rocket League</strong></li>
        <li><code>!kings</code> - Acompanhe o <strong>time Kings</strong> da FURIA</li>
      </ul>
      <br><br>
      Estou pronto para te ajudar! Digite um comando e vamos nessa! 🚀
    `;
    messages.appendChild(welcomeMessage);
  }


}


async function sendMessage() {
  const input = document.getElementById("user-input");
  const messages = document.getElementById("messages");

  const text = input.value.trim();
  if (text === "") return;

  const userMessage = document.createElement("p");
  userMessage.innerHTML = "<strong class='user'>Você:</strong> " + text;
  messages.appendChild(userMessage);

  const botMessage = document.createElement("p");

  const command = text.toLowerCase();
  const gamesData = await fetchGamesData();

  if (command === "!cs2") {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> " + gamesCs2(gamesData.cs2);
  } else if (command === "!lol") {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> " + gamesLol(gamesData.lol);
  } else if (command === "!valorant") {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> " + gamesValorant(gamesData.valorant);
  } else if (command === "!rocket") {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> " + gamesRocket(gamesData.rocket);
  } else if (command === "!kings") {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> " + gamesKings(gamesData.kings);
  } else {
    botMessage.innerHTML = "<strong class='bot'>Bot:</strong> Não reconheci esse comando. Tente os comandos:<br> <code>!cs2</code><br> <code>!lol</code><br> <code>!valorant</code><br> <code>!rocket</code><br> ou <code>!kings</code>";
  }

  messages.appendChild(botMessage);
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}

function gamesCs2(data) {
  if (data.sem_partidas_agendadas) return "Atualmente, a FURIA não possui partidas agendadas no CS2.";
  const jogos = data.últimos_jogos.map(jogo => `${jogo.data}: ${jogo.resultado}`).join("<br>• ");
  return `Últimos jogos:<br>• ${jogos}`;
}

function gamesLol(data) {
  const jogos = data.últimos_jogos.map(jogo => `${jogo.data}: ${jogo.resultado}`).join("<br>• ");
  const proximo = data.próximo_jogo ? `<br>Próximo jogo:<br>• ${data.próximo_jogo}` : "";
  return `Últimos jogos no CBLOL:<br>• ${jogos}${proximo}`;
}

function gamesValorant(data) {
  if (data.sem_partidas_agendadas) return "No momento não há partidas agendadas para Valorant.";
  const jogos = data.últimos_jogos.map(jogo => `${jogo.data}: ${jogo.resultado}`).join("<br>• ");
  return `Últimos jogos:<br>• ${jogos}`;
}

function gamesRocket(data) {
  if (data.sem_partidas_agendadas) return "No momento não há partidas agendadas para Rocket League.";
  const jogos = data.últimos_jogos.map(jogo => `${jogo.data}: ${jogo.resultado}`).join("<br>• ");
  return `Últimos jogos:<br>• ${jogos}`;
}

function gamesKings(data) {
  if (data.sem_partidas_agendadas) return "No momento não há partidas agendadas para a Kings League.";
  const jogos = data.últimos_jogos.map(jogo => `${jogo.data}: ${jogo.resultado}`).join("<br>• ");
  return `Últimos jogos:<br>• ${jogos}`;
}

async function fetchGamesData() {
  const response = await fetch('/games.json');
  const data = await response.json();
  return data;
}

document.getElementById('user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    sendMessage(); 
  }
});