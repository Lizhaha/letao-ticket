// 返回给前端的数据格式
const resMsg = (status, msg, data) => {
    let mainBody = {
        success: status,
        message: msg
    };
    if (data) mainBody.data = data;
    return mainBody;
}

module.exports = {
    resMsg
};