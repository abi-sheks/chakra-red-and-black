const loadingOverlay = document.getElementsByClassName('loader')[0]
const MAX_RETRIES = 4;
const RETRY_DELAY = 2000

let assetsToLoad = [];
let loadedAssets = 0;

const hideLoadingScreen = () => {
    loadingOverlay.style.display = 'none';
    document.body.classList.remove('loading');
}

const showLoadingScreen = () => {
    loadingOverlay.style.display = 'flex';
    document.body.classList.add('loading');
}

const collectAssets = () => {
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

const loadAsset = (asset) => {
    return new Promise((resolve, reject) => {
        const { element, src } = asset;

        const handleLoad = () => {
            element.removeEventListener('load', handleLoad);
            element.removeEventListener('error', handleError);
            resolve();
        }

        const handleError = () => {
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
            }
        } else if (element.tagName === 'VIDEO') {
            if (element.readyState >= 4) {
                resolve();
            } else {
                element.addEventListener('loadeddata', onLoad);
                element.addEventListener('error', onError);
                element.load();
            }
        }
    });
}

const retryAsset = (asset) => {
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

const loadAllAssets = () => {
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