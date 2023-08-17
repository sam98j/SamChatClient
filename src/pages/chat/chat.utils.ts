export function playSentMessageSound(){
    const tone = new Audio("/sounds/uggg_sent_message.mp3");
    tone.play()
}

export function playReceiveMessageSound(){
    const tone = new Audio("/sounds/chat_alart.mp3");
    tone.play()
}