import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});
await copyFile('server/index.js','dist/server/index.js');
await mkdir('dist/.openai',{recursive:true});
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
