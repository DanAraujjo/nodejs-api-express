# Enviando E-mail com Redis e Nodemailer

## Configurando a Fila

Execute o comando

```
docker run --name apirest_redis -p 6379:6379 -d -t redis:alpine
```

Vamos utilizar o [Bee-Queue](https://github.com/bee-queue/bee-queue)

```
yarn add bee-queue
```

Crie uma conta no site https://mailtrap.io para teste de envio.

Adcione ao arquivo **[.env](/.env)**

```
# Redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Mail

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=5aa6d46dd58e50
MAIL_PASS=53053a95fd68d9
```

Crie o arquivo **src/config/[redis](/src/config/redis.js).js**

Crie o arquivo **src/lib/[Queue](/src/lib/Queue.js).js**

Crie o arquivo **src/[queue](/src/queue.js).js**

Adcionar ao **package.json**

```
"scripts": {
    "queue": "nodemon src/queue.js"
  },
```

## Configurando Template

> https://handlebarsjs.com/

Execute o comando

```
yarn add express-handlebars nodemailer-express-handlebars
```

Crie os arquivos:

- src/app/views/emails/layouts/default.hbs

```
<div
style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #222; max-width: 600px;">
{{{ body }}}
{{> footer}}
</div>
```

- src/app/views/emails/partials/footer.hbs

```
<br />
Equipe Dev
```

- src/app/views/emails/updateuser.hbs
  > Utilize o nome do modelo que desejar

```
<strong>Olá!</strong>
<p>Houveram algumas alterações nos seu dados cadastrais, confira os detalhes abaixo:</p>
<p>
<strong>Nome: </strong> {{ user }} <br />
<strong>E-mail: </strong> {{ email }} <br />
</p>
```

## Nodemailer

Execute o comando

```
yarn add nodemailer
```

Crie os arquivos

- [src/config/mail.js](/src/config/mail.js)
- [src/lib/Mail.js](/src/lib/Mail.js)
- [src/app/jobs/UpdateUserMail.js](/src/app/jobs/UpdateUserMail.js)

Inclua no Controller que irá enviar o e-mail (Ex: UserController)

```
import Queue from '../../lib/Queue';
import UpdateUserMail from '../jobs/UpdateUserMail;

// envio de email
await Queue.add(UpdateUserMail.key, { user });
```
