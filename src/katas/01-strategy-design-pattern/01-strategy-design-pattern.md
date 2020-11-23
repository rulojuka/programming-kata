# O padrão de projeto Strategy

## Propósito:

Segundo [o Refactoring Guru][refactoring-guru] "O Strategy é um padrão de projeto comportamental que permite que você defina uma família de algoritmos, coloque-os em classes separadas, e faça os objetos deles intercambiáveis."

## O cenário:

Você está implementando a regra de negócios para a inscrição de um novo usuário na sua aplicação. Esses usuários podem fazer parte de um desses dois grupos: **administrador (admin)** ou **usuário padrão (user)**

A regra de validação de senha do **user** é mais simples e consiste de

1. 8 ou mais caracteres (limite 256 caracteres)

A regra de validação de senha do **admin** é mais complexa e consiste de

1. 16 ou mais caracteres (limite 256 caracteres)
1. Pelo menos um caracter não alfanumérico [^a-zA-Z0-9]

A decisão de qual grupo um usuário será adicionado é feita baseada no seu email. Todo usuário com email pertencente ao `meudominio.com` será um administrador. Portanto a escolha da regra de validação será feita em tempo de execução, baseada nessa informação dada pelo usuário.

## O Kata:

Implemente essa validação utilizando o padrão de projeto Strategy.

Entrada: Um objeto que contém um campo de email (string) e um campo de senha (string)

Saída: Um valor booleano que indica se a senha escolhida é valida ou não.

Alguns casos de teste de exemplo:

`{"email":"usermeudominio.com@email.com", "senha":"1234"}` => `false`

`{"email":"admin@meudominio.com", "senha":"%HJYVl|PoA+z.rd="}` => `true`

## Testes automatizados em Typescript

```typescript
interface Input {
  email: string,
  password: string
}
interface Output {
  value: boolean
}
interface TestCase {
  input: Input
  output: Output
}
const testCases: TestCase[] = [
  { input: { email: "usermeudominio.com@email.com", password: "1234" }, output: { value: false } },
  { input: { email: "admin@meudominio.com", password: "%HJYVl|PoA+z.rd=" }, output: { value: true } }
]
testCases.forEach(testCase => {
  const modelo = new SignUpModel(testCase.input.email, testCase.input.password)
  const validacao = modelo.validate()
  console.log(`Validando testCase: (${testCase.input.email}),(${testCase.input.password})`)
  console.log(`Valor esperado: ${testCase.output.value}`)
  console.log(`Valor obtido: ${validacao}`)
  console.log("")
  assert(validacao === testCase.output.value)
})
console.log("Kata implementado com sucesso!")
```

## Passo a passo sem código

1. Crie uma classe `SignUpModel`

1. Adicione à esse classe os atributos `email` e `password`

1. Adicione também à essa classe um atributo `validationStrategy` que representará a estratégia de validação decidida em tempo de execução.

1. O construtor do `SignUpModel` receberá na sua construção os dados de email e senha. Baseando-se nesses dados, defina a estratégia a ser utilizada.

1. Para finalizar essa classe, crie um método `.validate()` que chama a `validationStrategy.validatePassword(password)`

1. Crie a interface `ValidationStrategy` com apenas um método: `validatePassword(password)`

1. Crie duas classes que implementam a interface `ValidationStrategy`: a `AdminValidationStrategy` e a `UserValidationStrategy`. Cada uma delas deve conter a implementação do método `.validatePassword(password)` equivalente ao seu uso.

## Implementação com código TypeScript

```typescript
class SignUpModel {
  email: string
  password: string
  validationStrategy: ValidationStrategy

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
    if (this.isAdmin(email)) {
      this.validationStrategy = new AdminValidationStrategy()
    } else {
      this.validationStrategy = new UserValidationStrategy()
    }
  }

  isAdmin(email: string): boolean {
    return /@meudominio\.com$/.test(email)
  }

  validate(): boolean {
    return this.validationStrategy.validatePassword(this.password);
  }
}

interface ValidationStrategy {
  validatePassword(password: string): boolean
}

class AdminValidationStrategy implements ValidationStrategy {
  validatePassword(password: string): boolean {
    const has16PlusChars = password.length >= 16
    const has256MinusChars = password.length <= 256
    const hasNonAlphanumericCharacter = /[^a-zA-Z0-9]/.test(password)
    return has16PlusChars && has256MinusChars && hasNonAlphanumericCharacter
  }
}

class UserValidationStrategy implements ValidationStrategy {
  validatePassword(password: string): boolean {
    const has8PlusChars = password.length >= 8
    const has256MinusChars = password.length <= 256
    return has8PlusChars && has256MinusChars
  }
}
```


## Para saber mais

* Implemente uma terceira estratégia de validação. Reflita sobre quais classes/interfaces precisaram ser criadas e/ou alteradas. 

* Altere as regras de validação de uma das estratégias. Reflita sobre quais classes/interfaces precisaram ser criadas e/ou alteradas. 

* Altere a regra de escolha da estratégia. Reflita sobre quais classes/interfaces precisaram ser criadas e/ou alteradas. 


## Notas

* As referências não indicam onde exatamente deve ficar o código que decide qual estratégia será usada. No nosso exemplo, fizemos essa decisão no construtor do `SignUpModel` por motivos de simplicidade e foco no padrão de projeto em si.
* O projeto completo com o código em TypeScript pode ser encontrado nesse mesmo repositório!

## Referências:

* [Refactoring Guru][refactoring-guru]
* GAMMA, Erich. Design patterns: elements of reusable object-oriented software.

[refactoring-guru]: https://refactoring.guru/pt-br/design-patterns/strategy