import { Customer as PersistenceCustomer } from '@prisma/client'
import { Customer } from '../domain/customer'
import { Email } from '@core/domain/props/email'
import { Password } from '@core/domain/props/password'

export class CustomerMapper {
  static toDomain(raw: PersistenceCustomer): Customer {
    const email = Email.create(raw.email)
    const password = Password.create(raw.password)

    if (email.isLeft()) {
      return null
    }

    if (password.isLeft()) {
      return null
    }

    const customer = Customer.create(
      {
        name: raw.name,
        email: email.value,
        password: password.value,
        remember_me: raw.remember_me,
      },
      raw.id
    )

    if (customer.isLeft()) {
      return null
    }

    return customer.value
  }

  static async toPersistence(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email.value,
      password: await customer.password.getHashedValue(),
      remember_me: customer.rememberMe,
    }
  }
}
