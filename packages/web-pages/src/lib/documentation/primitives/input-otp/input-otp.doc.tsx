import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const INPUT_OTP_DOC: PrimitiveDoc = {
  overview: (
    <>
      InputOTP is a segmented one-time-passcode input built on the <code>input-otp</code> library,
      rendering individually boxed slots that stay wired to a single logical string value. Enterprise use
      cases include two-factor authentication and email/SMS confirmation codes during sign-up or
      sensitive account changes.
    </>
  ),
  importStatement: "import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@inithium/ui';",
  propGroups: [
    {
      component: 'InputOTP',
      props: [
        { name: 'maxLength', type: 'number', defaultValue: '6', description: 'Total number of characters the passcode accepts.' },
        { name: 'value', type: 'string', description: 'Controlled passcode value.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called as the passcode value changes.' },
        { name: 'containerClassName', type: 'string', description: 'Class name applied to the outer flex container.' },
      ],
    },
    {
      component: 'InputOTPSlot',
      props: [
        { name: 'index', type: 'number', required: true, description: 'Position of this slot within the passcode.' },
      ],
    },
  ],
  examples: [
    {
      title: '6-digit verification code',
      code: `<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
      preview: (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      ),
    },
    {
      title: 'Grouped with a separator',
      description: 'InputOTPSeparator visually splits the passcode into logical chunks, e.g. 3 + 3.',
      code: `<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
      preview: (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      ),
    },
  ],
};

export const InputOTPDoc = () => <PrimitiveDocView doc={INPUT_OTP_DOC} />;
