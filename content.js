
const FIX_ME_DEFAULT_CLASS_NAME = 'crxFixedContent';
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
    const [$fixme, className] = createFiexme(content);
    if (!$fixme) return;
    const $fixmeCloseBtn = createFixmeCloseBtn(className);
    $fixme.appendChild($fixmeCloseBtn);
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

function createFiexme (content) {
    const className = getContentClassNameBy(content);
    if (fixedContents.includes(className)) {
        return [null];
    }
    const style = {
        position: 'fixed',
        top: 0,
        left: 'calc(50% - 375px - 1.5em)',
        width: '750px',
        background: '#fefefe',
        fontSize: '16px',
        color: '#212121',
        padding: "1em 1.5em",
        boxShadow: '0 0 20px 0 rgba(0, 0, 0, .125)',
        zIndex: 999999
    };
    fixedContents.push(className);
    return [createElement('div', content, className, style), className];
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
    return createElement('div', 'x', closeBtnClassName, style, action);
}

function $(el) {
    return document.querySelector(el);
}

function $$(el) {
    return document.querySelectorAll(el);
}

function createElement(el, content, classList, style = {}, action = {}) {
    if (!el || !content) return;
    const $el = document.createElement(el);
    $el.innerHTML = content;
    Array.isArray(classList) ? classList.map(className => $el.classList.add(className)) : [classList].map(className => $el.classList.add(className))
    Object.assign($el.style, style);
    if (action.type) {
        $el.addEventListener(action.type, action.body);
    }
    return $el;
}
