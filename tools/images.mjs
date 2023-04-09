import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { promises as fsPromises } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'graceful-fs';

const writeFile = promisify(fs.writeFile);

const srcdir = 'src/media/images';
const distdir = 'public/media/images';

imagemin([srcdir + '/**/*.{jpg,jpeg,png}'], {
    plugins: [
        imageminWebp({quality: 50})
    ]
}).then(files => files
    .forEach(async v => {
        let source = path.parse(v.sourcePath);
        v.destinationPath = `${source.dir.replace(srcdir, distdir)}/${source.name}.webp`;
        await fsPromises.mkdir(path.dirname(v.destinationPath), { recursive: true });
        await writeFile(v.destinationPath, v.data);
    })
).then( () => {
    console.log('images optimized');
});
