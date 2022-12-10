import { execSync } from 'child_process';

const watchFilePath = process.argv[2] || '';
const watchDir = watchFilePath.split('/')[3] || '';

if (watchDir && !Number.isNaN(+watchDir)) {
    console.log('post: ' + watchDir);

    execSync(`DEV=! N=${watchDir} npm run build-blog`);

    console.log('Ок');
}
