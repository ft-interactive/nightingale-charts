function loadAssets(html){
    console.log('_site/' + html + '.html')
    document.body.innerHTML = __html__['_site/' + html + '.html'];
    function appendCSS(fileObj){
        var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
    }
    appendCSS({path: '_site/styles/demo.css'});
    appendCSS({path: '_site/styles/{{ component }}.css'});
}

module.exports = {
    loadAssets: loadAssets
};