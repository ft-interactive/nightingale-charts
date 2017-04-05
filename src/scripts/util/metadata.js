//example:
//http://codinginparadise.org/projects/svgweb-staging/tests/htmlObjectHarness/basic-metadata-example-01-b.html
const svgSchema = 'http://www.w3.org/2000/svg';
const xlinkSchema = 'http://www.w3.org/1999/xlink';
const xmlnsSchema = 'http://www.w3.org/2000/xmlns/';
const rdfSchema = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const dcSchema = 'http://purl.org/dc/elements/1.1/';
const ccSchema = 'http://creativecommons.org/ns#';
const prismSchema = "http://prismstandard.org/namespaces/1.0/basic/"; // eslint-disable-line no-unused-vars
const rdfsSchema = "http://www.w3.org/2000/01/rdf-schema#"; // eslint-disable-line no-unused-vars

function create(svg, model) {
    svg.append('title').text(model.title);
    svg.append('desc').text(model.subtitle);
    svg.append('metadata').attr({'id': "license"});

    const container = svg.node();
    const meta = container.querySelector('metadata');

    const rdf = document.createElement('rdf:RDF');
    const rdfDesc = document.createElement('rdf:Description');
    const title = document.createElement('dc:title');
    const description = document.createElement('dc:description');
    const format = document.createElement('dc:format');
    const date = document.createElement('dc:date');

    container.setAttribute('xmlns', svgSchema);
    container.setAttributeNS(xmlnsSchema, 'xmlns:xlink', xlinkSchema);
    rdfDesc.setAttribute('rdf:about', '');
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:rdf', rdfSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:dc', dcSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:cc', ccSchema);

    title.textContent = model.title;
    description.textContent = model.subtitle;
    format.textContent = 'image/svg+xml';
    date.textContent = (new Date()).toString();

    meta.appendChild(rdf);
    rdf.appendChild(rdfDesc);
    rdfDesc.appendChild(title);
    rdfDesc.appendChild(description);
    rdfDesc.appendChild(format);
    rdfDesc.appendChild(date);
}

module.exports = {
    create: create
};
