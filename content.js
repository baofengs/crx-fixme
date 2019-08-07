
const FIX_ME_DEFAULT_CLASS_NAME = 'crxFixedContent';
const CLOSE_ICON = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1565193480548" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1993" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css">.icon { color: #666; }</style></defs><path d="M693.248 359.424L540.672 512l151.552 151.552c8.192 8.192 8.192 20.48 0 28.672-4.096 4.096-9.216 6.144-14.336 6.144s-10.24-2.048-14.336-6.144L512 540.672 359.424 693.248c-4.096 4.096-9.216 6.144-14.336 6.144s-10.24-2.048-14.336-6.144c-8.192-8.192-8.192-20.48 0-28.672L483.328 512 330.752 359.424c-8.192-8.192-8.192-20.48 0-28.672s20.48-8.192 28.672 0L512 483.328l152.576-152.576c8.192-8.192 20.48-8.192 28.672 0 8.192 8.192 8.192 20.48 0 28.672zM972.8 512c0 253.952-206.848 460.8-460.8 460.8S51.2 765.952 51.2 512 258.048 51.2 512 51.2s460.8 206.848 460.8 460.8z m-40.96 0C931.84 280.576 743.424 92.16 512 92.16S92.16 280.576 92.16 512s188.416 419.84 419.84 419.84 419.84-188.416 419.84-419.84z" p-id="1994"></path></svg>'
let fixedContents = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const {cmd, value} = request;
        switch (cmd) {
            case 'fixme':
                doFixme(value.trim());
                break;
            case 'kbd-clear':
                removeAll();
                break;
            case 'kbd-fixme':
                const content = window.getSelection().toString().trim();
                doFixme(content);
                break;
            default:
                break;
        }
    }
);

function doFixme (content) {
    if (!content) return;
    const [$fixme, className] = createFixme(content);
    if (!$fixme) return;
    const $fixmeContent = createFixContent(content);
    const $fixmeCloseBtn = createFixmeCloseBtn(className);
    $fixme.appendChild($fixmeCloseBtn);
    $fixme.appendChild($fixmeContent);
    document.body.appendChild($fixme);
}

function getContentClassNameBy (content) {
    return `crx-${hex_md5(content)}`;
}

function removeContentBy (className) {
    document.body.removeChild($(`.${className}`));
    removeContentInArray(className);
}

function removeContentInArray (className) {
    const index = fixedContents.indexOf(className);
    fixedContents.splice(index, 1);
}

function removeAll () {
    if (!fixedContents || fixedContents && fixedContents.length === 0) return;
    fixedContents.map(content => {
        const $content = $(`.${content}`);
        document.body.removeChild($content);
    });
    fixedContents = [];
}

function createFixme (content) {
    const className = getContentClassNameBy(content);
    if (fixedContents.includes(className)) {
        return [null];
    }
    const style = {
        position: 'fixed',
        top: 0,
        left: 'calc(50% - 375px - 2em)',
        zIndex: 999999,
        width: '750px',
        color: '#212121',
        fontSize: '16px',
        padding: "1em 2em .5em",
        background: '#fefefe',
        boxShadow: '0 0 20px 0 rgba(0, 0, 0, .125)',
        resize: 'vertical',
        overflow: 'scroll',
        minHeight: '2.5em'
    };
    fixedContents.push(className);
    return [createElement('div', '', className, style), className];
}

function createFixContent (content) {
    const style = {
        width: '100%',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
        border: 0,
        background: '#fff',
        padding: 0,
        margin: 0
    };
    return createElement('pre', content, 'fixme-content', style);
}

function createFixmeCloseBtn (className) {
    const closeBtnClassName = `crx-${className}-close`;
    const style = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '18px',
        cursor: 'pointer',
        lineHeight: 1
    };
    const action = {
        type: 'click',
        body: function () {
            removeContentBy(className);
        }
    };
    return createElement('div', CLOSE_ICON, closeBtnClassName, style, action);
}

function $(el) {
    return document.querySelector(el);
}

function $$(el) {
    return document.querySelectorAll(el);
}

function createElement(el, content = '', classList, style = {}, action = {}) {
    if (!el) return;
    const $el = document.createElement(el);
    $el.innerHTML = content;
    Array.isArray(classList) ? classList.map(className => $el.classList.add(className)) : [classList].map(className => $el.classList.add(className))
    Object.assign($el.style, style);
    if (action.type) {
        $el.addEventListener(action.type, action.body);
    }
    return $el;
}
