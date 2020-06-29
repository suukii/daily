/**
 * TODO:
 * babel 不支持解析将 const 作为变量名的代码，可以尝试换成低版本的 babel 试试
 * 已实现：记录函数调用栈
 * 未实现：替换变量名，不知道怎么实现了
 */

const code = `
  var let = 1
  let = 2
  function foo() {
    var let = 'haha'
    var cst = 'yoyo'
    let = 'lueluelue'
    return function bar() {
      console.log(let)
    }
  }
`

const substituteNames = ['cst', 'yoyo']

const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const replace = (content, identifier2BeReplaced, substituteNames) => {
  const ast = parser.parse(content, {
    errorRecovery: true
  })

  const scopeStack = []
  scopeStack.top = () => scopeStack[scopeStack.length - 1]
  const activationObjects = {}

  traverse(ast, {
    enter(path) {
      if (path.isProgram() || path.isFunctionDeclaration() || path.isFunctionExpression()) {
        const parentScope = activationObjects[scopeStack.top()]
        scopeStack.push(Symbol('scope'))
        // Initiate an activation object for the current scope.
        // Link it to its parent scope.
        activationObjects[scopeStack.top()] = {
          scopeChain: parentScope
        }
      }
      if (path.isVariableDeclaration()) {
        // Record all declared variables in the current AO.
        const name = path.node.declarations[0].id.name
        const AO = activationObjects[scopeStack.top()]
        AO[name] = true
      }
    },
    exit(path) {
      if (path.isFunctionDeclaration()) {
        const variableDeclarations = path.node.body.body.filter((node) => node.type === 'VariableDeclaration')
        variableDeclarations.forEach((el) => {
          el.declarations.forEach((el) => {
            const name = el.id.name
            if (name === identifier2BeReplaced) {
              const AO = activationObjects[scopeStack.top()]

              const success = substituteNames.some((sub) => {
                if (!(sub in AO)) {
                  el.id.name = sub
                  AO[name] = sub
                  return true
                }
              })
              if (!success) {
                throw new Error('All provided substitute names cannot be used.')
              }
            }
          })
        })
      }

      if (path.isProgram() || path.isFunctionDeclaration() || path.isFunctionExpression()) {
        scopeStack.pop()
      }

      if (path.isIdentifier()) {
        if (path.node.name === identifier2BeReplaced) {
          let AO = activationObjects[scopeStack.top()]
          while (!AO && !AO[identifier2BeReplaced]) {
            AO = AO.scopeChain
          }
          if (!AO) throw new Error('Variable not declared.')
          path.node.name = AO[identifier2BeReplaced]
        }
      }
      if (path.isVariableDeclaration()) {
        const name = path.node.declarations[0].id.name
        const AO = activationObjects[scopeStack.top()]

        if (name === identifier2BeReplaced) {
          const success = substituteNames.some((sub) => {
            if (!(sub in AO)) {
              path.node.declarations[0].id.name = sub
              AO[name] = sub
              return true
            }
          })
          if (!success) {
            throw new Error('All provided substitute names cannot be used.')
          }
        }
      }
    }
  })

  const code = babel.transformFromAst(ast, null, {}).code
  console.log(code)
  return code
}

replace(code, 'let', substituteNames)
