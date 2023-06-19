export interface PaymentData {
    id: number;
    type: string;
    description: string;
    price: number;
    card_expiry?: string;
    card_holder_name?: string;
    card_no?: string; 
    merchant_id?: string;
    method?: string;
    order_id?: string;
    payhere_amount?: string;
    payhere_currency?: string;
    payment_id?: string;
    recurring?: string;
    status_code?: string;
    status_message?: string;
    transaction: boolean;

}