/**
 * 最大并发数 max
 * 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * 所有请求完成之后，按照 urls 的顺序依次打印结果
 * @param {array} urls
 * @param {number} max
 */
const multipleRequest = (urls = [], max = 0) => {
  return new Promise((resolve, reject) => {
    if (urls.length === 0) {
      resolve([])
      return
    }
    const results = Array(urls.length)
    let cur = -1
    let count = 0

    const next = () => {
      if (cur >= urls.length) {
        return
      }
      // 用一个闭包记住当前请求 url 在 urls 数组中的下标
      // 在请求完成后把结果放到 results 的对应位置中
      const cb = ((index) => (results, data) => (results[index] = data))(cur)
      testFetch(urls[cur])
        .then((data) => cb(results, data))
        .catch((err) => cb(results, err))
        .finally(() => {
          // 有请求完成后，继续下一个请求
          ++cur < urls.length && next()
          // count 用来记录已完成的请求数
          ++count === urls.length && resolve(results)
        })
    }

    // 先按照最大并发数 max 发起请求
    // cur 记录的是当前请求 url 在 urls 数组中的下标
    for (let i = 0; i < max; i++) {
      cur++
      next()
    }
  })
}

/**
 * 模拟网络请求
 * @param url
 */
const testFetch = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(`success-${url}`)
      } else {
        reject(`error-${url}`)
      }
    }, Math.random() * 100 * 1000)
  })
}
// test
multipleRequest(
  Array(100)
    .fill(0)
    .map((n, i) => i),
  100
).then((data) => {
  console.log(data.every((s, i) => s.match(/\d+/)[0] == i))
})
