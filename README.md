# Requerimentos

- Node.js
- MySQL

# Instalação

1 - Baixe o projeto

2 - Dê o comando de instalação no terminal

```
npm i
```

3 - Configure as variáveis do banco de dados no arquivo `.env`

4 - Caso não tenha as tabelas configuradas no banco basta dar os comandos que monte a tabelas desde que já tenha configurado os dados do banco no `.env`

```
npx prisma migrate dev --name init

npx prisma generate
```

5 - Rode o site com o comando

```
npm run dev
```