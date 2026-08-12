export interface ProfileNameFormErrors {
  readonly first_name?: string;
  readonly last_name?: string;
}

export interface AddressFormValues {
  readonly addressLine1: string;
  readonly addressLine2: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

export const EMPTY_ADDRESS_FORM_VALUES: AddressFormValues = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
};
