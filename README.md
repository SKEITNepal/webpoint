This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## System Requirement 
node: v16.17.0

## Install packeges: 
```bash
npm i
# or
yarn install
```

## Initialize the dabatase, for first time use: 

please put the mysql database link on ```.env``` file in following format: 

```bash
DATABASE_URL="mysql://DATABSE_USERNAME:DATABASE_PASSWORD@DATABASE_HOST:DATABASE_PORT/DATABASE_NAME"
```

After link is setup please run following command:

```bash
npm run db
# or
yarn db
```


First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## ToDo
--> create journal
--> filter
--> loading effect
--> error handling 
--> code refactoring
