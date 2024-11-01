/**
 * 将大模型返回的数据用正则解析成对象
 *
 * @param {*} data:String
 * @returns {{ word: String; phonetic: String; definitions: {}; derivatives: {}; }}
 */
export const analyzeData = (data) => {
  const word = data.match(/word: (.*?)<br>/)[1].trim()
  const phonetic = data.match(/phonetic: (.*?)<br>/)[1].trim()

  // Definitions
  const definitions = []
  const definitionMatches = [
    ...data.matchAll(
      /part of speech: (\w+)<br>\s*definition: (.*?)<br>\s*example sentence: (.*?)(?=<br>\s*part of speech|<br>derivatives|$)/gs
    )
  ]
  for (const match of definitionMatches) {
    definitions.push({
      part_of_speech: match[1],
      definition: match[2].trim(),
      example_sentence: match[3].trim()
    })
  }

  // Derivatives
  const derivatives = []
  const derivativeMatches = [
    ...data.matchAll(
      /term: (.*?)<br>\s*part of speech: (\w+ \w+|\w+)<br>\s*phonetic: (.*?)<br>\s*definition: (.*?)<br>\s*example sentence: (.*?)(?=<br>\s*term|<br>|$)/gs
    )
  ]
  for (const match of derivativeMatches) {
    derivatives.push({
      term: match[1].trim(),
      part_of_speech: match[2].trim(),
      phonetic: match[3].trim(),
      definition: match[4].trim(),
      example_sentence: match[5].trim()
    })
  }

  return {
    word,
    phonetic,
    definitions,
    derivatives
  }
}
