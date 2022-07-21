# emoji-api
Waline使用

## 覆盖范围
- [x] Bilibili UP主大表情
- [ ] Bilibili 直播间专属表情
- [ ] Bilibili 装扮
- [ ] Discord
- [ ] Twitch
- [ ] YouTube

## 使用
### bilibili UP主大表情
```
/bili/up/<uid>/<format>
```
| 参数     | 说明                             | 是否必要 |
|--------|--------------------------------|------|
| uid    | UP主UID                         | 必要   |
| format | 图片格式化，B站图片@后字符串，[参考链接][format] | 可选   |



[format]:https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/other/picture.md