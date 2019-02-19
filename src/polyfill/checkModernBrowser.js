var modernBrowser = (
    'fetch' in window &&
    'assign' in Object
);

if (!modernBrowser) {
    var scriptElement = document.createElement('script');
    scriptElement.async = false;
    scriptElement.src = 'js/polyfills.bundle.js';
    document.head.appendChild(scriptElement);
}

var modernBrowser="fetch"in window&&"assign"in Object;if(!modernBrowser){var scriptElement=document.createElement("script");scriptElement.async=!1,scriptElement.src="js/polyfills.bundle.js",document.head.appendChild(scriptElement)}

// need to auto inject into each .html file