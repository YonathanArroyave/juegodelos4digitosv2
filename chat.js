const db = firebase.database();
const chatRef = db.ref('chat');

function sendMessage() {
    const message = document.getElementById('message').value;
    chatRef.push().set({
        email: firebase.auth().currentUser.email,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    document.getElementById('message').value = '';
}

chatRef.on('child_added', snapshot => {
    const messageData = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${messageData.email}: ${messageData.message}`;
    document.getElementById('messages').appendChild(messageElement);
});
