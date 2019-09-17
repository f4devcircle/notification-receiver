function numberConvert(rupiah) {
  return parseInt(rupiah.replace(/,.*|[^0-9]/g, ''), 10);
}

const formatter = {
  "OVO": message => {
    const regex = /(?<=sebesar Rp )(.*)(?= melalui)/gm;
    return message.match(regex);
  },
  "GOPAY": message => {
    const regex = /(?<=paid you Rp)(.*)(?=. Updated)/gm;
    return message.match(regex);
  }
}

module.exports = {
  numberConvert,
  formatter
};