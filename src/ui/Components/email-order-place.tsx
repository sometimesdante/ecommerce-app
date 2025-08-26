import { EmailTemplateProps } from "@/utils/types";

export const OrderPlacedTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  transaction_id,
  email,
  payment_status,
  products,
}) => (
  <div>
    <h3>Hello,</h3>
    <p>A new order has been placed Order ID: {transaction_id}</p>
    <p>User Email: {email}</p>
    <p>Payment Status: {payment_status}</p>
    <p>Products: </p>
    {products?.map((prod: any) => (
      <div key={prod.id}>
        <p>
          <span>Product Name: {prod.name} </span>
          <span>Product Price: {prod.price} </span>
          <span>Product Count: {prod.count} </span>
        </p>
      </div>
    ))}
    <a href="https://www.ransanfarms.com/admin/orders">
      Visit Dashboard for more details
    </a>
  </div>
);
