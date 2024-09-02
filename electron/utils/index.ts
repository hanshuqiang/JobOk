/**
 * 对象key-v 结构转成&拼接的字符串
 * @param data 对象参数
 * @returns String &拼接的字符串
 */
function objectToFormUrlEncoded(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export { objectToFormUrlEncoded}