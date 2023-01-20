const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".message-container");

let Name;
do {
  Name = prompt("Enter your Name to join the Chat");
} while (!Name);
socket.emit("new-user-joined", Name);
const append = (message, positon) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(positon);
    messageContainer.append(messageElement);
    messageContainer.lastChild.scrollIntoView({ behavior: "smooth" });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
socket.on("user-joined", (Name) => {
  append(`${Name} Joined the Chat`, "middle");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} Left the Chat`, "middle");
});
