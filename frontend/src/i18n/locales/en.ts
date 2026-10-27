import type fr from './fr'

// Le type garantit que l'anglais contient exactement les mêmes clés que le français
const en: typeof fr = {
  common: {
    loading: 'Loading…',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    edit: 'Edit',
    delete: 'Delete',
    logout: 'Log out',
  },
  errors: {
    generic: 'Something went wrong.',
    loadApplications: 'Unable to load your applications.',
  },
  auth: {
    fields: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      passwordHint: 'Password (at least 8 characters)',
      passwordConfirmation: 'Confirm password',
    },
    login: {
      title: 'Log in',
      submit: 'Log in',
      submitting: 'Logging in…',
      noAccount: "Don't have an account?",
      register: 'Sign up',
    },
    register: {
      title: 'Create an account',
      submit: 'Create my account',
      submitting: 'Creating…',
      hasAccount: 'Already have an account?',
      login: 'Log in',
    },
  },
  applications: {
    title: 'My applications',
    total: '{{count}} in total',
    new: '+ New application',
    all: 'All',
    empty: 'No applications yet.',
    appliedOn: 'Applied on {{date}}',
    viewOffer: 'View job offer',
    followUp: 'Follow up',
    confirmDelete: 'Delete the application at {{company}}?',
    previous: '← Previous',
    next: 'Next →',
    page: 'Page {{current}} / {{last}}',
    form: {
      createTitle: 'New application',
      editTitle: 'Edit application',
      company: 'Company *',
      position: 'Position *',
      location: 'Location',
      appliedAt: 'Application date',
      url: 'Job offer link',
      status: 'Status',
      notes: 'Notes',
    },
  },
  status: {
    to_apply: 'To apply',
    sent: 'Sent',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  },
  language: {
    label: 'Language',
  },
}

export default en
