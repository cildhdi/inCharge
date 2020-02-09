import Taro from '@tarojs/taro';

const domin = 'https://ic.cildhdi.cn/api';

const apis = {
    login: domin + '/auth/login POST U',
    getUserInfo: domin + '/user/info POST A',
    updateUserInfo: domin + '/user/update POST A',

    getStoreInfo: domin + '/store/info POST A',
    updateStoreInfo: domin + '/store/update POST A',
};

export const errors = {
    Ok: 0,
    ParamError: 1,
    DatabaseError: 2,
    Unauthorized: 3
};

const makeHeader = () => {
    const token = Taro.getStorageSync('token');
    if (token && token.length !== 0) {
        return {
            'Authorization': `Bearer ${token}`
        };
    } else {
        return {};
    }
}

export const mRequest = (apiUrl, data) => {
    const [url, method, needAuth] = apiUrl.split(' ');
    let header = {};
    if (needAuth && needAuth.startsWith('A')) {
        header = makeHeader();
    }
    return new Promise((resolve, reject) => {
        Taro.request({
            url: url,
            method: method,
            header: header,
            dataType: 'json',
            data: data,
            success: (res) => {
                if (res.statusCode == 200 && res.data) {
                    resolve(res.data);
                    console.log(res.data);
                } else {
                    reject();
                }
            },
            fail: reject
        })
    });
}

export const login = async({
    code //*
} = {}) => {
    const data = await mRequest(apis.login, {
        code: code
    });
    if (data.token) {
        return data.token;
    } else {
        throw Error('login failed');
    }
}

export const getUserInfo = async({
    id
} = {}) => {
    return await mRequest(apis.getUserInfo, {
        id
    });
}

export const updateUserInfo = async({
    id,
    name,
    sex,
    nation,
    politic,
    phone,
    storeID,
    job,
} = {}) => {
    return await mRequest(apis.updateUserInfo, {
        id,
        name,
        sex,
        nation,
        politic,
        phone,
        storeID,
        job,
    });
}