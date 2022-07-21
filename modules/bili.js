const axios = require('axios').default;
const g = require('./global');

async function bili_up (req, res) {
    const [up_mid, format, file_name] = Object.values(req.params);
    let emoji_dict = g.cache.get('bili:up:' + up_mid)  // 尝试从memory-cache中取数据
    if (emoji_dict === null) {  // 如果memory-cache为空
        await g.r
        emoji_dict = JSON.parse(await g.redis_client.get('bili:up:' + up_mid))  // 然后去redis取数据
        if (emoji_dict === null) {  // 如果redis为空，回源
            let access_key = g.cache.get('token:bili_access_key')  // 尝试从memory-cache获取access_key
            if (access_key === null) {  // 如果memory-cache无access_key，从redis获取
                access_key = await g.redis_client.hGet('token', 'bili-access_key')
                g.cache.put('token:bili_access_key', access_key)  // 将access_key存入memory-cache
            }
            console.log(access_key)
            await axios.get('https://api.bilibili.com/x/emote/live/user/list/v2', {
                'params': {'access_key': access_key, 'up_mid': up_mid, 'build': 6800300, 'business': 'reply', 'mobi_app': 'android'},
                'headers': {'User-Agent': 'Mozilla/5.0 BiliDroid/3.11.0 (bbcallen@gmail.com) os/android model/Mi 10 mobi_app/android_i build/6750200 channel/master innerVer/6750200 osVer/12 network/2'}
            })
                .then(function (res) {
                    emoji_dict = {}
                    if (res.data['data']['list'].length > 0) {  // 如果有数据
                        emoji_dict['status'] = 200
                        emoji_dict['name'] = res.data['data']['list'][0]['panel_desc']
                        emoji_dict['icon'] = res.data['data']['list'][0]['url'].replace('http://', 'https://')
                        for (const el of res.data['data']['list'][0]['emote']) {  // 提取表情名和url
                            emoji_dict[el['text'].replace(/([\[\]])/g, '').replace(/_/g, '-')] = el['url'].replace('http://', 'https://')
                        }
                    }
                    else {
                        emoji_dict['status'] = 404
                    }
                    g.redis_client.set('bili:up:' + up_mid, JSON.stringify(emoji_dict))  // 将数据存入redis
                    g.redis_client.expire('bili:up:' + up_mid, 259200)  // 设置过期时间
                })
        }
        g.cache.put('bili:up:' + up_mid, emoji_dict)  // 将数据存入memory-cache
    }
    if (emoji_dict['status'] === 404) {  // 没有表情统一返回404
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('表情不存在');
        return null
    }
    /* -------------------- 返回信息&重定向部分 -------------------- */
    if (file_name === 'info.json') {  // info.json
        let info = {
            'name': emoji_dict['name'],
            'icon': 'icon',
            'items': Object.keys(emoji_dict).splice(3, Object.keys(emoji_dict).length)  // 去掉前三个属性
        }
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(info));
    }
    else {  // 如果是表情
        if (format === undefined) {  // 如果没有指定格式，则返回默认格式
            res.writeHead(302, {'Location': emoji_dict[file_name], 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=259200'});
            res.end();
        }
        else {  // 如果指定了格式，则返回指定格式
            res.writeHead(302, {'Location': emoji_dict[file_name] + '@' + format, 'Content-Type': 'application/octet-stream', 'Cache-Control': 'public, max-age=259200'});
            res.end();
        }
    }
}

async function bili_live (req, res) {
    res.send('bili_live')
}

module.exports = {
    bili_up,
    bili_live
}