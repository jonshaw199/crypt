import fs from "fs";
import path from "path";

export function fromDir(startPath, filter, callback, recursive = true) {
  if (!fs.existsSync(startPath)) {
    console.log(`Path not found: ${startPath}`);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory() && recursive) {
      fromDir(filename, filter, callback);
    } else if (filter.test(filename)) {
      callback(filename);
    }
  }
}

/*
Example:

fromDir('../LiteScript', /\.html$/, function(filename) {
    console.log('-- found: ', filename);
});
*/
