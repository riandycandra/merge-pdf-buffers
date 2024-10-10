const muhammara = require('muhammara');
const memoryStreams = require('memory-streams');

/**
 * Merges an array of PDF buffers into one single PDF buffer 
 * 
 * @param {Buffer[]} buffers - a list of PDF buffers to be merged
 * 
 * @returns {Buffer} merged pdf buffer
 */
exports.merge = async buffers => {
  const [first] = buffers;

  const outStream = new memoryStreams.WritableStream();
  const firstPdfStream = new muhammara.PDFRStreamForBuffer(first);

  const pdfWriter = muhammara.createWriterToModify(
    firstPdfStream,
    new muhammara.PDFStreamForResponse(outStream),
  );

  buffers.shift();
  buffers.forEach(buffer => {
    const newPdfStream = new muhammara.PDFRStreamForBuffer(buffer);
    pdfWriter.appendPDFPagesFromPDF(newPdfStream);
  });

  pdfWriter.end();
  return outStream.toBuffer();
};