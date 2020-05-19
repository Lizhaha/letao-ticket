// 返回给前端的数据格式
const resMsg = (status, msg, data) => {
    let mainBody = {
        success: status,
        message: msg
    };
    if (data) mainBody.data = data;
    return mainBody;
}

const getTicketCode = (count) => {
    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = '';
    for(let i = 0; i < count; i++) {
        randomCode += letter[Math.floor(Math.random() * 36)];
    }
    return randomCode;
}

module.exports = {
    resMsg,
    getTicketCode
};