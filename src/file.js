const fs = require('fs');

const formatOutput = output => JSON.stringify(output, null, 4);

const saveOutput = (output, filename) => {
  const formattedOutput = formatOutput(output);

  fs.writeFile(
    `./outputs/${( filename || 'output' )}.json`,
    formattedOutput,
    error => error
      ? console.error(error)
      : console.log('Output saved to file')
  );
};

module.exports = { saveOutput };
