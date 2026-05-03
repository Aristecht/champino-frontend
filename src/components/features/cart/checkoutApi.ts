import { gql } from "@apollo/client";

export const GET_BRANCHES = gql`
  query GetBranchesCheckout {
    getBranches {
      id
      name
      city
      address
      workingHours
      isActive
      latitude
      longitude
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCartCheckout($data: AddToCartInput!) {
    addToCart(data: $data) {
      id
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCartCheckout {
    clearCart
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrderCheckout($data: CreateOrderInput!) {
    createOrder(data: $data) {
      id
      status
      totalAmount
    }
  }
`;

export const INIT_PAYMENT = gql`
  mutation InitPaymentCheckout($orderId: String!) {
    initPayment(orderId: $orderId) {
      orderId
      type
      paymentUrl
      formUrl
      qrUrl
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrderCheckout($orderId: String!) {
    cancelOrder(orderId: $orderId)
  }
`;

export type BranchesQuery = {
  getBranches: Array<{
    id: string;
    name: string;
    city: string;
    address: string;
    workingHours?: string | null;
    isActive: boolean;
    latitude?: number | null;
    longitude?: number | null;
  }>;
};

export type CreateOrderResult = {
  createOrder: { id: string; status: string; totalAmount: number };
};

export type InitPaymentResult = {
  initPayment: {
    orderId: string;
    type: string;
    paymentUrl?: string | null;
    formUrl?: string | null;
    qrUrl?: string | null;
  };
};

export type CancelOrderResult = {
  cancelOrder: boolean;
};
