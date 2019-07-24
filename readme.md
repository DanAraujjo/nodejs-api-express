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

Crie o arquivo **src/routes.js**

```
import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ status: "on-line" });
});

export default routes;
```

Crie o arquivo **src/app.js**

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

Crie o arquivo **src/server.js**

```
import app from "./app";

app.listen(3333);
```

Crie o arquivo **nodemon.json**

```
{
  "execMap": {
    "js": "sucrase-node"
  }
}
```

Acresente no arquivo **package.json**

```
  "scripts": {
    "dev": "nodemon src/server.js"
  }
```

## Variáveis ambiente

Execute o comando

```
yarn add dotenv
```

Crie o arquivo **.env**

```
APP_URL= http://localhost:3333
NODE_ENV=development
```

Inclua no arquivo **src/app.js**

```
import 'dotenv/config';
```

## Padronização de Projetos (ESLint, Prettier & EditorConfig)

Execute os comandos abaixo

```
yarn add eslint -D
yarn eslint --init
```

Selecione

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

No VSCode, clique com botão direito e selecionar a opção _generate .editorconfig_

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

## Tratamento de exceções

Execute os comandos

```
yarn add youch
yarn add express-async-errors
```

Iremos utilizar também o [Sentry](https://sentry.io)

Faça login com sua conta, crie um projeto e siga tutorial.

> Exemplo

```
yarn add @sentry/node@5.5.0
```

Adcione ao arquivo **.env**

> A url é mesma que mostra no seu projeto no Sentry. Exemplo: Sentry.init({ dsn: 'https://6b1a0c46525042f491a188aba36f68be@sentry.io/1511984' });

```
# Sentry

SENTRY_DSN='https://6b1a0c46525042f491a188aba36f68be@sentry.io/1511984'
```

Crie o arquivo **src/config/sentry.js**

```
export default {
  dsn: process.env.SENRTY_DSN,
};

```

Inclua no arquivo **src/[app](https://github.com/DanAraujjo/nodejs-api-rest/blob/master/src/app.js).js**

```
import Youch from 'youch';

import * as Sentry from '@sentry/node';
import 'express-async-errors';

import sentryConfig from './config/sentry';

...

Sentry.init(sentryConfig);

...

this.exceptionHandler();

...

this.server.use(Sentry.Handlers.requestHandler());

...

this.server.use(Sentry.Handlers.errorHandler());

...

exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res
        .status(500)
        .json({ error: 'Oops! Occoreu um erro no servidor!' });
    });
  }
```

## Banco de dados ([Docker](https://docs.docker.com/install/) com Postgres)

Após instalar o Docker, execute o comando:

```
docker run --name nome-do-container -e POSTGRES_PASSWORD=senha-acesso -p 5432:5432 -d postgres
```

Você pode usar o [Postbird](https://electronjs.org/apps/postbird) para criar o banco via interface (Gui)

## Sequelize (ORM)

Execute os comandos

```
yarn add sequelize
yarn add sequelize-cli -D
```

Crie o arquivo **.sequelizerc**

```
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname,'src', 'config', 'database.js'),
  'models-path': resolve(__dirname,'src', 'app', 'models'),
  'migrations-path': resolve(__dirname,'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname,'src', 'database', 'seeds'),
}

```

Se estiver utilizando o Postgres, excute também

```
yarn add pg pg-hstore
```

Adcione ao arquivo **.env**

```
# Database

DB_HOST=localhost
DB_USER=postgres
DB_PASS=senha-acesso
DB_NAME=nome-do-seu-banco
```

Crie o arquivo **src/config/database.js**

```
require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

```

Crie o arquivo **src/database/index.js**

```
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

const models = [];

class Database {
  constructor() {
    // conexão com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    this.init();

    this.associate();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
```

## Migrations (Exemplo)

Crie a pasta **src/database/migrations**

Execute o comando

```
yarn sequelize migration:create --name=create-users
```

Exemplo do arquivo [migration-create-users]()

Para criar a tabela users no banco de dados use o comando

```
yarn sequelize db:migrate
```

Para desfazer use o comando

```
yarn sequelize db:migrate:undo
```

## Criptografia

Para criptografia iremos utilizar o _bcryptjs_

```
yarn add bcryptjs
```

## Validação dados de entrada

Para as validações iremos utilizar o [Yup](https://github.com/jquense/yup)

```
yarn add yup
```

## Criação do Model e do Controller

Crie o model **src/app/models/[User](https://github.com/DanAraujjo/nodejs-api-rest/blob/master/src/app/models/User.js).js**

Crie o Controller **src/app/controllers/[UserController](https://github.com/DanAraujjo/nodejs-api-rest/blob/master/src/app/controllers/UserController.js).js**

Inclua as rotas no arquivo **src/[routes](https://github.com/DanAraujjo/nodejs-api-rest/blob/master/src/routes.js).js**

Inclua no arquivo **src/database/[index](https://github.com/DanAraujjo/nodejs-api-rest/blob/master/src/database/index.js).js**

```
import User from '../app/models/User';

...

const models = [User];
```
