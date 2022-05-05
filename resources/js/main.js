window.onload = function() {
    initialize();
};

window.onhashchange = function() {
    initialize();
};

function initialize() {
    let canvas = document.getElementById('map'),
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    let mapbox = {
        username: 'leomancini',
        baseMapStyle: 'cl2t2ygj4000c14ui5jf48pda',
        labelsMapStyle: 'cl2t3qt5t000q15novpmf9fke',
        apiKey: 'pk.eyJ1IjoibGVvbWFuY2luaSIsImEiOiJjbDJ0MmVnZGYwMDZlM3BzMTd1ejY0eXZ6In0.pVD6EcjKzpfhVyNFSPp0tQ'
    };

    let mapSettings = {
        center: {
            lat: 40.70612,
            lng: -74.00299
        },
        zoom: 16,
        outerOffset: 50,
        size: canvas.width,
        pixelation: 12
    }

    if (location.hash) {
        let urlParams = location.hash.split('#').join('');
        urlParams = urlParams.split('/');

        mapSettings.center.lat = urlParams[0];
        mapSettings.center.lng = urlParams[1];
    }

    let mapSizeWithOuterOffset = mapSettings.size + mapSettings.outerOffset;

    baseMap = new Image();
    baseMap.src = `https://api.mapbox.com/styles/v1/${mapbox.username}/${mapbox.baseMapStyle}/static/${mapSettings.center.lng},${mapSettings.center.lat},${mapSettings.zoom},0,0/${mapSettings.size}x${mapSettings.size}?access_token=${mapbox.apiKey}`;
    baseMap.crossOrigin = 'anonymous';

    context.imageSmoothingEnabled = false;

    baseMap.onload = function() {
        context.drawImage(baseMap, mapSettings.outerOffset * -0.5, mapSettings.outerOffset * -0.5, mapSizeWithOuterOffset, mapSizeWithOuterOffset);
        let baseMapData = context.getImageData(0, 0, mapSizeWithOuterOffset, mapSizeWithOuterOffset).data;

        // From https://img.ly/blog/how-to-pixelate-an-image-in-javascript/
        if (mapSettings.pixelation !== 0) {
            for (let y = 0; y < mapSizeWithOuterOffset; y += mapSettings.pixelation) {
                for (let x = 0; x < mapSizeWithOuterOffset; x += mapSettings.pixelation) {
                    let pixelIndexPosition = (x + y * mapSizeWithOuterOffset) * 4;
                    context.fillStyle = `rgba(
                        ${baseMapData[pixelIndexPosition]},
                        ${baseMapData[pixelIndexPosition + 1]},
                        ${baseMapData[pixelIndexPosition + 2]},
                        ${baseMapData[pixelIndexPosition + 3]}
                    )`;
                    context.fillRect(x, y, mapSettings.pixelation, mapSettings.pixelation);
                }
            }
        }

        context.imageSmoothingEnabled = true;

        labelsMap = new Image();
        labelsMap.src = `https://api.mapbox.com/styles/v1/${mapbox.username}/${mapbox.labelsMapStyle}/static/${mapSettings.center.lng},${mapSettings.center.lat},${mapSettings.zoom},0,0/1024x1024?access_token=${mapbox.apiKey}`;
        labelsMap.crossOrigin = 'anonymous';

        labelsMapOffset = {
            x: 10,
            y: 10
        }

        labelsMap.onload = function() {
            context.drawImage(labelsMap, (mapSettings.outerOffset * -0.5) + labelsMapOffset.x, (mapSettings.outerOffset * -0.5) + labelsMapOffset.y, mapSizeWithOuterOffset, mapSizeWithOuterOffset);
        }
    }
}