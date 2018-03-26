import { OrderDetails } from "./order-details";
import { UserDetails } from "./user-details";
export interface UserOrder {
    user: UserDetails;
    order: OrderDetails;
}