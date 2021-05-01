import {getNode} from '../../../_share/_scripts/_getNode.js';

export const generateTemplates = (container, template, configArray) => {
    configArray
        .map(templateConfig => template(templateConfig))
        .map(templateHTML => getNode(templateHTML))
        .forEach(templateNode => {
            container.appendChild(templateNode);
        });
};