import PropTypes from 'prop-types'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Heading from '../ui/heading'
import getBankConfig from '../../bankConfig'

const EsignDoc = ({ email }) => {
  const bank = getBankConfig()
  const doc = css`
    padding: 16px;

    & p {
      margin: 16px 0;
    }

    & ul {
      margin-left: 36px;
    }
  `
  return (
    <div css={doc}>
      <Heading size="1">FEDERAL E-SIGN ACT DISCLOSURE AND AGREEMENT</Heading>
      <p>
        <i>
          This electronic transaction disclosure, consent, and agreement
          (collectively, the agreement) contains important information that you
          are entitled to receive before you consent to receive electronic
          records. Please read this agreement carefully and download, save
          and/or print a copy for your files.
        </i>
      </p>

      <p>
        {bank.name} may occasionally be required by law to provide you, the
        signer(s) of this agreement, with certain written notices or
        disclosures. This agreement discloses certain information to you that we
        are required to provide before obtaining your consent to receive such
        legally required notices and disclosures by electronic means. This
        agreement also obtains your consent to electronically receive such
        legally required notices and disclosures (i.e., “required information”)
        in a matter that reasonably demonstrates your ability to access and
        retain the required information.
      </p>

      <Heading size="5">
        Types of Required Information Provided by Electronic Means; Accessing
        and Retaining Information
      </Heading>
      <p>
        In conjunction with the processing of any loan transaction in which you
        participate with us, we will provide or make required information
        available to you in PDF format. To access and retain required
        information, you will need the following:
      </p>
      <ul>
        <li>
          A personal computer or other device which is capable of accessing the
          internet.
        </li>
        <li>
          An e-mail account with an internet service provider and e-mail
          software.
        </li>
        <li>
          PDF reader: Adobe Reader or similar software may be required to view
          and print PDF files. You may download the most current version of the
          software identified above by going to www.adobe.com.
        </li>
        <li>
          A printer (for printed copies) or a working hard drive or other
          storage device (to store electronic copies).
        </li>
      </ul>
      <p>
        These technical requirements are subject to change. If they change, you
        will be provided with an updated version of this agreement and asked to
        provide us with your consent in a manner that reasonably demonstrates
        your ability to receive notices and disclosures under the new technical
        requirements.
      </p>
      <Heading size="5">
        How to Obtain Paper Copies of Required Information
      </Heading>
      <p>
        You may request a free paper copy of required information we have
        electronically provided or made available to you at any time by
        contacting us as set out below. Additionally, you may download and print
        any required information we send you through any Bank system.
      </p>
      <Heading size="5">Our Option to Send Paper</Heading>
      <p>
        Your consent does not mean that we must provide the required information
        electronically. We may, at our option, deliver required information and
        other communications to you on paper should we choose to do so. We may
        also require that certain communications from you be delivered to us on
        paper at a specified address.
      </p>
      <Heading size="5">Withdrawing Your Consent</Heading>
      <p>
        If, after you have consented to receive the required information
        electronically, you decide that you wish to receive the required
        information in paper format only, you may withdraw your previously
        provided consent by contacting us as set out below.
      </p>
      <Heading size="5">Informing Us of Your Current Email Address</Heading>
      <p>
        You are responsible for providing us with a working individual email
        address to which we can send required information and for ensuring that
        it is kept current in our files. Please inform us each time you change
        your email address by contacting us as set out below.
      </p>
      <Heading size="5">How to Contact {bank.name}</Heading>
      <p>
        In each instance, you may contact us by written request at{' '}
        {bank.address}, by email at {bank.email} or by phone at (303) 209-8600.
      </p>
      <Heading size="5">Important Notice</Heading>
      <p>
        You understand that the information you have elected to receive is
        confidential in nature. We are not responsible for unauthorized access
        by third parties to information and/or communications provided
        electronically nor any damages, including direct, indirect, special,
        incidental or consequential damages caused by any unauthorized access.
        We are not responsible for delays in the transmission of any
        information. We are not responsible for any computer virus or related
        problems.
      </p>
      <Heading size="5">Consent and Agreement</Heading>
      <p>
        By signing below, you certify that: (i) you have read and understand
        this agreement, (ii) you can print on paper or electronically save this
        agreement for your future reference, (iii) you consent to receive the
        required information by the electronic means described above, (iv) you
        acknowledge that you are providing your consent to receive electronic
        communications pursuant to the Electronic Signatures in Global and
        National Commerce Act and intend that this statute applies to the
        fullest extent possible, and (v) you have provided a working individual
        email address which is {email}.
      </p>
    </div>
  )
}

EsignDoc.propTypes = {
  email: PropTypes.string,
}
EsignDoc.defaultProps = {
  email: '',
}

export default EsignDoc
