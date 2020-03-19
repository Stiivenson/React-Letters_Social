export function sendText (text){ //Отпраляем инфу об ошибке в хранилище
    return{
        //Передаем тип ошибки, саму ошибку и инфу о ней
        type: 'SEND_TEXT',
        text
    };
}