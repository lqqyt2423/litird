'use strict';

// Generate index.d.ts

const fs = require('fs');
const loader = require('./loader');
const template = `// This file is created by litird
// Do not modify this file

import * as mongoose from 'mongoose';
import Koa = require('koa');
import Litird = require('litird');

import ExportConfig = require('./config');

<<import_services>>

<<import_controllers>>

import ExportApp = require('./app');

declare module 'litird' {
  type AppConfig = typeof ExportConfig;
  type AllConfig = Litird.Config & AppConfig;
  interface IConfig extends AllConfig { };

  interface IModel {
<<interface_models>>
  }

  interface IService {
<<interface_services>>
  }

  interface IController {
<<interface_controllers>>
  }

  interface App extends ExportApp {}
}

// magic
declare global {
  interface Context extends Koa.Context { };
  type Next = Koa.Next;
}
`;

function render(content, name, str) {
  str = str.replace(/\n$/, '');
  return content.replace(`<<${name}>>`, str);
}

module.exports = function generate(logger) {
  let import_services = '';
  let import_controllers = '';
  let interface_models = '';
  let interface_services = '';
  let interface_controllers = '';

  loader.load(logger, 'model', (err, res) => {
    interface_models += `    ${res.uname}: mongoose.Model<mongoose.Document>;\n`;
  });

  loader.load(logger, 'service', (err, res) => {
    import_services += `import Export${res.uname}Service = require('./service/${res.name}');\n`;
    interface_services += `    ${res.lname}: Export${res.uname}Service;\n`;
  });

  loader.load(logger, 'controller', (err, res) => {
    import_controllers += `import Export${res.uname}Controller = require('./controller/${res.name}');\n`;
    interface_controllers += `    ${res.lname}: Export${res.uname}Controller;\n`;
  });

  let content = template;
  content = render(content, 'import_services', import_services);
  content = render(content, 'import_controllers', import_controllers);
  content = render(content, 'interface_models', interface_models);
  content = render(content, 'interface_services', interface_services);
  content = render(content, 'interface_controllers', interface_controllers);

  fs.writeFileSync(loader.getPath('index.d.ts'), content);
  return content;
};
