import { OnboardingContent as OnboardingContentInterface } from '@appTypes/OnboardingContent';

const empty: OnboardingContentInterface = {
  title: '',
  body: '',
  hideBack: true
};

const addAddress: OnboardingContentInterface = {
  title: 'Add a Address',
  body: 'To get started, click “Add a Address” to add your personal or any other AMB Addresses you want to track',
  hideBack: true
};

const searchAddress: OnboardingContentInterface = {
  title: 'Search public address',
  body: `To begin tracking an address, you'll need to enter its public address. Simply paste it into the search bar and tap "Search". `
};

const trackAddress: OnboardingContentInterface = {
  title: 'Track address',
  body: `Click "Track Address" once you've confirmed the public address Address details`
};

const editAddress: OnboardingContentInterface = {
  title: 'Edit Address',
  body: 'Customize your Address with a custom name, set as personal address, Transaction alerts, or add it to a list.'
};

const changeAddressName: OnboardingContentInterface = {
  title: 'Address name',
  body: `You can customize your Address by giving it a custom name that's easy for you to remember. This can help you identify your Address more easily and keep track of multiple Addresses in your portfolio.`
};

const personalAddress: OnboardingContentInterface = {
  title: 'Is this a personal address?',
  body: `if this Address is a personal address, you can check it as such. This will allow you to easily addresses and view your personal holdings at a glance.`
};

const addToList: OnboardingContentInterface = {
  title: 'Adding Address to a list',
  body: `If you have multiple Addresses or want to group your AMB holdings in a specific way, you can add your Address to a list. Simply create a new list to get started.`
};

const changeListName: OnboardingContentInterface = {
  title: 'SingleCollection name',
  body: `You can customize your list by giving it a custom name that's easy for you to remember. This can help you identify lists more easily and keep track of multiple Addresses inside it.`
};

const createNewList: OnboardingContentInterface = {
  title: 'Create new list',
  body: `You can now go ahead and create a new list!`
};

const saveAddress: OnboardingContentInterface = {
  title: 'Save changes',
  body: `Great! you’ve added “Address 01” to “Whales List” Save changes you made so far!`
};

const viewAddresses: OnboardingContentInterface = {
  title: 'Go to Addresses',
  body: `Finally, click on “View Address” to see your personal and watchlisted Addresses on your portfolio.`
};

const scanBarcode: OnboardingContentInterface = {
  title: 'Scan QR code',
  body: `Want to add a Address quickly and easily? Use our scan feature! Simply point your camera at a Address's QR code, and we'll do the rest. `,
  hideBack: true
};

export const OnboardingContent = [
  empty,
  addAddress,
  searchAddress,
  trackAddress,
  editAddress,
  changeAddressName,
  personalAddress,
  addToList,
  changeListName,
  createNewList,
  saveAddress,
  viewAddresses,
  scanBarcode
];
