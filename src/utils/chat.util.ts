import React from 'react';

export function playSentMessageSound(){
    const tone = new Audio('/sounds/uggg_sent_message.mp3');
    tone.play();
}
export function playReceiveMessageSound(){
    const tone = new Audio('/sounds/chat_alart.mp3');
    tone.play();
}

export function voiceMemoTimer(setState: React.Dispatch<string>){
    let counter = 0;
    let minites = 0;
    const interval = setInterval(() => {
        console.log('run');
        counter++;
        if(counter > 59) {minites++; counter = 0;}
        counter < 10 ? setState(`0${minites}:0${counter}`) : setState(`0${minites}:${counter}`);
    }, 1000);
    return interval;
}