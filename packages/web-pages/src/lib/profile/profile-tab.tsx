import React from 'react';
import {
  AuthField,
  AutoIncrementList,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  SelectField,
  SelectFieldOption,
  Skeleton,
  Switch,
  Text,
  TextareaField
} from '@inithium/ui';
import type { Address, Gender } from '@inithium/models';
import { updateProfileSchema, updateSelfSchema } from '@inithium/validators';
import {
  openAlert,
  useAppDispatch,
  useCreateProfileMutation,
  useMeQuery,
  useReadAllProfilesQuery,
  useReadAllSettingsQuery,
  useUpdateProfileMutation,
  useUpdateSelfMutation
} from '@inithium/store';
import { extractSettingsMap, isProfileFieldActive, PROFILE_CONFIG_SETTING_NAME } from './profile-config.js';
import { buildFieldErrorMap } from './form-errors.js';
import { AddressFormValues, EMPTY_ADDRESS_FORM_VALUES, ProfileNameFormErrors } from './profile-tab.types.js';
import type { ProfileTabContext } from './profile-tab-registry.js';

const VALIDATION_ERROR_MESSAGE = 'There were errors in your form';

const GENDER_OPTIONS: readonly SelectFieldOption[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Prefer Not to Say', label: 'Prefer Not to Say' },
  { value: 'Other', label: 'Other' }
];

const toDateInputValue = (value: unknown): string => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const toAddressFormValues = (address?: Address): AddressFormValues =>
  address
    ? {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      }
    : EMPTY_ADDRESS_FORM_VALUES;

const isAddressFormEmpty = (address: AddressFormValues): boolean =>
  Object.values(address).every((value) => value.trim().length === 0);

const toAddressPayload = (address: AddressFormValues): Address | undefined =>
  isAddressFormEmpty(address)
    ? undefined
    : {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2.trim().length > 0 ? address.addressLine2 : undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      };

const toGenderPayload = (type: string, custom: string): Gender | undefined => {
  if (!type) return undefined;
  if (type === 'Other') return { type: 'Other', custom };
  return { type: type as 'Male' | 'Female' | 'Prefer Not to Say' };
};

interface AddressFieldsProps {
  readonly title: string;
  readonly value: AddressFormValues;
  readonly onChange: (value: AddressFormValues) => void;
  readonly errors: Record<string, string>;
  readonly errorPrefix: string;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ title, value, onChange, errors, errorPrefix }) => (
  <div className="flex flex-col gap-3">
    <Text weight="medium" size="sm">
      {title}
    </Text>
    <AuthField
      label="Address Line 1"
      value={value.addressLine1}
      onChange={(event) => onChange({ ...value, addressLine1: event.target.value })}
      errorMessage={errors[`${errorPrefix}.addressLine1`]}
    />
    <AuthField
      label="Address Line 2"
      value={value.addressLine2}
      onChange={(event) => onChange({ ...value, addressLine2: event.target.value })}
      errorMessage={errors[`${errorPrefix}.addressLine2`]}
    />
    <div className="grid grid-cols-2 gap-3">
      <AuthField
        label="City"
        value={value.city}
        onChange={(event) => onChange({ ...value, city: event.target.value })}
        errorMessage={errors[`${errorPrefix}.city`]}
      />
      <AuthField
        label="State"
        value={value.state}
        onChange={(event) => onChange({ ...value, state: event.target.value })}
        errorMessage={errors[`${errorPrefix}.state`]}
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <AuthField
        label="Postal Code"
        value={value.postalCode}
        onChange={(event) => onChange({ ...value, postalCode: event.target.value })}
        errorMessage={errors[`${errorPrefix}.postalCode`]}
      />
      <AuthField
        label="Country"
        value={value.country}
        onChange={(event) => onChange({ ...value, country: event.target.value })}
        errorMessage={errors[`${errorPrefix}.country`]}
      />
    </div>
  </div>
);

export const ProfileTab: React.FC<{ readonly context: ProfileTabContext }> = ({ context }) => {
  const dispatch = useAppDispatch();
  const { data: currentUser } = useMeQuery();
  const { data: profilesResult, isFetching: isProfileFetching } = useReadAllProfilesQuery(
    { field: 'user_id', search: context.userId, limit: 1 },
    { skip: !context.userId }
  );
  const { data: settingsData } = useReadAllSettingsQuery();
  const profile = profilesResult?.data?.[0];
  const settingsMap = React.useMemo(() => extractSettingsMap(settingsData), [settingsData]);
  const profileConfig = settingsMap[PROFILE_CONFIG_SETTING_NAME];

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [nameErrors, setNameErrors] = React.useState<ProfileNameFormErrors>({});
  const [updateSelf, { isLoading: isSavingName }] = useUpdateSelfMutation();

  React.useEffect(() => {
    if (!currentUser) return;
    setFirstName(currentUser.first_name ?? '');
    setLastName(currentUser.last_name ?? '');
  }, [currentUser]);

  const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = updateSelfSchema.safeParse({ first_name: firstName, last_name: lastName });
    if (!result.success) {
      setNameErrors(buildFieldErrorMap(result.error));
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }
    setNameErrors({});
    try {
      await updateSelf(result.data).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Name updated' }));
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update name' }));
    }
  };

  const [bio, setBio] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [genderType, setGenderType] = React.useState('');
  const [genderCustom, setGenderCustom] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [accessControl, setAccessControl] = React.useState(false);
  const [socials, setSocials] = React.useState<string[]>([]);
  const [shippingAddress, setShippingAddress] = React.useState<AddressFormValues>(EMPTY_ADDRESS_FORM_VALUES);
  const [billingAddress, setBillingAddress] = React.useState<AddressFormValues>(EMPTY_ADDRESS_FORM_VALUES);
  const [detailsErrors, setDetailsErrors] = React.useState<Record<string, string>>({});
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [createProfile, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  React.useEffect(() => {
    if (!profile) return;
    setBio(profile.profileBio ?? '');
    setDob(toDateInputValue(profile.profileDOB));
    setGenderType(profile.profileGender?.type ?? '');
    setGenderCustom(profile.profileGender?.type === 'Other' ? profile.profileGender.custom : '');
    setPhone(profile.profilePhone ?? '');
    setAccessControl(profile.profileAccessControl ?? false);
    setSocials(profile.profileOtherSocials ? [...profile.profileOtherSocials] : []);
    setShippingAddress(toAddressFormValues(profile.profileShippingAddress));
    setBillingAddress(toAddressFormValues(profile.profileBillingAddress));
  }, [profile]);

  const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const payload = {
      profileBio: bio.trim().length > 0 ? bio : undefined,
      profileDOB: dob.trim().length > 0 ? dob : undefined,
      profileGender: toGenderPayload(genderType, genderCustom),
      profilePhone: phone.trim().length > 0 ? phone : undefined,
      profileAccessControl: accessControl,
      profileOtherSocials: socials.filter((url) => url.trim().length > 0),
      profileShippingAddress: toAddressPayload(shippingAddress),
      profileBillingAddress: toAddressPayload(billingAddress)
    };

    const result = updateProfileSchema.safeParse(payload);
    if (!result.success) {
      setDetailsErrors(buildFieldErrorMap(result.error));
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return;
    }
    setDetailsErrors({});
    try {
      if (profile) {
        await updateProfile({ id: profile._id, data: result.data }).unwrap();
      } else {
        await createProfile({ ...result.data, user_id: context.userId }).unwrap();
      }
      dispatch(openAlert({ severity: 'success', message: 'Profile updated' }));
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update profile' }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleNameSubmit} noValidate>
            <AuthField
              label="First Name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              errorMessage={nameErrors.first_name}
            />
            <AuthField
              label="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              errorMessage={nameErrors.last_name}
            />
            <Button type="submit" loading={isSavingName} className="self-start">
              Save Name
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isProfileFetching ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleDetailsSubmit} noValidate>
              {isProfileFieldActive(profileConfig, 'profileBio') ? (
                <TextareaField
                  label="Bio"
                  rows={4}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  errorMessage={detailsErrors['profileBio']}
                />
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileDOB') ? (
                <AuthField
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  errorMessage={detailsErrors['profileDOB']}
                />
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileGender') ? (
                <>
                  <SelectField
                    label="Gender"
                    placeholder="Select an option"
                    value={genderType}
                    onValueChange={setGenderType}
                    options={GENDER_OPTIONS}
                    errorMessage={detailsErrors['profileGender'] ?? detailsErrors['profileGender.type']}
                  />
                  {genderType === 'Other' ? (
                    <AuthField
                      label="Please specify"
                      value={genderCustom}
                      onChange={(event) => setGenderCustom(event.target.value)}
                      errorMessage={detailsErrors['profileGender.custom']}
                    />
                  ) : null}
                </>
              ) : null}

              {isProfileFieldActive(profileConfig, 'profilePhone') ? (
                <div className="flex flex-col gap-1.5">
                  <AuthField
                    label="Phone"
                    type="tel"
                    placeholder="+15551234567"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    errorMessage={detailsErrors['profilePhone']}
                  />
                  <Text size="xs" color="muted">
                    Include the country code, e.g. +15551234567
                  </Text>
                </div>
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileAccessControl') ? (
                <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                  <div className="flex flex-col gap-0.5">
                    <Label htmlFor="profile-access-control">Restrict Profile Access</Label>
                    <Text size="xs" color="muted">
                      Limit who can view your profile details.
                    </Text>
                  </div>
                  <Switch id="profile-access-control" checked={accessControl} onCheckedChange={setAccessControl} />
                </div>
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileOtherSocials') ? (
                <div className="flex flex-col gap-1.5">
                  <Label>Other Social Links</Label>
                  <AutoIncrementList<string>
                    values={socials}
                    onValuesChange={setSocials}
                    createItem={() => ''}
                    renderItem={({ value, onChange }) => (
                      <Input
                        placeholder="https://example.com/you"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        error={Boolean(detailsErrors['profileOtherSocials'])}
                      />
                    )}
                  />
                  {detailsErrors['profileOtherSocials'] ? (
                    <Text as="span" size="xs" color="destructive">
                      {detailsErrors['profileOtherSocials']}
                    </Text>
                  ) : null}
                </div>
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileShippingAddress') ? (
                <AddressFields
                  title="Shipping Address"
                  value={shippingAddress}
                  onChange={setShippingAddress}
                  errors={detailsErrors}
                  errorPrefix="profileShippingAddress"
                />
              ) : null}

              {isProfileFieldActive(profileConfig, 'profileBillingAddress') ? (
                <AddressFields
                  title="Billing Address"
                  value={billingAddress}
                  onChange={setBillingAddress}
                  errors={detailsErrors}
                  errorPrefix="profileBillingAddress"
                />
              ) : null}

              <Button type="submit" loading={isUpdatingProfile || isCreatingProfile} className="self-start">
                Save Profile Details
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
