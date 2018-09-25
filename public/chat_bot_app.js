/**
 * ToDo:
 * - adjust sizing
 * - determine background color of user messages
 * - add documentation
 * */

// Get the origin of this script from the hosting document
for (i in document.scripts) {
  if (document.scripts[i].getAttribute('data-main') === 'chat_bot_app') {
    var conversationHostUrl = document.scripts[i].src;
    var conversationHost = conversationHostUrl.replace(/(\/\/.*?\/).*/g, '$1').slice(0, -1);
    break;
  }
}
// Endpoint for Watson conversation Node.js API
var conversationAPIEnpoint = conversationHost + '/api/message';
var globalContext;

// List of elements to be added to DOM. Some of these will be cloned and used repetitively e.g. userMsgNode & msgWrap
var elemList = [
    {
        name: 'styleSheetLink',
        type: 'link',
        attrs: [
            {name: 'rel', val: 'stylesheet'},
            {name: 'type', val: 'text/css'},
            {name: 'href', val: conversationHost + '/chat_bot_styles.css'}
        ]
    },{
        name: 'axiosScript',
        type: 'script',
        attrs: [
            {name: 'src', val: 'https://unpkg.com/axios/dist/axios.min.js'}
        ]
    },{
        name: 'anchorMeScript',
        type: 'script',
        attrs: [
            {name: 'src', val: conversationHost + '/anchorMe.js'}
        ]
    },{
        name: 'chatStartBtn',
        type: 'button',
        attrs: [
            {name: 'id', val: 'initiate_chat_bot_btn'},
            {
                name: 'class',
                val: [
                    'chtBot_crsr--pointr', 'talkbubble', 'chtBot_txtClr--white', 'chtBot_brdr--none',
                    'chtBot_fntSz--18px', 'chtBot_fxd--btm-15px_rgt-15px'
                ]
            }
        ],
        text: 'Need Help?'
    },{
        name: 'chatWrap',
        type: 'div',
        attrs: [
            {name: 'id', val: 'dialog_wrap'},
            {
                name: 'class',
                val: [
                    'chtBot_bottom-10--right-10', 'chtBot_fntFm--sanSer', 'chtBot_fntSz--12px', 'chtBot_brdrRdAll--10px',
                    'chtBot_wdth--400px', 'chtBot_hght--500px', 'chtBot_bgClr--white', 'chtBot_boxShdw--blue'
                ]
            }
        ]
    },{
        name: 'chatHeader',
        type: 'div',
        attrs: [
            {name: 'id', val: 'dialog_header'},
            {
                name: 'class',
                val: [
                    'chtBot_top--0', 'chtBot_wdth--100per', 'chtBot_bgClr--white', 'chtBot_hght--110px',
                    'chtBot_brdrBtm--1px', 'chtBot_brdrClr--lghtGray', 'chtBot_brdrStyl--solid',
                    'chtBot_brdrRdTpLft--10px', 'chtBot_brdrRdTpRght--10px'
                ]
            }
        ]
    },{
        name: 'chatHeaderIconWrap',
        type: 'div',
        attrs: [
            {name: 'id', val: 'header_icon_wrap'},
            {
                name: 'class',
                val: [
                    'chtBot_wdth--90px', 'chtBot_txtAlgn--center', 'chtBot_hght--100per', 'chtBot_dsply--in-block',
                    'chtBot_flt--left'
                ]
            }
        ]
    },{
        name: 'chatHeaderTxtWrap',
        type: 'div',
        attrs: [
            {name: 'id', val: 'header_txt_wrap'},
            {
                name: 'class',
                val: [
                    'chtBot_wdth--310px', 'chtBot_txtAlgn--left', 'chtBot_hght--100per', 'chtBot_dsply--in-block',
                    'chtBot_flt--left'
                ]
            }
        ]
    },{
        name: 'chatHeaderTxtTitle',
        type: 'p',
        attrs: [
            {name: 'id', val: 'header_txt_title'},
            {
                name: 'class',
                val: [
                    'chtBot_txtClr--blue', 'chtBot_pddTp--20px'
                ]
            }
        ],
        text: 'My Chatbot'
    },{
        name: 'chatHeaderTxt',
        type: 'p',
        attrs: [
            {name: 'id', val: 'header_txt'},
            {
                name: 'class',
                val: [
                ]
            }
        ],
        text: 'Our chatbot is here to answer your questions!'
    },{
        name: 'chatHeaderIcon',
        type: 'img',
        attrs: [
            {name: 'id', val: 'header_icon'},
            {name: 'src', val: conversationHost + '/headerIcon.png'},
            {
                name: 'class',
                val: [
                    'chtBot_wdth--50px', 'chtBot_mrgnTp--30px'
                ]
            }
        ]
    },{
        name: 'headerCloseBtn',
        type: 'button',
        attrs: [
            {name: 'id', val: 'hdr_close_btn'},
            {
                name: 'class',
                val: [
                    'chtBot_top--10px', 'chtBot_right--10px', 'chtBot_txtClr--black', 'close', 'thick',
                    'chtBot_bgClr--white', 'chtBot_brdr--none', 'chtBot_crsr--pointr', 'chtBot_pddAll--0'
                ]
            }
        ]
    },{
        name: 'chatDialog',
        type: 'div',
        attrs: [
            {name: 'id', val: 'dialog'},
            {
                name: 'class',
                val: [
                    'chtBot_mxWdth--100per', 'chtBot_hght--275px', 'chtBot_mrgnAll--3per',
                    'chtBot_mrgnTp--130px', 'chtBot_ovrflwY--scroll', 'chtBot_ovrflwWrap--break'
                ]
            }
        ]
    },{
        name: 'userInput',
        type: 'textarea',
        attrs: [
            {name: 'id', val: 'user_input'},
            {
                name: 'class',
                val: [
                    'chtBot_hght--50px', 'chtBot_resz--none', 'chtBot_txtArea_noGlow', 'chtBot_dsply--block',
                    'chtBot_ovrflwY--scroll', 'chtBot_brdr--none', 'chtBot_wdth--90per'
                ]
            },
            {name: 'placeholder', val: 'Type your message here or click one of the topics below...'}
        ]
    },{
        name: 'txtAreaWrap',
        type: 'div',
        attrs: [
            {
                name: 'class',
                val: [
                    'chtBot_mxWdth--100per', 'chtBot_bgClr--white', 'chtBot_brdrTp--1px', 'chtBot_brdrClr--lghtGray',
                    'chtBot_brdrStyl--solid', 'chtBot_hght--75px', 'chtBot_pddAll--15px', 'chtBot_brdrRdBtmRght--10px',
                    'chtBot_brdrRdBtmLft--10px'
                ]
            }
        ]
    },{
        name: 'loaderWrap',
        type: 'div',
        attrs: [
            {
                name: 'id',
                val: 'msg_loader_wrap'
            },{
                name: 'class',
                val: [
                    'chtBot_flt--left', 'chtBot_flt--left',
                    'chtBot_pddAll--2per', 'chtBot_mrgnAll--2per', 'chtBot_mrgnRght--25per', 'chtBot_bgClr--lghtBlue',
                    'chtBot_brdrRdTpLft--15px', 'chtBot_brdrRdTpRght--15px', 'chtBot_brdrRdBtmRght--15px'
                ]
            }
        ]
    },{
        name: 'loader',
        type: 'p',
        attrs: [
            {
                name: 'id',
                val: 'msg_loader_animation'
            },{
                name: 'class',
                val: ['chtBot_anim8--type', 'chtBot_flt--left']
            }
        ]
    },{
        name: 'span',
        type: 'span',
        text: '•'
    },{
        name: 'botMsgNode',
        type: 'p',
        attrs: [
            {
                name: 'class',
                val: [
                    'chtBot_mxWdth--85per', 'chtBot_flt--left', 'chtBot_mrgnAll--2per',
                    'chtBot_mrgnRght--25per', 'chtBot_bgClr--lghtBlue', 'chtBot_brdrRdTpLft--15px',
                    'chtBot_brdrRdTpRght--15px', 'chtBot_brdrRdBtmRght--15px', 'chtBot_lineHght--1pt5',
                    'chtBot_pddBtm--5px', 'chtBot_pddTp--10px', 'chtBot_pddRgt--15px', 'chtBot_pddLft--15px'
                ]
            }
        ]
    },{
        name: 'msgWrap',
        type: 'div',
        attrs: [
            {
                name: 'class',
                val: ['chtBot_wdth--100per', 'chtBot_flt--left']
            }
        ]
    },{
        name: 'userMsgNode',
        type: 'p',
        attrs: [
            {
                name: 'class',
                val: [
                    'chtBot_mxWdth--85per', 'chtBot_txtAlgn--right', 'chtBot_flt--right', 'chtBot_dsply--block',
                    'chtBot_mrgnAll--2per', 'chtBot_mrgnRght--4per', 'chtBot_mrgLft--25per', 'chtBot_bgClr--lghtBlue',
                    'chtBot_lineHght--1pt5', 'chtBot_pddBtm--5px', 'chtBot_pddTp--10px', 'chtBot_pddRgt--15px',
                    'chtBot_pddLft--15px', 'chtBot_brdrRdTpLft--15px', 'chtBot_brdrRdTpRght--15px',
                    'chtBot_brdrRdBtmLft--15px'
                ]
            }
        ]
    },{
        name: 'msgTimestamp',
        type: 'p',
        attrs: [
            {
                name: 'class',
                val: [
                    'chtBot_fntSz--9px', 'chtBot_txtClr--gray'
                ]
            }
        ]
    }
];

var elemDictionary = {
    styleSheetLink: null,
    axiosScript: null,
    anchorMeScript: null,
    chatStartBtn: null,
    chatWrap: null,
    chatHeader: null,
    chatHeaderIconWrap: null,
    chatHeaderIcon: null,
    chatHeaderTxtWrap: null,
    chatHeaderTxtTitle: null,
    chatHeaderTxt: null,
    headerCloseBtn: null,
    chatDialog: null,
    userInput: null,
    txtAreaWrap: null,
    loaderWrap: null,
    loader: null,
    span: null,
    botMsgNode: null,
    msgWrap: null,
    userMsgNode: null,
    msgTimestamp: null
};

function createElem(elemObj, document, elemDictionary) {
    var currElem = document.createElement(elemObj.type);

    if(!!elemObj.attrs && elemObj.attrs.length > 0) {
        elemObj.attrs.forEach(function(attr) {
            if(Array.isArray(attr.val)) {
                var completeVal = attr.val.join(' ');
                currElem.setAttribute(attr.name, completeVal);
            } else if(typeof attr.val === 'string') {
                currElem.setAttribute(attr.name, attr.val)
            }
        });
    }

    if(!!elemObj.text) {
        var currElemTxt = document.createTextNode(elemObj.text);
        currElem.appendChild(currElemTxt);
    }

    if(!!elemDictionary && !elemDictionary[elemObj.name]) {
        elemDictionary[elemObj.name] = currElem;
    }
}

function handleBotResponse(
    response,
    document,
    botMsgNodeClone,
    msgTimestamp,
    anchorme,
    msgWrapClone,
    msgCounter
) {
    var dialog = document.getElementById('dialog');
    globalContext = response.data.context;
    document.getElementById('msg_loader_wrap').classList.add('chtBot_dsply--hidden');
    document.getElementById('msg_loader_animation').classList.add('chtBot_dsply--hidden');
    botMsgNodeClone.innerHTML += anchorme(response.data.output.text[0]);
    msgTimestamp.innerHTML += new Date().toLocaleTimeString();
    botMsgNodeClone.appendChild(msgTimestamp);
    msgWrapClone.classList.add('msgNo' + msgCounter);
    msgWrapClone.appendChild(botMsgNodeClone);
    dialog.appendChild(msgWrapClone);
    dialog.scrollTop = dialog.scrollHeight - document.getElementsByClassName('msgNo' + msgCounter)[0].scrollHeight;
    document.getElementById("user_input").focus();
}

function handleUserMessage(userInputVal, userMsgNodeClone, msgTimestamp, msgWrapClone, loaderWrap, msgCounter) {
    var dialog = document.getElementById('dialog');
    var userInput = document.getElementById('user_input');
    userMsgNodeClone.appendChild(document.createTextNode(userInputVal));
    msgWrapClone.classList.add('msgNo' + msgCounter);
    msgTimestamp.innerHTML += new Date().toLocaleTimeString();
    userMsgNodeClone.appendChild(msgTimestamp);
    msgWrapClone.appendChild(userMsgNodeClone);
    dialog.appendChild(msgWrapClone);
    dialog.appendChild(loaderWrap);
    document.getElementById('msg_loader_wrap').classList.remove('chtBot_dsply--hidden');
    document.getElementById('msg_loader_animation').classList.remove('chtBot_dsply--hidden');
    dialog.scrollTop = dialog.scrollHeight;
    userInput.value = "";
    userInput.focus();
}

function postMsgWrapper(
    axios,
    anchorme,
    msgTxt,
    msgCounter,
    document,
    botMsgNodeClone,
    msgTimestamp,
    msgWrapClone
) {
    return axios.post(conversationAPIEnpoint, {
        input: {text: msgTxt}, context: globalContext
    }).then(function (response) {
        msgCounter += 1;
        handleBotResponse(
            response,
            document,
            botMsgNodeClone,
            msgTimestamp,
            anchorme,
            msgWrapClone,
            msgCounter
        );
    }).catch(function (error) {
        console.log(error);
    });
}

function msgSendHandler(userInput, msgCounter, elemDictionary, loaderWrap, axios, anchorme, document) {
    var userMessageTxt = userInput.value;

    handleUserMessage(
        userInput.value,
        elemDictionary.userMsgNode.cloneNode(false),
        elemDictionary.msgTimestamp.cloneNode(true),
        elemDictionary.msgWrap.cloneNode(false),
        loaderWrap,
        msgCounter
    );

    postMsgWrapper(
        axios,
        anchorme,
        userMessageTxt,
        msgCounter,
        document,
        elemDictionary.botMsgNode.cloneNode(true),
        elemDictionary.msgTimestamp.cloneNode(true),
        elemDictionary.msgWrap.cloneNode(false)
    );
}

document.addEventListener('DOMContentLoaded', function() {

    var msgCounter = 0;

    elemList.forEach(function(elem) {
        createElem(elem, document, elemDictionary);
    });

    document.head.appendChild(elemDictionary.axiosScript.cloneNode(true));
    document.head.appendChild(elemDictionary.anchorMeScript.cloneNode(true));
    document.head.appendChild(elemDictionary.styleSheetLink.cloneNode(true));
    document.body.appendChild(elemDictionary.chatStartBtn.cloneNode(true));

    var initChatBtn = document.getElementById("initiate_chat_bot_btn");

    initChatBtn.addEventListener('click', function () {
        var chatWrap = elemDictionary.chatWrap.cloneNode(true);
        var header = elemDictionary.chatHeader.cloneNode(true);
        var chatHeaderIconWrap = elemDictionary.chatHeaderIconWrap.cloneNode(true);
        var chatHeaderTxtWrap = elemDictionary.chatHeaderTxtWrap.cloneNode(true);
        var dialog = elemDictionary.chatDialog.cloneNode(true);
        var userInput = elemDictionary.userInput.cloneNode(true);
        var txtAreaWrap = elemDictionary.txtAreaWrap.cloneNode(true);
        var loaderWrap = elemDictionary.loaderWrap.cloneNode(true);
        var loader = elemDictionary.loader.cloneNode(true);

        initChatBtn.classList.add('chtBot_dsply--hidden');
        txtAreaWrap.appendChild(userInput);
        loader.appendChild(elemDictionary.span.cloneNode(true));
        loader.appendChild(elemDictionary.span.cloneNode(true));
        loader.appendChild(elemDictionary.span.cloneNode(true));
        header.appendChild(elemDictionary.headerCloseBtn.cloneNode(true));
        chatHeaderIconWrap.appendChild(elemDictionary.chatHeaderIcon.cloneNode(true));
        header.appendChild(chatHeaderIconWrap);
        chatHeaderTxtWrap.appendChild(elemDictionary.chatHeaderTxtTitle.cloneNode(true));
        chatHeaderTxtWrap.appendChild(elemDictionary.chatHeaderTxt.cloneNode(true));
        header.appendChild(chatHeaderTxtWrap);
        loader.classList.remove('chtBot_dsply--hidden');
        loaderWrap.appendChild(loader);
        dialog.appendChild(loaderWrap);
        chatWrap.appendChild(header);
        chatWrap.appendChild(dialog);
        chatWrap.appendChild(txtAreaWrap);
        document.body.appendChild(chatWrap);

        document.getElementById('hdr_close_btn').addEventListener('click', function () {
            initChatBtn.classList.remove('chtBot_dsply--hidden');
            if(!!dialog) {
                while (dialog.firstChild) {
                    dialog.removeChild(dialog.firstChild);
                }
            }
            if(!!chatWrap && !!chatWrap.parentNode) {
                chatWrap.parentNode.removeChild(chatWrap);
            }
        });

        postMsgWrapper(
            axios,
            anchorme,
            'Hi',
            msgCounter,
            document,
            elemDictionary.botMsgNode.cloneNode(true),
            elemDictionary.msgTimestamp.cloneNode(true),
            elemDictionary.msgWrap.cloneNode(false)
        );

        userInput.addEventListener('keypress', function (e) {
            if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                msgCounter += 1;
                msgSendHandler(userInput, msgCounter, elemDictionary, loaderWrap, axios, anchorme, document);
            }
        });
    });
});
