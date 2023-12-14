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
