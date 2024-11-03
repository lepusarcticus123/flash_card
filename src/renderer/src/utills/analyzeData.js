/**
 * 预处理并将大模型返回的数据用正则解析成对象
 *
 * @param {*} text: String
 * @returns {{ word: String; phonetic: String; definitions: []; derivatives: []; common_phrases: []; }}
 */
export const analyzeData = (text) => {
  // 预处理文本：将 <br> 转换为换行符，去掉多余空格
  text = text.replace(/<br>/gi, '').trim()

  // 提取单词和音标
  const word = (text.match(/word:\s*(.*?)\s*phonetic:/i) || [])[1] || ''
  const phonetic = (text.match(/phonetic:\s*(.*?)\s*definitions:/i) || [])[1] || ''

  // 切分主要部分
  const [definitionsPart, derivativesPart, commonPhrasesPart] = text.split(
    /(?=derivatives:|common phrases:)/i
  )

  const definitions = []
  const definitionMatches = definitionsPart.matchAll(
    /part of speech:\s*(.*?)\s*definition:\s*(.*?)\s*example sentence:\s*(.*?)(?=part of speech|$)/gi
  )
  for (const match of definitionMatches) {
    definitions.push({
      part_of_speech: match[1].trim(),
      definition: match[2].trim(),
      example_sentence: match[3].trim()
    })
  }

  const derivatives = []
  if (derivativesPart) {
    const derivativeMatches = derivativesPart.matchAll(
      /term:\s*(.*?)\s*part of speech:\s*(.*?)\s*phonetic:\s*(.*?)\s*definition:\s*(.*?)\s*example sentence:\s*(.*?)(?=term|$)/gi
    )
    for (const match of derivativeMatches) {
      derivatives.push({
        term: match[1].trim(),
        part_of_speech: match[2].trim(),
        phonetic: match[3].trim(),
        definition: match[4].trim(),
        example_sentence: match[5].trim()
      })
    }
  }

  const common_phrases = []
  if (commonPhrasesPart) {
    const commonPhraseMatches = commonPhrasesPart.matchAll(
      /term:\s*(.*?)\s*definition:\s*(.*?)\s*example sentence:\s*(.*?)(?=term|$)/gi
    )
    for (const match of commonPhraseMatches) {
      common_phrases.push({
        term: match[1].trim(),
        definition: match[2].trim(),
        example_sentence: match[3].trim()
      })
    }
  }

  return {
    word,
    phonetic,
    definitions,
    derivatives,
    common_phrases
  }
}
