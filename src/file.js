const fs = require('fs');

const format_output = output => JSON.stringify(output, null, 4);

const save_output = (output, filename) => {
  const formatted_output = format_output(output);
  const formatted_filename = `./outputs/${( filename || 'output' )}.json`;

  return new Promise((resolve, reject) => fs.writeFile(
    formatted_filename,
    formatted_output,
    error => error
      ? reject(error)
      : resolve(`Output saved to file: ${formatted_filename}`)
  ));
};

module.exports = { save_output };
