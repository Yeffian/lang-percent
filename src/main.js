#! /usr/bin/env node
import figlet from 'figlet';
import gradient from 'gradient-string'
import chalk from 'chalk';
import fs from 'fs';
import languages from './languages.json' with { type: "json"};

const write = console.log;

function traverseFiles(dirPath, ignoreFolders) {
  const allFiles = []; 

  try {
    const files = fs.readdirSync(dirPath);
  
    for (const file of files) {
      const filePath = `${dirPath}/${file}`;
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        allFiles.push({ name: file, ext: file.split(".")[1]});
      }

      if (stats.isDirectory() && !ignoreFolders.includes(file)) {
        const subfolderFiles = traverseFiles(filePath, ignoreFolders);
        allFiles.push(...subfolderFiles);
      }
    }

    return allFiles;
  } catch (err) {
    console.error('Error reading directory:', err);
  }

  return undefined;
}

figlet("lang-percent", (err, text) => {
  const foldersToIgnore = process.argv.slice(2);
  const extensionCounts = {};
  write(gradient.pastel.multiline(text));  
  
  const files = traverseFiles(process.cwd(), foldersToIgnore);  
  const numberOfFiles = files.length;

  for (var file of files) {
    const ext = file['ext'];
    
    if (Object.keys(languages).includes(ext)) {
      if (extensionCounts.hasOwnProperty(ext)) {
        extensionCounts[ext] = extensionCounts[ext] + 1;
      } else {
        extensionCounts[ext] = 1;
      }  
    }
  }

  write(chalk.blue.bgRed.bold('Your project has..'))

  let output = '';

  for (var extension in extensionCounts) {
    const language = languages[extension];
    const percentage = Math.ceil(extensionCounts[extension] / numberOfFiles * 100);

    output += `${language}: ${percentage}\n`;
  }

  write(gradient.instagram.multiline(output));
});