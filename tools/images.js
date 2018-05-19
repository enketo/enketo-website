const imagemin = require( 'imagemin-keep-folder' );
const imageminWebp = require( 'imagemin-webp' );
const SOURCE = 'src/media/images/**/*.{jpg,png}';
//const TARGET = 'public/media/images-webp';

imagemin( [ SOURCE ], {
    use: [
        imageminWebp( { lossless: true } )
    ],
    replaceOutputDir: output => {
        return output.replace( /src\//, 'public/' );
    }
} ).then( () => {
    console.log( 'Images optimized' );
} );