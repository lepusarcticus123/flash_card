# flash_card

模仿anki pro的一个闪卡软件。主要用来学习英语。使用大模型合成单词信息（包括音标，定义，衍生词和常见词组等）都配备有例句，并且可以AI语音合成读音，并且不限每天复习卡片数。

> A flashcard software that imitates Anki Pro. Mainly used to learn English. Use LLM to synthesize word information (including phonetic symbols, definitions, derivative words and common phrases, etc.), which are equipped with example sentences, and can synthesize pronunciation with AI speech, and there is no limit to the number of cards you can review per day.



## Project Setup

1. Need the responsive external JS file to support this project.

用到的AI合成语音需要自己去网站申请一个API_KEY，非商用免费。

https://responsivevoice.org/

=>Add this to `index.html`

<script src="https://code.responsivevoice.org/responsivevoice.js?key=YOU_API_KEY"></script>

2. 配备的环境变量(.env file)

```js
VERSION=1
API_KEY=智谱api_key 	//https://bigmodel.cn/(新人免费一亿tokens | One hundred million free tokens)
RES_KET=responsive api_key	//https://responsivevoice.org/
```

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
