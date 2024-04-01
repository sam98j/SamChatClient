export function chunkFile(file: string) {
  // file chunks
  const chunks = [];
  // chunk size
  const chunkSize = 972800;
  // start
  let start = 0;
  // file Reader
  // read as data url
  // loop throw the file
  while (start < file.length) {
    const end = Math.min(start + chunkSize, file.length);
    // chunk the file
    const chunk = file.slice(start, end);
    chunks.push(chunk);
    start += chunkSize;
  }
  return chunks;
}
// get file size
export function getFileSize(dataUrl: string) {
  // Remove the data URI prefix
  const base64String = dataUrl.split(',')[1];
  // Use TextDecoder instead of atob
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)));

  return String(Math.round(decodedString.length / 1024));
}
