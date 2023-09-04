export const secondsToDurationConverter = (sec: number) => {
    const minites = sec >= 60 ? String(Math.floor(sec / 60)) : '00';
    let seconds = sec >= 60 ? String(Math.floor(sec % 60)) : sec;
    Number(seconds) < 10 ? seconds = `0${seconds}`: '';
    return `${minites}:${seconds}`;
};