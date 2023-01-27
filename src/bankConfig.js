import seattleLogo from './images/logos/seattle-bank-logo.png'
import titanLogo from './images/logos/titan-bank-logo.png'

const BANKS = {
  cares: {
    active: true,
    forgiveness: false,
    erc: true,
    limitEarlyForgiveness: false,
    logo: null,
    id: 'seattle',
    name: 'CARES Act SMB',
    email: 'admin@caresactsmb.com',
    address: '',
    contactUrl: 'https://www.caresactsmb.com/',
    referralUrl: '',
    includeChat: true,
    hasMinimumLoanAmount: true,
    minimumLoanAmount: 35000,
    limitSoleProps: true,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  solera: {
    active: true,
    forgiveness: false,
    erc: true,
    limitEarlyForgiveness: false,
    logo: null,
    id: 'solera',
    name: 'Solera National Bank',
    email: 'ops@solerabank.com',
    address: '319 S Sheridan Blvd. Lakewood, CO 80226',
    contactUrl: 'https://www.solerabank.com/',
    referralUrl:
      'https://partner.kabbage.com/sba-solera-national-bank?refid=soleranationalbank&utm_medium=partners&utm_source=soleranationalbank&utm_campaign=funding-sba-ppp_20200421_email',
    includeChat: true,
    hasMinimumLoanAmount: true,
    minimumLoanAmount: 35000,
    limitSoleProps: true,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  soleraLocked: {
    active: false,
    forgiveness: false,
    limitEarlyForgiveness: false,
    password: 'round2',
    logo: null,
    id: 'solera',
    name: 'Solera National Bank',
    email: 'ops@solerabank.com',
    address: '319 S Sheridan Blvd. Lakewood, CO 80226',
    contactUrl: 'https://www.solerabank.com/',
    referralUrl:
      'https://partner.kabbage.com/sba-solera-national-bank?refid=soleranationalbank&utm_medium=partners&utm_source=soleranationalbank&utm_campaign=funding-sba-ppp_20200421_email',
    includeChat: true,
    hasMinimumLoanAmount: false,
    minimumLoanAmount: 0,
    limitSoleProps: false,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  soleraBankLocked: {
    active: true,
    forgiveness: false,
    limitEarlyForgiveness: false,
    password: 'vicktor',
    logo: null,
    id: 'solera',
    name: 'Solera National Bank',
    email: 'ops@solerabank.com',
    address: '319 S Sheridan Blvd. Lakewood, CO 80226',
    contactUrl: 'https://www.solerabank.com/',
    referralUrl:
      'https://partner.kabbage.com/sba-solera-national-bank?refid=soleranationalbank&utm_medium=partners&utm_source=soleranationalbank&utm_campaign=funding-sba-ppp_20200421_email',
    includeChat: true,
    hasMinimumLoanAmount: false,
    minimumLoanAmount: 0,
    limitSoleProps: false,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  soleraforgives: {
    active: false,
    forgiveness: true,
    limitEarlyForgiveness: false,
    logo: null,
    id: 'solera',
    name: 'Solera National Bank',
    email: 'ppp@solerabank.com',
    address: '319 S Sheridan Blvd. Lakewood, CO 80226',
    contactUrl: 'https://www.solerabank.com/',
    referralUrl:
      'https://partner.kabbage.com/sba-solera-national-bank?refid=soleranationalbank&utm_medium=partners&utm_source=soleranationalbank&utm_campaign=funding-sba-ppp_20200421_email',
    includeChat: true,
    hasMinimumLoanAmount: true,
    minimumLoanAmount: 35000,
    limitSoleProps: true,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  seattle: {
    active: false,
    forgiveness: false,
    limitEarlyForgiveness: true,
    logo: seattleLogo,
    id: 'seattle',
    name: 'Seattle Bank',
    email: 'clientdesk@seattlebank.com',
    includeChat: true,
    address: '600 University Street, Suite 1850 Seattle, WA 98101',
    contactUrl: 'https://www.seattlebank.com/about-us/contact-us.html',
    referralUrl:
      'https://partner.kabbage.com/sba-seattle-bank?refid=seattlebank&utm_medium=partners&utm_source=seattlebank&utm_campaign=funding-sba-ppp_20200420_email',
    hasMinimumLoanAmount: true,
    minimumLoanAmount: 50000,
    limitSoleProps: true,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  seattleLocked: {
    active: true,
    forgiveness: false,
    limitEarlyForgiveness: true,
    password: 'pppclose',
    logo: seattleLogo,
    id: 'seattle',
    name: 'Seattle Bank',
    email: 'clientdesk@seattlebank.com',
    includeChat: true,
    address: '600 University Street, Suite 1850 Seattle, WA 98101',
    contactUrl: 'https://www.seattlebank.com/about-us/contact-us.html',
    referralUrl:
      'https://partner.kabbage.com/sba-seattle-bank?refid=seattlebank&utm_medium=partners&utm_source=seattlebank&utm_campaign=funding-sba-ppp_20200420_email',
    hasMinimumLoanAmount: false,
    minimumLoanAmount: 50000,
    limitSoleProps: false,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  seattleforgives: {
    active: false,
    forgiveness: true,
    limitEarlyForgiveness: true,
    logo: seattleLogo,
    id: 'seattle',
    name: 'Seattle Bank',
    email: 'ppphelp@seattlebank.com',
    includeChat: true,
    address: '600 University Street, Suite 1850 Seattle, WA 98101',
    contactUrl: 'https://www.seattlebank.com/about-us/contact-us.html',
    referralUrl:
      'https://partner.kabbage.com/sba-seattle-bank?refid=seattlebank&utm_medium=partners&utm_source=seattlebank&utm_campaign=funding-sba-ppp_20200420_email',
    hasMinimumLoanAmount: true,
    minimumLoanAmount: 50000,
    limitSoleProps: true,
    showRiskQuestions: true,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
  titan: {
    active: true,
    forgiveness: false,
    limitEarlyForgiveness: true,
    logo: titanLogo,
    id: 'titan',
    name: 'Titan Bank',
    email: 'bwoodard@titanbank.com',
    address: '1701 E Hubbard Street. Mineral Wells, TX 76067',
    contactUrl: 'http://titanbank.com/contact',
    referralUrl: 'https://kabbage.com',
    includeChat: false,
    hasMinimumLoanAmount: false,
    minimumLoanAmount: 1,
    limitSoleProps: true,
    showRiskQuestions: false,
    docs: {
      independent: [],
      'sole-proprietorship': [
        { name: `Owner’s SSN or Business’ EIN`, slug: 'owner-ssn-bin' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'general-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-partnership': [
        {
          name: 'Partnership Agreement',
          description: `If available, general partnerships do not require a written partnership agreement.`,
          slug: 'partnership-agreement',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      'limited-liability-company': [
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
        {
          name:
            'LLC (Operating) Agreement naming managing members for banking purposes',
          slug: 'llc-operating-agreement',
        },
      ],
      corporation: [
        {
          name: 'Articles of Incorporation filed with the Secretary of State',
          slug: 'articles-of-incorporation',
        },
        {
          name: 'Business License filed with the state',
          slug: 'business-license',
        },
      ],
      'non-profit-corporation': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name:
            'Tax Exemption Letter (501c3 filing states) or Business license filed with State (<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document)',
          slug: 'tax-exemption-letter',
        },
      ],
      'association-social-club': [
        {
          name:
            'By-Laws, Charter, or Meeting Minutes naming officers or representatives',
          slug: 'by-laws',
        },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
      iolta: [
        { name: 'IOLTA Enrollment Form', slug: 'iolta-enrollment-form' },
        {
          name: 'Law firm’s business license',
          slug: 'law-firm-business-license',
        },
      ],
      'political-campaign-accounts': [
        { name: 'C-3 Disclosure', slug: 'c-3-disclosure' },
        {
          name: `Business license filed with State`,
          description: `<a href="https://www.caresactsmb.com/legal-documentation" target="_blank" rel="noopener noreferrer">Click here</a> for help finding this document`,
          slug: 'business-license',
        },
      ],
    },
    docsOptions: [
      { label: 'Individual/Contractor', value: 'independent' },
      { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
      { label: 'General Partnership', value: 'general-partnership' },
      { label: 'Limited Partnership', value: 'limited-partnership' },
      {
        label: 'Limited Liability Partnership (LLP)',
        value: 'limited-liability-partnership',
      },
      {
        label: 'Limited Liability Company (LLC)',
        value: 'limited-liability-company',
      },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Corporation', value: 'non-profit-corporation' },
      { label: 'Association or Social Club', value: 'association-social-club' },
      {
        label: 'Interest on Lawyer’s Trust (IOLTA)',
        value: 'iolta',
      },
      {
        label: 'Political Campaign Accounts',
        value: 'political-campaign-accounts',
      },
    ],
  },
}

const getBankConfig = () => {
  const bankKey = process.env.REACT_APP_BANK || 'solera'
  return BANKS[bankKey]
}

export default getBankConfig
