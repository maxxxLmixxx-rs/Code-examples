export const getNode = (htmlString) => {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};

export const generateTemplates = (container, template, configArray) => {
    configArray
        .map(templateConfig => template(templateConfig))
        .map(templateHTML => getNode(templateHTML))
        .forEach(templateNode => {
            container.appendChild(templateNode);
        });
};