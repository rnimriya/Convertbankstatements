const JSZip = require("jszip");
const zip = new JSZip();
zip.file("hello.txt", "Hello World\n");
zip.generateAsync({type:"nodebuffer"}).then(function(content) {
    JSZip.loadAsync(content).then(function(loaded) {
        const file = loaded.file("hello.txt");
        console.log("Size:", file._data ? file._data.uncompressedSize : "unknown");
    });
});
