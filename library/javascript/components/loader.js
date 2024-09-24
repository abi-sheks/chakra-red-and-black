
const hideLoadingScreen = () => {
    const loadingOverlay = document.getElementById('loader');
    loadingOverlay && (loadingOverlay.style.display = 'none');
    document.body.classList.remove('loading');
}

const showLoadingScreen = () => {
    const loadingOverlay = document.getElementById('loader');
    loadingOverlay && (loadingOverlay.style.display = 'flex');
    document.body.classList.add('loading');
}

const collectAssets = () => {
    const assets = [];
    const images = document.getElementsByClassName('image');
    const videos = document.getElementsByClassName('video');

    for (let img of images) {
        assets.push({ type: 'image', src: img.src });
    }

    for (let video of videos) {
        assets.push({ type: 'video', src: video.src });
    }
    return assets;
}

const preloadAssets = (assets, callback) => {
    let loadedAssets = 0;
    const totalAssets = assets.length;

    const assetLoaded = () => {
        loadedAssets++;
        if (loadedAssets === totalAssets) {
            callback();
        }
    }

    const assetErrored = () => {
        console.log("Failed to fetch an asset")
    }

    assets.forEach(asset => {
        if (asset.type === 'image') {
            const img = new Image();
            img.onload = assetLoaded;
            img.onerror = assetErrored;
            img.src = asset.src;
        } else if (asset.type === 'video') {
            const video = document.createElement('video');
            video.oncanplaythrough = assetLoaded;
            video.onerror = assetErrored;
            video.src = asset.src;
            video.load();
        }
    });
}

showLoadingScreen();

const assets = collectAssets();

preloadAssets(assets, function () {
    hideLoadingScreen();
});