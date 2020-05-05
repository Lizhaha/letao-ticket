let setTokenToCookie = (value) => {
    var Days = 1; //此 cookie 将被保存 30 天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = 'my_token =' + escape(value) + ';expires=' + exp.toGMTString();
}

let getCookie = (name) => {
    var cookieValue = '';
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return cookieValue;
}

let clearCookie = () => {
    setTokenToCookie("");
}

export default {
    setTokenToCookie,
    getCookie,
    clearCookie
};