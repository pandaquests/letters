// Create a new FontFace object
const fileType = "TTF"
const fileName = "clouds";
const urlPath = `font/${fileName}.${fileType}`;
const customFont = new FontFace('customFont', `url(${urlPath})`);

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const words = ["We", "In", "As", "If"];
function dataURLToBlob(dataURL) {
    // Split the data URL into two parts: the metadata and the data
    const parts = dataURL.split(';base64,');
    const metadata = parts[0];
    const data = atob(parts[1]);

    // Create an ArrayBuffer and a view into it
    const buffer = new ArrayBuffer(data.length);
    const view = new Uint8Array(buffer);

    // Copy the data into the view
    for (let i = 0; i < data.length; i++) {
        view[i] = data.charCodeAt(i);
    }

    // Return the Blob
    return new Blob([view], { type: metadata.split(':')[1] });
}

// Load the font into the document
customFont.load().then(loadedFont => {
    // Add the font to the document
    document.fonts.add(loadedFont);
    const canvas = document.getElementById("myCanvas");
    const container = document.getElementById('image-container');
    const bulkDownload = document.getElementById('buldDownload');

    const ctx = canvas.getContext("2d");
    const fontFamily = "customFont";
    const textHeight = 139;


    const zip = new JSZip();
    [].concat(words, [...letters]).forEach(lttr => {
        const letter = lttr;
        ctx.font = `${textHeight}px ${fontFamily}`;
        const textWidth = ctx.measureText(letter).width;
        canvas.width = textWidth;
        const font = `${textHeight}px ${fontFamily}`;
        ctx.font = font;

        // Get the bounding rect of the text
        const textRect = ctx.measureText(letter);

        // Calculate the vertical position of the text
        const boundBoxHeight = textRect.actualBoundingBoxAscent;
        canvas.height = boundBoxHeight;
        ctx.font = font;

        // Draw the text at the calculated position
        ctx.fillText(letter, 0, boundBoxHeight);

        // get data URL
        const dataURL = canvas.toDataURL();

        // Create an image element and set its src attribute to the data URL
        const image = document.createElement('img');
        image.src = dataURL;

        const div = document.createElement('div');
        div.className="letter";
        div.appendChild(image);
        // Append the image to the container element

        // Create a Blob from the data URL
        const blob = dataURLToBlob(dataURL);
        zip.file(`${letter}.png`, blob, { binary: true });

        const anchor = document.createElement('a');
        anchor.href = dataURL;
        anchor.download = `${letter}.png`;
        const button = document.createElement('button');
        button.innerHTML = 'Download';
        anchor.appendChild(button);
        div.appendChild(anchor);
        container.appendChild(div);

    });

    bulkDownload.addEventListener('click', () => {
        // Generate the zip file as a Blob
        zip.generateAsync({ type: "blob" }).then(zipFile => {
            // Trigger a download of the zip file
            saveAs(zipFile, `${fileName}.zip`);
        });
    });
});