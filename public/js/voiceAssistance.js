document.getElementById('recordButton').addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        document.getElementById('result').textContent = `Command: ${command}`;

        fetch('/api/voice-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command }),
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('result').textContent = data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    recognition.onerror = (event) => {
        document.getElementById('result').textContent = `Error: ${event.error}`;
    };
});
