import assert = require('assert');

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
    console.log("Usando validacao Admin")
    console.log("has16PlusChars", has16PlusChars)
    console.log("has256MinusChars", has256MinusChars)
    console.log("hasNonAlphanumericCharacter", hasNonAlphanumericCharacter)
    return has16PlusChars && has256MinusChars && hasNonAlphanumericCharacter
  }

}

class UserValidationStrategy implements ValidationStrategy {

  validatePassword(password: string): boolean {
    const has8PlusChars = password.length >= 8
    const has256MinusChars = password.length <= 256
    console.log("Usando validacao User")
    console.log("has8PlusChars", has8PlusChars)
    console.log("has256MinusChars", has256MinusChars)
    return has8PlusChars && has256MinusChars
  }

}

// Asserts
// Copie esse pedaço de código e teste a sua implementação!

const emailAdmin = "admin@meudominio.com"
const emailUser = "usermeudominio.com@email.com"
const senha1 = "1234"
const senha2 = "abcd1234"
const senha3 = "1234567890123456"
const senha4 = "qFKBbsN51tv5NbMx"
const senha5 = "%HJYVl|PoA+z.rd="
const senha6 = "b%x+hbeznjbngyzrulbykmkaoddaqdhcfitrnbmjvqavzvikwogsyqalxppvtilsfqoidnqypzdcrgcyjzxwyjwsqqvlhhejwxbaqtfojcdyzmjizhocfvfrkdhkqbhviatylcenitfvuqpjumzvezanmrlqmtkwajypgdorfnozrqachlfoqqlybatpframjquoplmrgbaasfkhdcqjrsedjfkcydzbyxjppefcivatpeantucikronsjfsqbrzmyr"


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
  {
    input: {
      email: emailUser,
      password: senha1
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailUser,
      password: senha2
    },
    output: {
      value: true
    }
  },
  {
    input: {
      email: emailUser,
      password: senha3
    },
    output: {
      value: true
    }
  },
  {
    input: {
      email: emailUser,
      password: senha4
    },
    output: {
      value: true
    }
  },
  {
    input: {
      email: emailUser,
      password: senha5
    },
    output: {
      value: true
    }
  },
  {
    input: {
      email: emailUser,
      password: senha6
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha1
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha2
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha3
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha4
    },
    output: {
      value: false
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha5
    },
    output: {
      value: true
    }
  },
  {
    input: {
      email: emailAdmin,
      password: senha6
    },
    output: {
      value: false
    }
  }
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
