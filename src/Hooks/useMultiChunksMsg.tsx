import { ChatMessage } from '@/interfaces/chat.interface';
import { chunkFile } from '@/utils/files';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

// multiChunksMsgStatus Interface
interface MultiChunksMsgStatus {
  isFirstChunk: boolean | null;
  delevered: boolean | null;
}

const useMultiChunksMsg = (socket: Socket) => {
  // mulitChunksMessage
  const [mulitChunksMessage, setMulitChunksMessage] = useState<ChatMessage | null>(null);
  // multi chunks status
  const [multiChunksMsgStatus, setMultiChunksMsgStatus] = useState<MultiChunksMsgStatus>({
    isFirstChunk: true,
    delevered: null,
  });
  // multiChunks
  const [chunks, setChunks] = useState<null | string[]>(null);
  // chunk index
  const [chunkIndex, setChunkIndex] = useState<number>(0);
  // send multi chunks msg
  const sendMuliChunksMsg = (message: ChatMessage) => {
    // set message to send
    setMulitChunksMessage(message);
    // make chunks from message content
    const messageContentChunks = chunkFile(message.content);
    // set chunks
    setChunks(messageContentChunks);
  };
  // listen for file chunks
  useEffect(() => {
    // if there is no chunks
    if (!chunks) return;
    // is it last chunk
    const isLastChunk = chunkIndex === chunks.length - 1;
    // terminate after last chunk
    if (chunkIndex > chunks.length - 1) return;
    // multi chunks status
    const { delevered, isFirstChunk } = multiChunksMsgStatus;
    // termenate if chunk is not delivered
    if (delevered === false) return;
    // if delevered is null and it's first chunk (run onley at first chunk)
    if (delevered === null && isFirstChunk) {
      console.log('first chunk', chunks[chunkIndex]);
      // termenate if no socket
      if (!socket) return;
      // create message with single chunk
      const message = { ...mulitChunksMessage, content: chunks[chunkIndex] } as ChatMessage;
      // fire an socket event
      socket.emit('multi_chunks_message', { data: message, isLastChunk });
      // set current chunk index
      setChunkIndex(chunkIndex + 1);
      return;
    }
    // if delevered is null
    if (delevered === null || isFirstChunk || !mulitChunksMessage) return;
    console.log('not first', chunks[chunkIndex]);
    // termenate if no socket
    if (!socket) return;
    // create message with single chunk
    const message = { ...mulitChunksMessage, content: chunks[chunkIndex] } as ChatMessage;
    // fire an socket event
    socket.emit('multi_chunks_message', { data: message, isLastChunk });
    // dispatch(setMultiChunksMsgStatus({ delevered: null, isFirstChunk: false }));
    setChunkIndex(chunkIndex + 1);
  }, [chunks, multiChunksMsgStatus]);
  // listen for chunk delevery res
  useEffect(() => {
    // terminate if no socket
    if (!socket) return;
    // chunk delevered handler
    const chunkRecievedHandler = () => {
      console.log('chunk delevired');
      setMultiChunksMsgStatus({ delevered: true, isFirstChunk: false });
    };
    // on chunk of multi chunks message received
    socket?.on('chunk_recieved', chunkRecievedHandler);
  }, [socket]);
  return { sendMuliChunksMsg };
};

export default useMultiChunksMsg;
