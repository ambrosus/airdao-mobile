export const initialOnBoardingSteps = {
  'none': {
    title: '',
    subtitle: '',
    buttonLeftTitle: '',
    buttonRightTitle: '',
    isButtonClose: false,
    isButtonLeftVisible: false
  },
  'step-1': {
    title: 'Add a Address',
    subtitle:
      'To get started, click “Add a Address” to add your personal or any other AMB Addresses you want to track',
    buttonLeftTitle: '',
    buttonRightTitle: 'Next',
    isButtonClose: true,
    isButtonLeftVisible: false
  },
  'step-2': {
    title: 'Search public address',
    subtitle: `To begin tracking an address, you'll need to enter its public address. Simply paste it into the search bar and tap "Search". `,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-3': {
    title: 'Track address',
    subtitle: `Click "Track Address" once you've confirmed the public address Address details.`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-4': {
    title: 'Edit Address',
    subtitle:
      'Customize your Address with a custom name, set as personal address, Transaction alerts, or add it to a list.',
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-5': {
    title: 'Address name',
    subtitle: `You can customize your Address by giving it a custom name that's easy for you to remember. This can help you identify your Address more easily and keep track of multiple Addresses in your portfolio.`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-6': {
    title: 'Is this a personal address?',
    subtitle: `if this Address is a personal address, you can check it as such. This will allow you to easily addresses and view your personal holdings at a glance.`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-7': {
    title: 'Adding Address to a list',
    subtitle: `If you have multiple Addresses or want to group your AMB holdings in a specific way, you can add your Address to a list. Simply create a new list to get started.`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-8': {
    title: 'List name',
    subtitle: `You can customize your list by giving it a custom name that's easy for you to remember. This can help you identify lists more easily and keep track of multiple Addresses inside it.`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-9': {
    title: 'Create new list',
    subtitle: `You can now go ahead and create a new list!`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-10': {
    title: 'Save changes',
    subtitle: `Great! you’ve added “Address 01” to “Whales List” Save changes you made so far!`,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-11': {
    title: 'Go to Addresses',
    subtitle: `Finally, click on “View Address” to see your personal and watchlisted Addresses on your portfolio.`,
    buttonLeftTitle: '',
    buttonRightTitle: '',
    isButtonClose: false,
    isButtonLeftVisible: true
  },
  'step-12': {
    title: 'Scan QR code',
    subtitle: `Want to add a Address quickly and easily? Use our scan feature! Simply point your camera at a Address's QR code, and we'll do the rest. `,
    buttonLeftTitle: 'Back',
    buttonRightTitle: 'Skip Tutorial',
    isButtonClose: false,
    isButtonLeftVisible: true
  }
};
