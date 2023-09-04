// import React from 'react'
// import { useState } from 'react';

const VoiceMemoRecorder = () => {
    // audio blobs
    let audioBlobs: Blob[] = [];
    // media recorder instance
    let mediaRecorder: MediaRecorder | null =  null;
    // stream being captured
    let streamBeingCaptured: MediaStream | null = null;
    // // start recorder voice method
    const start = async () => {
        // check for MediaDevices API, and getUserMedia Support
        if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){return Promise.reject(new Error('Not Supp'));}
        // return stream
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        // save a refrence to the current stream
        streamBeingCaptured = stream;
        // create MediaRecorder Instance
        mediaRecorder = new MediaRecorder(stream);
        // clear previously saved audio blobs
        audioBlobs = [];
        // listen to dataavailble event to store recorded audio blobs
        mediaRecorder?.addEventListener('dataavailable', e => audioBlobs.push(e.data));
        // start recording
        mediaRecorder?.start();
        return stream;
    };
    // // stop recordeing voice method
    const stop = () => {
        return new Promise(resolve => {
            // save the audio type
            const mimeType = mediaRecorder?.mimeType;
            // listen to the stop event
            mediaRecorder?.addEventListener('stop', () => {
                console.log(mimeType);
                // create audio blob
                const audioBlob = new Blob(audioBlobs, {type: mimeType});
                resolve(audioBlob);
            });
            // stop the recording
            mediaRecorder?.stop();
            // stop the stream
            streamBeingCaptured?.getTracks().forEach(track => track.stop());
            // reset stream being captured
            streamBeingCaptured = null;
            // reset media recorder
            mediaRecorder = null;
        });
    };
    // // cancel the process of recordeing voice method
    const cancel = () => {
        //stop the recording feature
        mediaRecorder?.stop();
        // stop the stream
        streamBeingCaptured?.getTracks().forEach(track => track.stop());
        // reset stream being captured
        streamBeingCaptured = null;
        // reset media recorder
        mediaRecorder = null;
    };
    return {start, stop, cancel};
};

export default VoiceMemoRecorder;