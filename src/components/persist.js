import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'formik'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import format from 'date-fns/format'
import { localStore } from '../utils/storage'

class Persist extends Component {
  saveForm = debounce(data => {
    const dataToSave = this.omitIgnoredFields(data)
    const { name } = this.props
    localStore.setItem(name, JSON.stringify(dataToSave))
  }, debounce)

  componentDidMount() {
    const { formik, name } = this.props
    const maybeState = localStore.getItem(name)
    const persistedFormikState = JSON.parse(maybeState)
    const initialValues = get(persistedFormikState, 'values', {})
    const overrides = {}
    const today = format(new Date(), 'yyyy-MM-dd')
    if (name === 'certifications' && initialValues.signatureDate !== today) {
      overrides.signatureDate = today
    }
    const finalInitialState = {
      ...persistedFormikState,
      values: { ...formik.values, ...initialValues, ...overrides },
    }

    if (maybeState && maybeState !== null) {
      formik.setFormikState(finalInitialState)
    }
  }

  componentDidUpdate(prevProps) {
    const { formik } = this.props
    if (!isEqual(prevProps.formik, formik)) {
      this.saveForm(formik)
    }
  }

  omitIgnoredFields = data => {
    const { ignoreFields } = this.props
    const { values, touched, errors } = data
    const finalTouched = { ...touched }
    if (ignoreFields) {
      ignoreFields.forEach(function(field) {
        finalTouched[field] = true
      })
    }
    return ignoreFields
      ? {
          ...data,
          values: omit(values, ignoreFields),
          touched: finalTouched,
          errors,
        }
      : data
  }

  render() {
    return null
  }
}

Persist.propTypes = {
  debounce: PropTypes.func,
  formik: PropTypes.object,
  ignoreFields: PropTypes.array,
  name: PropTypes.string,
  setFormikState: PropTypes.func,
}

Persist.defaultProps = {
  debounce: () => null,
  formik: {},
  ignoreFields: [],
  name: '',
  setFormikState: () => null,
}

export default connect(Persist)
