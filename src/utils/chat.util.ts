import { ChatMessage } from '@/interfaces/chat.interface';
import React from 'react';
import { TimeUnits, getTime } from './time';

export function playSentMessageSound() {
  const tone = new Audio('/sounds/uggg_sent_message.mp3');
  tone.play();
}
export function playReceiveMessageSound() {
  const tone = new Audio('/sounds/chat_alart.mp3');
  tone.play();
}
export function voiceMemoTimer(setState: React.Dispatch<string>) {
  let counter = 0;
  let minites = 0;
  const interval = setInterval(() => {
    console.log('run');
    counter++;
    if (counter > 59) {
      minites++;
      counter = 0;
    }
    counter < 10 ? setState(`0${minites}:0${counter}`) : setState(`0${minites}:${counter}`);
  }, 1000);
  return interval;
}
// group messages by date
export function groupChatMessagesByDate(chatMessages: ChatMessage[], local: never) {
  if (!chatMessages) return;
  // edit chat messages date
  const chatMessagesEditedDate = chatMessages?.map((msg) => {
    return {
      ...msg,
      date: getTime(msg.date, TimeUnits.date, local) as string,
    };
  });
  // get all uniqe date
  const uniqesDate = Array.from(new Set(chatMessagesEditedDate.map(({ date }) => date)));
  // messages groubed by date
  const messagesGroupedByDate = new Map();
  uniqesDate.map((d) => {
    const messages: ChatMessage[] = [];
    chatMessagesEditedDate.forEach((msg, i) => {
      if (msg.date !== d) return;
      messages.push(chatMessages[i]);
    });
    messagesGroupedByDate.set(d, messages);
  });

  return { dates: Array.from(messagesGroupedByDate.keys()), messages: Array.from(messagesGroupedByDate.values()) };
}
// shrink message
export function shrinkMsg(msg: string) {
  return `${msg.split(' ').slice(0, 6).join(' ')} ...`;
}
