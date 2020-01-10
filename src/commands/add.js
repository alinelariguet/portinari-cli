const inquirer = require('inquirer');
const chalk = require('chalk');
const build = require('../build');
const fileWriter = require('../file-writer');

// CONSTS PROMPT
const componentsListPrompt = {
  type: 'list',
  name: 'component',
  message: `Choose a dynamic component to create:`,
  choices: [
    'PoPageDynamicDetail',
    'PoPageDynamicEdit',
    'PoPageDynamicTable'
  ]
};

const servicePrompt = {
  name: 'service',
  message: `Enter the service to be used by the component:`
};

async function add(moduleName) {
  const { component, service } = await inquirer.prompt([componentsListPrompt, servicePrompt]);

  try {

    const packageJson = _getPackageJson();

    if (!_containsTemplatesPackage(packageJson)) {
      const portinariVersion = await _getPortinariVersion(packageJson);
      const version = portinariVersion ? `${portinariVersion}` : 'latest';

      await build.installPackages(`@portinari/portinari-templates@${version}`);
    }

    fileWriter.config(moduleName);

    fileWriter.createModuleFile(component);
    fileWriter.createComponentFile(service);
    fileWriter.createRoutingModule(component);
    fileWriter.createTemplateFile(component);

  } catch (e) {
    console.log(chalk.red('There was an error in generating the files'), e);
  }
}

function _containsTemplatesPackage(packageJson) {
  return packageJson['dependencies']['@portinari/portinari-templates'];
}

function _getPackageJson() {
  return require(`${process.cwd()}\\package.json`);
}

function _getPortinariVersion(packageJson) {
  return packageJson['dependencies']['@portinari/portinari-ui'];
}

module.exports = add