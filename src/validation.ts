interface ValidationConfig {
  name?: string
  isRequired?: boolean
  regex?: RegExp
  callback?: (input: string) => string
}

// eslint-disable-next-line no-control-regex, regexp/no-dupe-characters-character-class
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\v\f\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\v\f\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)\.){3}(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\v\f\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\v\f\x0E-\x7F])+)\])/
const PHONE_NUMBER_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/

export function validateName(input: string): string {
  return validate(input, {
    name: 'name',
    isRequired: true,
  })
}

export function validateDateOfBirth(input: string): string {
  const fieldName = 'date of birth'

  const validationCb = (dateInput: string) => {
    const date = new Date(dateInput)
    const currDate = new Date()

    return date > currDate ? `The ${fieldName} should be from past` : ``
  }

  return validate(input, {
    name: fieldName,
    isRequired: true,
    callback: validationCb,
  })
}

export function validateEmail(input: string): string {
  return validate(input, {
    name: 'email',
    isRequired: true,
    regex: EMAIL_REGEX,
  })
}

export function validatePhoneNumber(input: string): string {
  return validate(input, {
    name: 'phone number',
    isRequired: true,
    regex: PHONE_NUMBER_REGEX,
  })
}

function validate(input: string, config: ValidationConfig): string {
  const fieldName = config.name ?? 'field'

  if (config.isRequired && input === '') {
    return `The ${fieldName} is required`
  }
  if (config.regex && !config.regex.test(input)) {
    return `Invalid ${fieldName} format`
  }
  if (!config.callback) {
    return ''
  }
  return config.callback(input)
}
