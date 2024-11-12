const loadingOverlay = document.getElementsByClassName('loader')[0]
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000

let assetsToLoad = [];
let loadedAssets = 0;

function hideLoadingScreen() {
    loadingOverlay.style.display = 'none';
    document.body.classList.remove('loading');
   
    document.dispatchEvent(new Event('assetsLoaded'));
}

function showLoadingScreen() {
    loadingOverlay.style.display = 'flex';
    document.body.classList.add('loading');
}

function collectAssets() {
    const assets = [];
    document.querySelectorAll('img, video').forEach(el => {
        assets.push({
            element: el,
            src: el.src,
            retries: 0
        });
    });
    return assets;
}

function loadAsset(asset) {
    return new Promise((resolve, reject) => {
        const { element, src } = asset;

        function handleLoad() {
            element.removeEventListener('load', handleLoad);
            element.removeEventListener('error', handleError);
            resolve();
        }

        function handleError() {
            element.removeEventListener('load', handleLoad);
            element.removeEventListener('error', handleError);
            reject();
        }

        if (element.tagName === 'IMG') {
            if (element.complete && element.naturalWidth > 0) {
                resolve();
            } else {
                element.addEventListener('load', handleLoad);
                element.addEventListener('error', handleError);
                element.src = src + (src.includes('?') ? '&' : '?') + 'cache=' + new Date().getTime();
            }
        } else if (element.tagName === 'VIDEO') {
            if (element.readyState >= 4) {
                resolve();
            } else {
                element.addEventListener('loadeddata', handleLoad);
                element.addEventListener('error', handleError);
                element.load();
            }
        }
    });
}

function retryAsset(asset) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            loadAsset(asset)
                .then(resolve)
                .catch(() => {
                    if (asset.retries < MAX_RETRIES) {
                        asset.retries++;
                        retryAsset(asset).then(resolve).catch(reject);
                    } else {
                        //mark as done anyway to prevent longer loading time
                        resolve();
                    }
                });
        }, RETRY_DELAY);
    });
}

function loadAllAssets() {
    const promises = assetsToLoad.map(asset =>
        loadAsset(asset)
            .catch(() => retryAsset(asset))
            .then(() => {
                loadedAssets++;
            })
    );

    return Promise.all(promises);
}

showLoadingScreen();
assetsToLoad = collectAssets();
loadAllAssets().then(() => {
    hideLoadingScreen();
}).catch(error => {
    hideLoadingScreen();
});
