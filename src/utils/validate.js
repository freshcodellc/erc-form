import validator from 'validator'
import isUndefined from 'lodash/isUndefined'
import getDate from 'date-fns/getDate'
import isBefore from 'date-fns/isBefore'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import parse from 'date-fns/parse'
import { STATE_ABBREVIATIONS, STATE_NAMES } from '../constants/stateList'
import { toTitleCase } from './helpers'

export const required = value =>
  value && value.length >= 2 ? undefined : 'Required'
export const email = value =>
  value && validator.isEmail(value) ? undefined : 'Invalid email address'
export const phoneNumber = value =>
  value && !/^\d{3}-\d{3}-\d{4}$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined
export const ccExp = value =>
  value && !/^\d{2}\/\d{2}$/i.test(value)
    ? 'Invalid exp, must be 4 digits'
    : undefined
export const fullName = value =>
  value && !/^[a-zA-Z.'-]{2,50}(?: [a-zA-Z.'-]{2,50})+$/.test(value)
    ? 'Please include first and last name'
    : undefined
export const singleName = value =>
  value && !/^[A-Za-z]/.test(value) ? 'Please include first name' : undefined

const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const creditCard = value =>
  validator.isCreditCard(value) ? 'Invalid credit card number' : undefined
export const cvv = value =>
  !validator.isNumeric(value) && value.length > 4 && value.length < 3
    ? 'Must be a 3 or 4 digit number'
    : undefined
export const minLength6 = minLength(6)
export const zip = value =>
  value && validator.isLength(value, { min: 5, max: 5 })
    ? undefined
    : 'Please use 5 digit US zipcode'
export const normalizePhone = value => {
  if (!value) {
    return value
  }

  let onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.charAt(0) === '1') {
    onlyNums = onlyNums.slice(1)
  }

  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
  }
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`
}

export const normalizeExp = value => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.length <= 2) {
    return onlyNums
  }

  return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`
}

export const validateExp = value => {
  if (!isUndefined(value)) {
    const dateArray = value.split('/') || ['0', '0']
    const [month, year] = dateArray
    if (dateArray.length === 2) {
      if (month && year && month.length > 1 && year.length > 1) {
        let dayToday = getDate(new Date())
        if (dayToday > 28) {
          dayToday = 28
        }
        const dateString = `${dateArray[0]}/${dayToday}/${dateArray[1]}`
        const expDate = parse(dateString, 'MM/dd/yy', new Date())
        return isBefore(new Date(), expDate)
      }
    }
  }
  return true
}

export const validateState = value => {
  if (isUndefined(value)) return true
  return (
    STATE_NAMES.includes(toTitleCase(value)) ||
    STATE_ABBREVIATIONS.includes(value.toUpperCase())
  )
}

export const validateDate = function validateDate(value) {
  if (!isUndefined(value)) {
    let finalDate = new Date('')
    if (value.indexOf('-') > -1) {
      finalDate = parseISO(value)
    }
    if (value.indexOf('/') > -1) {
      finalDate = parse(value, 'MM/dd/yyyy', new Date())
    }
    return isValid(finalDate)
  }
  return true
}

export const validateFullName = function(value) {
  const cleanedValue = value || ''
  const nameArray = cleanedValue.split(' ')
  if (
    nameArray.length > 1 &&
    nameArray[0].length > 2 &&
    nameArray[1].length > 2
  ) {
    return true
  }
  return false
}
