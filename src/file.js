const fs = require('fs');

const format_output = output => JSON.stringify(output, null, 4);

const save_output = (output, filename) => {
  const formatted_output = format_output(output);

  fs.writeFile(
    `./outputs/${( filename || 'output' )}.json`,
    formatted_output,
    error => error
      ? console.error(error)
      : console.log('Output saved to file')
  );
};

module.exports = { save_output };
