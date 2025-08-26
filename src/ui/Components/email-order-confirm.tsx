import { EmailTemplateProps } from "@/utils/types";

export const OrderConfirmationTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ firstName }) => (
  <div>
    <h3>Hello {firstName}</h3>
    <p>
      We have received your payment and are preparing your order!
      <br />
      Hold tight, you will receive your order within the next 24-48 hours. If
      you haven't received your order even after 48 hours, please contact +91
      9944495911.
    </p>
    <p>
      Kind regards,
      <br />
      D.Venkatesan
      <br />
      Managing Partner
    </p>
  </div>
);
