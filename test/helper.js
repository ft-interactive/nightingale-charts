function appendCSS(fileObj){
    var  link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href='base/' + fileObj.path;
    document.body.appendChild(link)
}
function appendScript(fileObj){
    var  link = document.createElement('script');
    link.type = 'javascript';
    link.src='base/' + fileObj.path;
    document.body.appendChild(link)
}
function loadAssets(page){
    document.body.innerHTML = __html__['_test/' + (page || 'index') + '.html'];
    //appendCSS({path: '_test/styles/demo.css'});
    //appendCSS({path: '_test/styles/main.css'});
    appendScript({path: '_site/scripts/vendor.js'});
    !page && appendScript({path: '_site/scripts/nightingale-charts.js'});
    page && appendScript({path: '_test/scripts/' + (page ) + '.js'});
}

module.exports = {
    loadAssets: loadAssets
};
