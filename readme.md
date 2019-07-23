# Criando uma Api REST com NodeJS

## Criando a base do projeto

Crie uma pasta como o nome do projeto (mkdir _nome-projeto_)

Entre na pasta e inicie o [Git](https://git-scm.com/)

```
git init
```

Criar o arquivo .gitignore (touch .gitignore)

```
node_modules
.env
```

Execute os comandos abaixos (você precisará do [Yarn](https://yarnpkg.com/pt-BR))

```
yarn init -y
yarn add express
yarn add sucrase nodemon -D
```

#### Crie os arquivos

**src/routes.js**

```
import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ status: "on-line" });
});

export default routes;
```

**src/app.js**

```
import express from "express";
import routes from "./routes";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

```

**src/server.js**

```
import app from "./app";

app.listen(3333);
```

Criar o arquivo **nodemon.json**

```
{
  "execMap": {
    "js": "sucrase-node"
  }
}
```

#### Altere o arquivo

Acresentar no arquivo **package.json**

```
  "scripts": {
    "dev": "nodemon src/server.js"
  }
```

## Padronização de Projetos (ESLint, Prettier & EditorConfig)

Execute os comando abaixo

```
yarn add eslint -D
yarn eslint --init
```

Selecione:

- To check syntax, find problems, and enforce code style
- JavaScript modules (import/export)
- None of these
- Marque somente Node
- Use a popular style guide
- Airbnb (https://github.com/airbnb/javascript)
- Javascript
- Y

Ao terminar, exclua o arquivo _package-lock.json_ e execute os comandos

```
yarn
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Crie o arquivo **.prettierrc**

```
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Altere o arquivo **.eslintrc.js**

```
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
```

No VsCode, clique com botão direito e selecionar a opção _generate .editorconfig_

```
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

> Para corrigir todos arquivos (indentação)

```
 yarn eslint --fix src --ext .js
```
