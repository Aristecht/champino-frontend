import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: any; output: any; }
};

export type AddToCartInput = {
  productId: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type AnalyticsSummaryModel = {
  __typename?: 'AnalyticsSummaryModel';
  avgOrderValue: Scalars['Float']['output'];
  conversionRate: Scalars['Float']['output'];
  newCustomers: Scalars['Int']['output'];
  revenueByDay: Array<RevenueByPeriodModel>;
  topProducts: Array<TopProductModel>;
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type ArticleCommentModel = {
  __typename?: 'ArticleCommentModel';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  postId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type AuthModel = {
  __typename?: 'AuthModel';
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserModel>;
};

export type BranchModel = {
  __typename?: 'BranchModel';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workingHours?: Maybe<Scalars['String']['output']>;
};

export type CartItemModel = {
  __typename?: 'CartItemModel';
  cartId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isSelected: Scalars['Boolean']['output'];
  product?: Maybe<CartProductModel>;
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CartModel = {
  __typename?: 'CartModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  items: Array<CartItemModel>;
  selectedCount: Scalars['Int']['output'];
  selectedTotal: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  totalItems: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type CartProductModel = {
  __typename?: 'CartProductModel';
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  children?: Maybe<Array<CategoryModel>>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
};

export type ChangeNotificationsSettingsInput = {
  pushNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  siteNotifications?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAddressInput = {
  apartment?: InputMaybe<Scalars['String']['input']>;
  building: Scalars['String']['input'];
  city: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  phone: Scalars['String']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street: Scalars['String']['input'];
};

export type CreateBranchInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  workingHours?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryInput = {
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCommentInput = {
  body: Scalars['String']['input'];
};

export type CreateOrderInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  paymentMethod: PaymentMethod;
  shipping: ShippingAddressInput;
};

export type CreateProductInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  categoryId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discountPercent?: InputMaybe<Scalars['Int']['input']>;
  draftId: Scalars['String']['input'];
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateReviewInput = {
  productId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateVariantInput = {
  attributes?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  sku: Scalars['String']['input'];
  stock?: Scalars['Float']['input'];
};

export type DeactivateAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export enum DeliveryType {
  Courier = 'COURIER',
  Pickup = 'PICKUP'
}

export type DeviceModel = {
  __typename?: 'DeviceModel';
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type DevicesModel = {
  __typename?: 'DevicesModel';
  createdAt: Scalars['DateTime']['output'];
  deviceName: Scalars['String']['output'];
  deviceType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUsedAt: Scalars['DateTime']['output'];
  token: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type EnableTotpInput = {
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type FilterOrderInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type FilterPostInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
};

export type FilterProductInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type LocationModel = {
  __typename?: 'LocationModel';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longtitude: Scalars['Float']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type LoyaltyCardModel = {
  __typename?: 'LoyaltyCardModel';
  createdAt: Scalars['DateTime']['output'];
  discountPct: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  qrToken: Scalars['String']['output'];
  qrUrl: Scalars['String']['output'];
  totalOrders: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LoyaltyCardWithUserModel = {
  __typename?: 'LoyaltyCardWithUserModel';
  createdAt: Scalars['DateTime']['output'];
  discountPct: Scalars['Int']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  qrToken: Scalars['String']['output'];
  qrUrl: Scalars['String']['output'];
  totalOrders: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export enum MediaType {
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  addPostComment: ArticleCommentModel;
  addToCart: CartModel;
  adminCancelRostaSync: Scalars['Boolean']['output'];
  adminCreateBranch: BranchModel;
  adminDeleteBranch: Scalars['Boolean']['output'];
  adminDeletePostComment: Scalars['Boolean']['output'];
  adminRefundOrder: Scalars['Boolean']['output'];
  adminSyncRostaProducts: Scalars['Boolean']['output'];
  adminUpdateBranch: BranchModel;
  adminUpdateOrderStatus: OrderModel;
  assignRole: UserModel;
  cancelOrder: Scalars['Boolean']['output'];
  changeEmail: Scalars['Boolean']['output'];
  changeNotificationSettings: ChangeNotificationSettingsModel;
  changePassword: Scalars['Boolean']['output'];
  checkPaymentStatus: Scalars['Boolean']['output'];
  clearCart: Scalars['Boolean']['output'];
  clearSessionCookie: Scalars['Boolean']['output'];
  confirmLoyaltyPurchase: LoyaltyCardModel;
  createAddress: UserAddressModel;
  createCategory: CategoryModel;
  createDraftProduct: ProductModel;
  createOrder: OrderModel;
  createProduct: ProductModel;
  createReview: ReviewModel;
  createUser: UserModel;
  createVariant: ProductVariantModel;
  deactivateAccount: AuthModel;
  deleteAddress: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deletePostComment: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  deleteVariant: Scalars['Boolean']['output'];
  deselectAllCartItems: CartModel;
  disableTotp: Scalars['Boolean']['output'];
  enableTotp: Scalars['Boolean']['output'];
  initPayment: PaymentInitModel;
  loginUser: AuthModel;
  logoutUser: Scalars['Boolean']['output'];
  markAllNotificationAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Scalars['Boolean']['output'];
  newEmail: Scalars['Boolean']['output'];
  newPassword: Scalars['Boolean']['output'];
  registerDeviceToken: Scalars['Boolean']['output'];
  removeCategory: Scalars['Boolean']['output'];
  removeDeviceToken: Scalars['Boolean']['output'];
  removeFromCart: CartModel;
  removeProduct: Scalars['Boolean']['output'];
  removeSelectedFromCart: CartModel;
  removeSession: Scalars['Boolean']['output'];
  resendVerificationEmail: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  selectAllCartItems: CartModel;
  setDefaultAddress: UserAddressModel;
  toggleCartItemSelection: CartModel;
  toggleProductPublish: ProductModel;
  updateAddress: UserAddressModel;
  updateCartItem: CartModel;
  updateCategory: CategoryModel;
  updateProduct: ProductModel;
  updateReview: ReviewModel;
  updateVariant: ProductVariantModel;
  verifyAccount: UserModel;
};


export type MutationAddPostCommentArgs = {
  data: CreateCommentInput;
  postId: Scalars['String']['input'];
};


export type MutationAddToCartArgs = {
  data: AddToCartInput;
};


export type MutationAdminCreateBranchArgs = {
  data: CreateBranchInput;
};


export type MutationAdminDeleteBranchArgs = {
  id: Scalars['String']['input'];
};


export type MutationAdminDeletePostCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationAdminRefundOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationAdminUpdateBranchArgs = {
  data: UpdateBranchInput;
  id: Scalars['String']['input'];
};


export type MutationAdminUpdateOrderStatusArgs = {
  data: UpdateOrderStatusInput;
  orderId: Scalars['String']['input'];
};


export type MutationAssignRoleArgs = {
  role: Role;
  userId: Scalars['String']['input'];
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationChangeEmailArgs = {
  data: ChangeEmailInput;
};


export type MutationChangeNotificationSettingsArgs = {
  data: ChangeNotificationsSettingsInput;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCheckPaymentStatusArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationConfirmLoyaltyPurchaseArgs = {
  operationId: Scalars['String']['input'];
  qrToken: Scalars['String']['input'];
};


export type MutationCreateAddressArgs = {
  data: CreateAddressInput;
};


export type MutationCreateCategoryArgs = {
  data: CreateCategoryInput;
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationCreateReviewArgs = {
  data: CreateReviewInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationCreateVariantArgs = {
  data: CreateVariantInput;
  productId: Scalars['String']['input'];
};


export type MutationDeactivateAccountArgs = {
  data: DeactivateAccountInput;
};


export type MutationDeleteAddressArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePostCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationDeleteReviewArgs = {
  reviewId: Scalars['String']['input'];
};


export type MutationDeleteVariantArgs = {
  variantId: Scalars['String']['input'];
};


export type MutationEnableTotpArgs = {
  data: EnableTotpInput;
};


export type MutationInitPaymentArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationLoginUserArgs = {
  data: LoginInput;
};


export type MutationMarkNotificationAsReadArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationNewEmailArgs = {
  data: NewEmailInput;
};


export type MutationNewPasswordArgs = {
  data: NewPasswordInput;
};


export type MutationRegisterDeviceTokenArgs = {
  data: RegisterDeviceTokenInput;
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveDeviceTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveFromCartArgs = {
  productId: Scalars['String']['input'];
};


export type MutationRemoveProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationSetDefaultAddressArgs = {
  id: Scalars['String']['input'];
};


export type MutationToggleCartItemSelectionArgs = {
  productId: Scalars['String']['input'];
};


export type MutationToggleProductPublishArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateAddressArgs = {
  data: UpdateAddressInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateCartItemArgs = {
  data: UpdateCartItemInput;
};


export type MutationUpdateCategoryArgs = {
  data: UpdateCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateReviewArgs = {
  data: UpdateReviewInput;
  reviewId: Scalars['String']['input'];
};


export type MutationUpdateVariantArgs = {
  data: UpdateVariantInput;
  variantId: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerificationInput;
};

export type NewEmailInput = {
  token: Scalars['String']['input'];
};

export type NewPasswordInput = {
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type NotificationMetaModel = {
  __typename?: 'NotificationMetaModel';
  limit: Scalars['Float']['output'];
  page: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type NotificationModel = {
  __typename?: 'NotificationModel';
  actorId?: Maybe<Scalars['String']['output']>;
  albumId?: Maybe<Scalars['String']['output']>;
  commentId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  projectId?: Maybe<Scalars['String']['output']>;
  type: NotificationsType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type NotificationSettingsModel = {
  __typename?: 'NotificationSettingsModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  pushNotifications: Scalars['Boolean']['output'];
  siteNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum NotificationsType {
  DisableTwoFactor = 'DISABLE_TWO_FACTOR',
  EnableTwoFactor = 'ENABLE_TWO_FACTOR',
  NewPost = 'NEW_POST',
  OrderCancelled = 'ORDER_CANCELLED',
  OrderConfirmed = 'ORDER_CONFIRMED',
  OrderDelivered = 'ORDER_DELIVERED',
  OrderPaid = 'ORDER_PAID',
  OrderPlaced = 'ORDER_PLACED',
  OrderRefunded = 'ORDER_REFUNDED',
  OrderShipped = 'ORDER_SHIPPED',
  OrderStatusChanged = 'ORDER_STATUS_CHANGED',
  PostComment = 'POST_COMMENT'
}

export type OrderItemModel = {
  __typename?: 'OrderItemModel';
  id: Scalars['ID']['output'];
  priceAtOrder: Scalars['Float']['output'];
  product?: Maybe<OrderProductModel>;
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  variantId?: Maybe<Scalars['String']['output']>;
  variantName?: Maybe<Scalars['String']['output']>;
};

export type OrderListModel = {
  __typename?: 'OrderListModel';
  data: Array<OrderModel>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type OrderModel = {
  __typename?: 'OrderModel';
  createdAt: Scalars['DateTime']['output'];
  discountAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  items: Array<OrderItemModel>;
  note?: Maybe<Scalars['String']['output']>;
  payment?: Maybe<PaymentModel>;
  shipping?: Maybe<ShippingAddressModel>;
  status: OrderStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type OrderProductModel = {
  __typename?: 'OrderProductModel';
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export enum OrderStatus {
  Assembling = 'ASSEMBLING',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delivered = 'DELIVERED',
  InTransit = 'IN_TRANSIT',
  Processing = 'PROCESSING',
  ReadyForPickup = 'READY_FOR_PICKUP',
  Refunded = 'REFUNDED'
}

export type OutputNotificationModel = {
  __typename?: 'OutputNotificationModel';
  data: Array<NotificationModel>;
  meta: NotificationMetaModel;
};

export type PageLimitInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentInitModel = {
  __typename?: 'PaymentInitModel';
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  formUrl?: Maybe<Scalars['String']['output']>;
  invoiceId?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  paymentUrl?: Maybe<Scalars['String']['output']>;
  qrToken?: Maybe<Scalars['String']['output']>;
  qrUrl?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export enum PaymentMethod {
  CashOnDelivery = 'CASH_ON_DELIVERY',
  HalykEkvayring = 'HALYK_EKVAYRING',
  KaspiPay = 'KASPI_PAY'
}

export type PaymentModel = {
  __typename?: 'PaymentModel';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  halykApprovalCode?: Maybe<Scalars['String']['output']>;
  halykInvoiceId?: Maybe<Scalars['String']['output']>;
  halykOrderId?: Maybe<Scalars['String']['output']>;
  halykRrn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kaspiOrderId?: Maybe<Scalars['String']['output']>;
  kaspiQrToken?: Maybe<Scalars['String']['output']>;
  method: PaymentMethod;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  status: PaymentsStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum PaymentsStatus {
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Refunded = 'REFUNDED',
  Succeeded = 'SUCCEEDED'
}

export type PostListModel = {
  __typename?: 'PostListModel';
  data: Array<PostModel>;
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PostModel = {
  __typename?: 'PostModel';
  body: Scalars['String']['output'];
  comments?: Maybe<Array<ArticleCommentModel>>;
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductCategoryModel = {
  __typename?: 'ProductCategoryModel';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<ProductCategoryParentModel>;
  slug: Scalars['String']['output'];
};

export type ProductCategoryParentModel = {
  __typename?: 'ProductCategoryParentModel';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ProductListModel = {
  __typename?: 'ProductListModel';
  data: Array<ProductModel>;
  meta: ProductMetaModel;
};

export type ProductMediaModel = {
  __typename?: 'ProductMediaModel';
  id: Scalars['ID']['output'];
  mediaType: MediaType;
  url: Scalars['String']['output'];
};

export type ProductMetaModel = {
  __typename?: 'ProductMetaModel';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type ProductModel = {
  __typename?: 'ProductModel';
  attributes?: Maybe<Scalars['JSON']['output']>;
  category?: Maybe<ProductCategoryModel>;
  categoryId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** Скидка в процентах (0–100) */
  discountPercent?: Maybe<Scalars['Int']['output']>;
  /** Цена после скидки */
  discountedPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isDraft: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  medias?: Maybe<Array<ProductMediaModel>>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantModel = {
  __typename?: 'ProductVariantModel';
  attributes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  stock: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminGetAllOrders: OrderListModel;
  adminGetBranches: Array<BranchModel>;
  adminGetOrder: OrderModel;
  adminGetPost: PostModel;
  adminGetPosts: PostListModel;
  findAllCategories: Array<CategoryModel>;
  findAllProducts: ProductListModel;
  findAllProductsAdmin: ProductListModel;
  findAllUser: Array<UserModel>;
  findCategoryById: CategoryModel;
  findCategoryBySlug: CategoryModel;
  findCurrentSession: SessionModel;
  findNotificationsByUser: OutputNotificationModel;
  findNotificationsUnreadCount: Scalars['Float']['output'];
  findProductById: ProductModel;
  findProfile: UserModel;
  findSessionByUser: Array<SessionModel>;
  generateTotpSecret: TotpModel;
  getAnalyticsSummary: AnalyticsSummaryModel;
  getBranch: BranchModel;
  getBranches: Array<BranchModel>;
  getCart: CartModel;
  getDevices: Array<DevicesModel>;
  getMyAddresses: Array<UserAddressModel>;
  getMyOrder: OrderModel;
  getMyOrders: OrderListModel;
  getPost: PostModel;
  getPosts: PostListModel;
  getProductReviews: ReviewListModel;
  getProductVariants: Array<ProductVariantModel>;
  getRostaSyncStatus: RostaSyncStatusModel;
  loyaltyCardByToken?: Maybe<LoyaltyCardWithUserModel>;
  myLoyaltyCard: LoyaltyCardModel;
};


export type QueryAdminGetAllOrdersArgs = {
  filter?: InputMaybe<FilterOrderInput>;
};


export type QueryAdminGetOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type QueryAdminGetPostArgs = {
  slug: Scalars['String']['input'];
};


export type QueryAdminGetPostsArgs = {
  filter?: InputMaybe<FilterPostInput>;
};


export type QueryFindAllProductsArgs = {
  filter?: InputMaybe<FilterProductInput>;
};


export type QueryFindAllProductsAdminArgs = {
  filter?: InputMaybe<FilterProductInput>;
};


export type QueryFindCategoryByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryFindNotificationsByUserArgs = {
  data: PageLimitInput;
};


export type QueryFindProductByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAnalyticsSummaryArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type QueryGetBranchArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMyOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type QueryGetMyOrdersArgs = {
  filter?: InputMaybe<FilterOrderInput>;
};


export type QueryGetPostArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetPostsArgs = {
  filter?: InputMaybe<FilterPostInput>;
};


export type QueryGetProductReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['String']['input'];
};


export type QueryGetProductVariantsArgs = {
  productId: Scalars['String']['input'];
};


export type QueryLoyaltyCardByTokenArgs = {
  qrToken: Scalars['String']['input'];
};

export type RegisterDeviceTokenInput = {
  deviceName?: InputMaybe<Scalars['String']['input']>;
  deviceType: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
};

export type RevenueByPeriodModel = {
  __typename?: 'RevenueByPeriodModel';
  date: Scalars['String']['output'];
  ordersCount: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

export type ReviewListModel = {
  __typename?: 'ReviewListModel';
  avgRating: Scalars['Float']['output'];
  data: Array<ReviewModel>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ReviewModel = {
  __typename?: 'ReviewModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isVerified: Scalars['Boolean']['output'];
  productId: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export enum Role {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  User = 'USER'
}

export type RostaSyncStatusModel = {
  __typename?: 'RostaSyncStatusModel';
  /** Ошибка, если она произошла */
  error?: Maybe<Scalars['String']['output']>;
  isRunning: Scalars['Boolean']['output'];
  /** Прогресс синхронизации (0-100%) */
  progress: Scalars['Int']['output'];
  /** Время запуска синхронизации */
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Текущий статус */
  status: Scalars['String']['output'];
};

export type SessionMetadataModel = {
  __typename?: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SessionModel = {
  __typename?: 'SessionModel';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  metadata?: Maybe<SessionMetadataModel>;
  userId: Scalars['String']['output'];
};

export type ShippingAddressInput = {
  apartment?: InputMaybe<Scalars['String']['input']>;
  branchId?: InputMaybe<Scalars['String']['input']>;
  building?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  deliveryType?: InputMaybe<DeliveryType>;
  fullName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingAddressModel = {
  __typename?: 'ShippingAddressModel';
  apartment?: Maybe<Scalars['String']['output']>;
  branchId?: Maybe<Scalars['String']['output']>;
  building?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  deliveryType: DeliveryType;
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  phone: Scalars['String']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type TopProductModel = {
  __typename?: 'TopProductModel';
  productId: Scalars['String']['output'];
  productName?: Maybe<Scalars['String']['output']>;
  totalRevenue: Scalars['Float']['output'];
  totalSold: Scalars['Int']['output'];
};

export type TotpModel = {
  __typename?: 'TotpModel';
  qrcodeUrl: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type UpdateAddressInput = {
  apartment?: InputMaybe<Scalars['String']['input']>;
  building?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBranchInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  workingHours?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCartItemInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type UpdateCategoryInput = {
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type UpdateProductInput = {
  attributes?: InputMaybe<Scalars['JSON']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discountPercent?: InputMaybe<Scalars['Int']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateReviewInput = {
  rating?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVariantInput = {
  attributes?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Float']['input']>;
};

export type UserAddressModel = {
  __typename?: 'UserAddressModel';
  apartment?: Maybe<Scalars['String']['output']>;
  building: Scalars['String']['output'];
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  phone: Scalars['String']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  street: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type UserModel = {
  __typename?: 'UserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deactivatedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDeactivated: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isTotpEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  notificaitons: Array<NotificationModel>;
  notifications: Array<Scalars['String']['output']>;
  notificationsSettings: NotificationSettingsModel;
  password: Scalars['String']['output'];
  pendingNewEmail?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role: Role;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type ChangeNotificationSettingsModel = {
  __typename?: 'changeNotificationSettingsModel';
  notificationSettings: NotificationSettingsModel;
};

export type AdminRefundOrderMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
}>;


export type AdminRefundOrderMutation = { __typename?: 'Mutation', adminRefundOrder: boolean };

export type AdminUpdateOrderStatusMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
  data: UpdateOrderStatusInput;
}>;


export type AdminUpdateOrderStatusMutation = { __typename?: 'Mutation', adminUpdateOrderStatus: { __typename?: 'OrderModel', id: string, status: OrderStatus, updatedAt: string } };

export type AssignRoleMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  role: Role;
}>;


export type AssignRoleMutation = { __typename?: 'Mutation', assignRole: { __typename?: 'UserModel', id: string, role: Role } };

export type AdminCreateBranchMutationVariables = Exact<{
  data: CreateBranchInput;
}>;


export type AdminCreateBranchMutation = { __typename?: 'Mutation', adminCreateBranch: { __typename?: 'BranchModel', id: string, name: string, city: string, address: string, phone: string, workingHours?: string | null, isActive: boolean, latitude?: number | null, longitude?: number | null, createdAt: string } };

export type CreateCategoryMutationVariables = Exact<{
  data: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CategoryModel', id: string, name: string, slug: string, imageUrl?: string | null, parentId?: string | null, createdAt: string } };

export type CreateDraftProductMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateDraftProductMutation = { __typename?: 'Mutation', createDraftProduct: { __typename?: 'ProductModel', id: string, isDraft: boolean } };

export type CreateProductMutationVariables = Exact<{
  data: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'ProductModel', id: string, name?: string | null, price?: number | null, stock: number, isDraft: boolean, isPublished: boolean, categoryId?: string | null, createdAt: string } };

export type AdminDeleteBranchMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AdminDeleteBranchMutation = { __typename?: 'Mutation', adminDeleteBranch: boolean };

export type RemoveCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveCategoryMutation = { __typename?: 'Mutation', removeCategory: boolean };

export type RemoveProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveProductMutation = { __typename?: 'Mutation', removeProduct: boolean };

export type ToggleProductPublishMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleProductPublishMutation = { __typename?: 'Mutation', toggleProductPublish: { __typename?: 'ProductModel', id: string, isPublished: boolean, isDraft: boolean } };

export type AdminUpdateBranchMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateBranchInput;
}>;


export type AdminUpdateBranchMutation = { __typename?: 'Mutation', adminUpdateBranch: { __typename?: 'BranchModel', id: string, name: string, city: string, address: string, phone: string, workingHours?: string | null, isActive: boolean, latitude?: number | null, longitude?: number | null, createdAt: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'CategoryModel', id: string, name: string, slug: string, imageUrl?: string | null, updatedAt: string } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'ProductModel', id: string, name?: string | null, price?: number | null, stock: number, isDraft: boolean, isPublished: boolean, categoryId?: string | null, description?: string | null, discountPercent?: number | null, updatedAt: string } };

export type CancelOrderMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
}>;


export type CancelOrderMutation = { __typename?: 'Mutation', cancelOrder: boolean };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserModel', id: string, username: string, email: string, isEmailVerified: boolean, isTotpEnabled: boolean, isVerified: boolean, role: Role, createdAt: string } };

export type DeactivateAccountMutationVariables = Exact<{
  data: DeactivateAccountInput;
}>;


export type DeactivateAccountMutation = { __typename?: 'Mutation', deactivateAccount: { __typename?: 'AuthModel', message?: string | null, user?: { __typename?: 'UserModel', id: string, username: string, email: string, isDeactivated: boolean, deactivatedAt?: string | null } | null } };

export type DisableTotpMutationVariables = Exact<{ [key: string]: never; }>;


export type DisableTotpMutation = { __typename?: 'Mutation', disableTotp: boolean };

export type EnableTotpMutationVariables = Exact<{
  data: EnableTotpInput;
}>;


export type EnableTotpMutation = { __typename?: 'Mutation', enableTotp: boolean };

export type LoginUserMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthModel', message?: string | null, user?: { __typename?: 'UserModel', id: string, username: string, email: string, avatar?: string | null, role: Role, isEmailVerified: boolean, isTotpEnabled: boolean, isVerified: boolean, pendingNewEmail?: string | null, createdAt: string } | null } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser: boolean };

export type NewEmailMutationVariables = Exact<{
  data: NewEmailInput;
}>;


export type NewEmailMutation = { __typename?: 'Mutation', newEmail: boolean };

export type NewPasswordMutationVariables = Exact<{
  data: NewPasswordInput;
}>;


export type NewPasswordMutation = { __typename?: 'Mutation', newPassword: boolean };

export type ResendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type ResetPasswordMutationVariables = Exact<{
  data: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type VerifyAccountMutationVariables = Exact<{
  data: VerificationInput;
}>;


export type VerifyAccountMutation = { __typename?: 'Mutation', verifyAccount: { __typename?: 'UserModel', id: string, username: string, email: string, isEmailVerified: boolean, isTotpEnabled: boolean, isVerified: boolean, role: Role, createdAt: string } };

export type CreateReviewMutationVariables = Exact<{
  data: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'ReviewModel', id: string, userId: string, rating: number, title?: string | null, text?: string | null, isVerified: boolean, createdAt: string } };

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['String']['input'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type AdminGetAllOrdersQueryVariables = Exact<{
  filter?: InputMaybe<FilterOrderInput>;
}>;


export type AdminGetAllOrdersQuery = { __typename?: 'Query', adminGetAllOrders: { __typename?: 'OrderListModel', total: number, page: number, limit: number, data: Array<{ __typename?: 'OrderModel', id: string, status: OrderStatus, totalAmount: number, discountAmount?: number | null, createdAt: string, items: Array<{ __typename?: 'OrderItemModel', id: string, quantity: number, product?: { __typename?: 'OrderProductModel', name?: string | null } | null }>, shipping?: { __typename?: 'ShippingAddressModel', fullName: string, phone: string, city?: string | null, deliveryType: DeliveryType } | null, payment?: { __typename?: 'PaymentModel', status: PaymentsStatus, method: PaymentMethod } | null }> } };

export type AdminGetBranchesQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetBranchesQuery = { __typename?: 'Query', adminGetBranches: Array<{ __typename?: 'BranchModel', id: string, name: string, city: string, address: string, phone: string, workingHours?: string | null, isActive: boolean, latitude?: number | null, longitude?: number | null, createdAt: string }> };

export type AdminGetOrderQueryVariables = Exact<{
  orderId: Scalars['String']['input'];
}>;


export type AdminGetOrderQuery = { __typename?: 'Query', adminGetOrder: { __typename?: 'OrderModel', id: string, status: OrderStatus, totalAmount: number, discountAmount?: number | null, createdAt: string, note?: string | null, userId: string, items: Array<{ __typename?: 'OrderItemModel', id: string, quantity: number, priceAtOrder: number, subtotal: number, variantName?: string | null, product?: { __typename?: 'OrderProductModel', id: string, name?: string | null, images: Array<string> } | null }>, shipping?: { __typename?: 'ShippingAddressModel', fullName: string, phone: string, city?: string | null, street?: string | null, building?: string | null, apartment?: string | null, postalCode?: string | null, deliveryType: DeliveryType, branchId?: string | null } | null, payment?: { __typename?: 'PaymentModel', id: string, method: PaymentMethod, status: PaymentsStatus, amount: number, currency: string, paidAt?: string | null, createdAt: string } | null } };

export type FindAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllCategoriesQuery = { __typename?: 'Query', findAllCategories: Array<{ __typename?: 'CategoryModel', id: string, name: string, slug: string, imageUrl?: string | null, parentId?: string | null, createdAt: string, children?: Array<{ __typename?: 'CategoryModel', id: string, name: string, slug: string, imageUrl?: string | null, createdAt: string }> | null }> };

export type FindAllProductsAdminQueryVariables = Exact<{
  filter?: InputMaybe<FilterProductInput>;
}>;


export type FindAllProductsAdminQuery = { __typename?: 'Query', findAllProductsAdmin: { __typename?: 'ProductListModel', data: Array<{ __typename?: 'ProductModel', id: string, name?: string | null, price?: number | null, discountedPrice?: number | null, stock: number, isDraft: boolean, isPublished: boolean, createdAt: string, medias?: Array<{ __typename?: 'ProductMediaModel', url: string, mediaType: MediaType }> | null, category?: { __typename?: 'ProductCategoryModel', id: string, name: string, parent?: { __typename?: 'ProductCategoryParentModel', id: string, name: string } | null } | null }>, meta: { __typename?: 'ProductMetaModel', total: number, page: number, limit: number, totalPages: number } } };

export type FindAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllUsersQuery = { __typename?: 'Query', findAllUser: Array<{ __typename?: 'UserModel', id: string, username: string, email: string, avatar?: string | null, role: Role, isEmailVerified: boolean, isDeactivated: boolean, createdAt: string }> };

export type FindProductByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FindProductByIdQuery = { __typename?: 'Query', findProductById: { __typename?: 'ProductModel', id: string, name?: string | null, price?: number | null, stock: number, isDraft: boolean, isPublished: boolean, categoryId?: string | null, description?: string | null, discountPercent?: number | null, createdAt: string, updatedAt: string, category?: { __typename?: 'ProductCategoryModel', id: string, name: string, parent?: { __typename?: 'ProductCategoryParentModel', id: string, name: string } | null } | null, medias?: Array<{ __typename?: 'ProductMediaModel', id: string, url: string, mediaType: MediaType }> | null } };

export type GetAnalyticsSummaryQueryVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
}>;


export type GetAnalyticsSummaryQuery = { __typename?: 'Query', getAnalyticsSummary: { __typename?: 'AnalyticsSummaryModel', totalRevenue: number, totalOrders: number, newCustomers: number, avgOrderValue: number, conversionRate: number, revenueByDay: Array<{ __typename?: 'RevenueByPeriodModel', date: string, revenue: number, ordersCount: number }>, topProducts: Array<{ __typename?: 'TopProductModel', productId: string, productName?: string | null, totalSold: number, totalRevenue: number }> } };

export type FindProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type FindProfileQuery = { __typename?: 'Query', findProfile: { __typename?: 'UserModel', id: string, username: string, email: string, avatar?: string | null, bio?: string | null, phoneNumber?: string | null, role: Role, isEmailVerified: boolean, isTotpEnabled: boolean, isVerified: boolean, isDeactivated: boolean, pendingNewEmail?: string | null, createdAt: string, updatedAt: string } };

export type GenerateTotpSecretQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateTotpSecretQuery = { __typename?: 'Query', generateTotpSecret: { __typename?: 'TotpModel', secret: string, qrcodeUrl: string } };

export type FindAllProductsQueryVariables = Exact<{
  filter?: InputMaybe<FilterProductInput>;
}>;


export type FindAllProductsQuery = { __typename?: 'Query', findAllProducts: { __typename?: 'ProductListModel', data: Array<{ __typename?: 'ProductModel', id: string, name?: string | null, price?: number | null, discountedPrice?: number | null, discountPercent?: number | null, stock: number, isPublished: boolean, category?: { __typename?: 'ProductCategoryModel', id: string, name: string, slug: string } | null, medias?: Array<{ __typename?: 'ProductMediaModel', id: string, url: string, mediaType: MediaType }> | null }>, meta: { __typename?: 'ProductMetaModel', total: number, page: number, limit: number, totalPages: number } } };

export type GetMyOrdersQueryVariables = Exact<{
  filter?: InputMaybe<FilterOrderInput>;
}>;


export type GetMyOrdersQuery = { __typename?: 'Query', getMyOrders: { __typename?: 'OrderListModel', total: number, page: number, limit: number, data: Array<{ __typename?: 'OrderModel', id: string, status: OrderStatus, totalAmount: number, discountAmount?: number | null, createdAt: string, note?: string | null, items: Array<{ __typename?: 'OrderItemModel', id: string, quantity: number, priceAtOrder: number, subtotal: number, variantName?: string | null, product?: { __typename?: 'OrderProductModel', id: string, name?: string | null, images: Array<string> } | null }>, shipping?: { __typename?: 'ShippingAddressModel', fullName: string, phone: string, city?: string | null, street?: string | null, building?: string | null, apartment?: string | null, deliveryType: DeliveryType, branchId?: string | null } | null, payment?: { __typename?: 'PaymentModel', method: PaymentMethod, status: PaymentsStatus, amount: number, currency: string, paidAt?: string | null } | null }> } };

export type GetProductReviewsQueryVariables = Exact<{
  productId: Scalars['String']['input'];
}>;


export type GetProductReviewsQuery = { __typename?: 'Query', getProductReviews: { __typename?: 'ReviewListModel', total: number, avgRating: number, data: Array<{ __typename?: 'ReviewModel', id: string, userId: string, rating: number, title?: string | null, text?: string | null, isVerified: boolean, createdAt: string }> } };

export type MyLoyaltyCardQueryVariables = Exact<{ [key: string]: never; }>;


export type MyLoyaltyCardQuery = { __typename?: 'Query', myLoyaltyCard: { __typename?: 'LoyaltyCardModel', id: string, totalOrders: number, discountPct: number, qrToken: string, qrUrl: string, createdAt: string, updatedAt: string } };


export const AdminRefundOrderDocument = gql`
    mutation AdminRefundOrder($orderId: String!) {
  adminRefundOrder(orderId: $orderId)
}
    `;
export type AdminRefundOrderMutationFn = ApolloReactCommon.MutationFunction<AdminRefundOrderMutation, AdminRefundOrderMutationVariables>;

/**
 * __useAdminRefundOrderMutation__
 *
 * To run a mutation, you first call `useAdminRefundOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminRefundOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminRefundOrderMutation, { data, loading, error }] = useAdminRefundOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useAdminRefundOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminRefundOrderMutation, AdminRefundOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminRefundOrderMutation, AdminRefundOrderMutationVariables>(AdminRefundOrderDocument, options);
      }
export type AdminRefundOrderMutationHookResult = ReturnType<typeof useAdminRefundOrderMutation>;
export type AdminRefundOrderMutationResult = ApolloReactCommon.MutationResult<AdminRefundOrderMutation>;
export type AdminRefundOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminRefundOrderMutation, AdminRefundOrderMutationVariables>;
export const AdminUpdateOrderStatusDocument = gql`
    mutation AdminUpdateOrderStatus($orderId: String!, $data: UpdateOrderStatusInput!) {
  adminUpdateOrderStatus(orderId: $orderId, data: $data) {
    id
    status
    updatedAt
  }
}
    `;
export type AdminUpdateOrderStatusMutationFn = ApolloReactCommon.MutationFunction<AdminUpdateOrderStatusMutation, AdminUpdateOrderStatusMutationVariables>;

/**
 * __useAdminUpdateOrderStatusMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOrderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOrderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOrderStatusMutation, { data, loading, error }] = useAdminUpdateOrderStatusMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAdminUpdateOrderStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminUpdateOrderStatusMutation, AdminUpdateOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminUpdateOrderStatusMutation, AdminUpdateOrderStatusMutationVariables>(AdminUpdateOrderStatusDocument, options);
      }
export type AdminUpdateOrderStatusMutationHookResult = ReturnType<typeof useAdminUpdateOrderStatusMutation>;
export type AdminUpdateOrderStatusMutationResult = ApolloReactCommon.MutationResult<AdminUpdateOrderStatusMutation>;
export type AdminUpdateOrderStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminUpdateOrderStatusMutation, AdminUpdateOrderStatusMutationVariables>;
export const AssignRoleDocument = gql`
    mutation AssignRole($userId: String!, $role: Role!) {
  assignRole(userId: $userId, role: $role) {
    id
    role
  }
}
    `;
export type AssignRoleMutationFn = ApolloReactCommon.MutationFunction<AssignRoleMutation, AssignRoleMutationVariables>;

/**
 * __useAssignRoleMutation__
 *
 * To run a mutation, you first call `useAssignRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignRoleMutation, { data, loading, error }] = useAssignRoleMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useAssignRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignRoleMutation, AssignRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AssignRoleMutation, AssignRoleMutationVariables>(AssignRoleDocument, options);
      }
export type AssignRoleMutationHookResult = ReturnType<typeof useAssignRoleMutation>;
export type AssignRoleMutationResult = ApolloReactCommon.MutationResult<AssignRoleMutation>;
export type AssignRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignRoleMutation, AssignRoleMutationVariables>;
export const AdminCreateBranchDocument = gql`
    mutation AdminCreateBranch($data: CreateBranchInput!) {
  adminCreateBranch(data: $data) {
    id
    name
    city
    address
    phone
    workingHours
    isActive
    latitude
    longitude
    createdAt
  }
}
    `;
export type AdminCreateBranchMutationFn = ApolloReactCommon.MutationFunction<AdminCreateBranchMutation, AdminCreateBranchMutationVariables>;

/**
 * __useAdminCreateBranchMutation__
 *
 * To run a mutation, you first call `useAdminCreateBranchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateBranchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateBranchMutation, { data, loading, error }] = useAdminCreateBranchMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAdminCreateBranchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminCreateBranchMutation, AdminCreateBranchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminCreateBranchMutation, AdminCreateBranchMutationVariables>(AdminCreateBranchDocument, options);
      }
export type AdminCreateBranchMutationHookResult = ReturnType<typeof useAdminCreateBranchMutation>;
export type AdminCreateBranchMutationResult = ApolloReactCommon.MutationResult<AdminCreateBranchMutation>;
export type AdminCreateBranchMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminCreateBranchMutation, AdminCreateBranchMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) {
    id
    name
    slug
    imageUrl
    parentId
    createdAt
  }
}
    `;
export type CreateCategoryMutationFn = ApolloReactCommon.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = ApolloReactCommon.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreateDraftProductDocument = gql`
    mutation CreateDraftProduct {
  createDraftProduct {
    id
    isDraft
  }
}
    `;
export type CreateDraftProductMutationFn = ApolloReactCommon.MutationFunction<CreateDraftProductMutation, CreateDraftProductMutationVariables>;

/**
 * __useCreateDraftProductMutation__
 *
 * To run a mutation, you first call `useCreateDraftProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDraftProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDraftProductMutation, { data, loading, error }] = useCreateDraftProductMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateDraftProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDraftProductMutation, CreateDraftProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateDraftProductMutation, CreateDraftProductMutationVariables>(CreateDraftProductDocument, options);
      }
export type CreateDraftProductMutationHookResult = ReturnType<typeof useCreateDraftProductMutation>;
export type CreateDraftProductMutationResult = ApolloReactCommon.MutationResult<CreateDraftProductMutation>;
export type CreateDraftProductMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDraftProductMutation, CreateDraftProductMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($data: CreateProductInput!) {
  createProduct(data: $data) {
    id
    name
    price
    stock
    isDraft
    isPublished
    categoryId
    createdAt
  }
}
    `;
export type CreateProductMutationFn = ApolloReactCommon.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = ApolloReactCommon.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const AdminDeleteBranchDocument = gql`
    mutation AdminDeleteBranch($id: String!) {
  adminDeleteBranch(id: $id)
}
    `;
export type AdminDeleteBranchMutationFn = ApolloReactCommon.MutationFunction<AdminDeleteBranchMutation, AdminDeleteBranchMutationVariables>;

/**
 * __useAdminDeleteBranchMutation__
 *
 * To run a mutation, you first call `useAdminDeleteBranchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteBranchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteBranchMutation, { data, loading, error }] = useAdminDeleteBranchMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminDeleteBranchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminDeleteBranchMutation, AdminDeleteBranchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminDeleteBranchMutation, AdminDeleteBranchMutationVariables>(AdminDeleteBranchDocument, options);
      }
export type AdminDeleteBranchMutationHookResult = ReturnType<typeof useAdminDeleteBranchMutation>;
export type AdminDeleteBranchMutationResult = ApolloReactCommon.MutationResult<AdminDeleteBranchMutation>;
export type AdminDeleteBranchMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminDeleteBranchMutation, AdminDeleteBranchMutationVariables>;
export const RemoveCategoryDocument = gql`
    mutation RemoveCategory($id: String!) {
  removeCategory(id: $id)
}
    `;
export type RemoveCategoryMutationFn = ApolloReactCommon.MutationFunction<RemoveCategoryMutation, RemoveCategoryMutationVariables>;

/**
 * __useRemoveCategoryMutation__
 *
 * To run a mutation, you first call `useRemoveCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCategoryMutation, { data, loading, error }] = useRemoveCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveCategoryMutation, RemoveCategoryMutationVariables>(RemoveCategoryDocument, options);
      }
export type RemoveCategoryMutationHookResult = ReturnType<typeof useRemoveCategoryMutation>;
export type RemoveCategoryMutationResult = ApolloReactCommon.MutationResult<RemoveCategoryMutation>;
export type RemoveCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const RemoveProductDocument = gql`
    mutation RemoveProduct($id: String!) {
  removeProduct(id: $id)
}
    `;
export type RemoveProductMutationFn = ApolloReactCommon.MutationFunction<RemoveProductMutation, RemoveProductMutationVariables>;

/**
 * __useRemoveProductMutation__
 *
 * To run a mutation, you first call `useRemoveProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProductMutation, { data, loading, error }] = useRemoveProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveProductMutation, RemoveProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveProductMutation, RemoveProductMutationVariables>(RemoveProductDocument, options);
      }
export type RemoveProductMutationHookResult = ReturnType<typeof useRemoveProductMutation>;
export type RemoveProductMutationResult = ApolloReactCommon.MutationResult<RemoveProductMutation>;
export type RemoveProductMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveProductMutation, RemoveProductMutationVariables>;
export const ToggleProductPublishDocument = gql`
    mutation ToggleProductPublish($id: String!) {
  toggleProductPublish(id: $id) {
    id
    isPublished
    isDraft
  }
}
    `;
export type ToggleProductPublishMutationFn = ApolloReactCommon.MutationFunction<ToggleProductPublishMutation, ToggleProductPublishMutationVariables>;

/**
 * __useToggleProductPublishMutation__
 *
 * To run a mutation, you first call `useToggleProductPublishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleProductPublishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleProductPublishMutation, { data, loading, error }] = useToggleProductPublishMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleProductPublishMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleProductPublishMutation, ToggleProductPublishMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleProductPublishMutation, ToggleProductPublishMutationVariables>(ToggleProductPublishDocument, options);
      }
export type ToggleProductPublishMutationHookResult = ReturnType<typeof useToggleProductPublishMutation>;
export type ToggleProductPublishMutationResult = ApolloReactCommon.MutationResult<ToggleProductPublishMutation>;
export type ToggleProductPublishMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleProductPublishMutation, ToggleProductPublishMutationVariables>;
export const AdminUpdateBranchDocument = gql`
    mutation AdminUpdateBranch($id: String!, $data: UpdateBranchInput!) {
  adminUpdateBranch(id: $id, data: $data) {
    id
    name
    city
    address
    phone
    workingHours
    isActive
    latitude
    longitude
    createdAt
  }
}
    `;
export type AdminUpdateBranchMutationFn = ApolloReactCommon.MutationFunction<AdminUpdateBranchMutation, AdminUpdateBranchMutationVariables>;

/**
 * __useAdminUpdateBranchMutation__
 *
 * To run a mutation, you first call `useAdminUpdateBranchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateBranchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateBranchMutation, { data, loading, error }] = useAdminUpdateBranchMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAdminUpdateBranchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AdminUpdateBranchMutation, AdminUpdateBranchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AdminUpdateBranchMutation, AdminUpdateBranchMutationVariables>(AdminUpdateBranchDocument, options);
      }
export type AdminUpdateBranchMutationHookResult = ReturnType<typeof useAdminUpdateBranchMutation>;
export type AdminUpdateBranchMutationResult = ApolloReactCommon.MutationResult<AdminUpdateBranchMutation>;
export type AdminUpdateBranchMutationOptions = ApolloReactCommon.BaseMutationOptions<AdminUpdateBranchMutation, AdminUpdateBranchMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
  updateCategory(id: $id, data: $data) {
    id
    name
    slug
    imageUrl
    updatedAt
  }
}
    `;
export type UpdateCategoryMutationFn = ApolloReactCommon.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = ApolloReactCommon.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: String!, $data: UpdateProductInput!) {
  updateProduct(id: $id, data: $data) {
    id
    name
    price
    stock
    isDraft
    isPublished
    categoryId
    description
    discountPercent
    updatedAt
  }
}
    `;
export type UpdateProductMutationFn = ApolloReactCommon.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = ApolloReactCommon.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId)
}
    `;
export type CancelOrderMutationFn = ApolloReactCommon.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = ApolloReactCommon.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    username
    email
    isEmailVerified
    isTotpEnabled
    isVerified
    role
    createdAt
  }
}
    `;
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeactivateAccountDocument = gql`
    mutation DeactivateAccount($data: DeactivateAccountInput!) {
  deactivateAccount(data: $data) {
    message
    user {
      id
      username
      email
      isDeactivated
      deactivatedAt
    }
  }
}
    `;
export type DeactivateAccountMutationFn = ApolloReactCommon.MutationFunction<DeactivateAccountMutation, DeactivateAccountMutationVariables>;

/**
 * __useDeactivateAccountMutation__
 *
 * To run a mutation, you first call `useDeactivateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateAccountMutation, { data, loading, error }] = useDeactivateAccountMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeactivateAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeactivateAccountMutation, DeactivateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeactivateAccountMutation, DeactivateAccountMutationVariables>(DeactivateAccountDocument, options);
      }
export type DeactivateAccountMutationHookResult = ReturnType<typeof useDeactivateAccountMutation>;
export type DeactivateAccountMutationResult = ApolloReactCommon.MutationResult<DeactivateAccountMutation>;
export type DeactivateAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<DeactivateAccountMutation, DeactivateAccountMutationVariables>;
export const DisableTotpDocument = gql`
    mutation DisableTotp {
  disableTotp
}
    `;
export type DisableTotpMutationFn = ApolloReactCommon.MutationFunction<DisableTotpMutation, DisableTotpMutationVariables>;

/**
 * __useDisableTotpMutation__
 *
 * To run a mutation, you first call `useDisableTotpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableTotpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableTotpMutation, { data, loading, error }] = useDisableTotpMutation({
 *   variables: {
 *   },
 * });
 */
export function useDisableTotpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DisableTotpMutation, DisableTotpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DisableTotpMutation, DisableTotpMutationVariables>(DisableTotpDocument, options);
      }
export type DisableTotpMutationHookResult = ReturnType<typeof useDisableTotpMutation>;
export type DisableTotpMutationResult = ApolloReactCommon.MutationResult<DisableTotpMutation>;
export type DisableTotpMutationOptions = ApolloReactCommon.BaseMutationOptions<DisableTotpMutation, DisableTotpMutationVariables>;
export const EnableTotpDocument = gql`
    mutation EnableTotp($data: EnableTotpInput!) {
  enableTotp(data: $data)
}
    `;
export type EnableTotpMutationFn = ApolloReactCommon.MutationFunction<EnableTotpMutation, EnableTotpMutationVariables>;

/**
 * __useEnableTotpMutation__
 *
 * To run a mutation, you first call `useEnableTotpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableTotpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableTotpMutation, { data, loading, error }] = useEnableTotpMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEnableTotpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnableTotpMutation, EnableTotpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnableTotpMutation, EnableTotpMutationVariables>(EnableTotpDocument, options);
      }
export type EnableTotpMutationHookResult = ReturnType<typeof useEnableTotpMutation>;
export type EnableTotpMutationResult = ApolloReactCommon.MutationResult<EnableTotpMutation>;
export type EnableTotpMutationOptions = ApolloReactCommon.BaseMutationOptions<EnableTotpMutation, EnableTotpMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($data: LoginInput!) {
  loginUser(data: $data) {
    message
    user {
      id
      username
      email
      avatar
      role
      isEmailVerified
      isTotpEnabled
      isVerified
      pendingNewEmail
      createdAt
    }
  }
}
    `;
export type LoginUserMutationFn = ApolloReactCommon.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = ApolloReactCommon.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;
export type LogoutUserMutationFn = ApolloReactCommon.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = ApolloReactCommon.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const NewEmailDocument = gql`
    mutation NewEmail($data: NewEmailInput!) {
  newEmail(data: $data)
}
    `;
export type NewEmailMutationFn = ApolloReactCommon.MutationFunction<NewEmailMutation, NewEmailMutationVariables>;

/**
 * __useNewEmailMutation__
 *
 * To run a mutation, you first call `useNewEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newEmailMutation, { data, loading, error }] = useNewEmailMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useNewEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<NewEmailMutation, NewEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<NewEmailMutation, NewEmailMutationVariables>(NewEmailDocument, options);
      }
export type NewEmailMutationHookResult = ReturnType<typeof useNewEmailMutation>;
export type NewEmailMutationResult = ApolloReactCommon.MutationResult<NewEmailMutation>;
export type NewEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<NewEmailMutation, NewEmailMutationVariables>;
export const NewPasswordDocument = gql`
    mutation NewPassword($data: NewPasswordInput!) {
  newPassword(data: $data)
}
    `;
export type NewPasswordMutationFn = ApolloReactCommon.MutationFunction<NewPasswordMutation, NewPasswordMutationVariables>;

/**
 * __useNewPasswordMutation__
 *
 * To run a mutation, you first call `useNewPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPasswordMutation, { data, loading, error }] = useNewPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useNewPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<NewPasswordMutation, NewPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<NewPasswordMutation, NewPasswordMutationVariables>(NewPasswordDocument, options);
      }
export type NewPasswordMutationHookResult = ReturnType<typeof useNewPasswordMutation>;
export type NewPasswordMutationResult = ApolloReactCommon.MutationResult<NewPasswordMutation>;
export type NewPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<NewPasswordMutation, NewPasswordMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail {
  resendVerificationEmail
}
    `;
export type ResendVerificationEmailMutationFn = ApolloReactCommon.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = ApolloReactCommon.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($data: ResetPasswordInput!) {
  resetPassword(data: $data)
}
    `;
export type ResetPasswordMutationFn = ApolloReactCommon.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = ApolloReactCommon.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const VerifyAccountDocument = gql`
    mutation VerifyAccount($data: VerificationInput!) {
  verifyAccount(data: $data) {
    id
    username
    email
    isEmailVerified
    isTotpEnabled
    isVerified
    role
    createdAt
  }
}
    `;
export type VerifyAccountMutationFn = ApolloReactCommon.MutationFunction<VerifyAccountMutation, VerifyAccountMutationVariables>;

/**
 * __useVerifyAccountMutation__
 *
 * To run a mutation, you first call `useVerifyAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyAccountMutation, { data, loading, error }] = useVerifyAccountMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useVerifyAccountMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerifyAccountMutation, VerifyAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<VerifyAccountMutation, VerifyAccountMutationVariables>(VerifyAccountDocument, options);
      }
export type VerifyAccountMutationHookResult = ReturnType<typeof useVerifyAccountMutation>;
export type VerifyAccountMutationResult = ApolloReactCommon.MutationResult<VerifyAccountMutation>;
export type VerifyAccountMutationOptions = ApolloReactCommon.BaseMutationOptions<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($data: CreateReviewInput!) {
  createReview(data: $data) {
    id
    userId
    rating
    title
    text
    isVerified
    createdAt
  }
}
    `;
export type CreateReviewMutationFn = ApolloReactCommon.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = ApolloReactCommon.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($reviewId: String!) {
  deleteReview(reviewId: $reviewId)
}
    `;
export type DeleteReviewMutationFn = ApolloReactCommon.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = ApolloReactCommon.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const AdminGetAllOrdersDocument = gql`
    query AdminGetAllOrders($filter: FilterOrderInput) {
  adminGetAllOrders(filter: $filter) {
    data {
      id
      status
      totalAmount
      discountAmount
      createdAt
      items {
        id
        quantity
        product {
          name
        }
      }
      shipping {
        fullName
        phone
        city
        deliveryType
      }
      payment {
        status
        method
      }
    }
    total
    page
    limit
  }
}
    `;

/**
 * __useAdminGetAllOrdersQuery__
 *
 * To run a query within a React component, call `useAdminGetAllOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminGetAllOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminGetAllOrdersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAdminGetAllOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>(AdminGetAllOrdersDocument, options);
      }
export function useAdminGetAllOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>(AdminGetAllOrdersDocument, options);
        }
// @ts-ignore
export function useAdminGetAllOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>;
export function useAdminGetAllOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetAllOrdersQuery | undefined, AdminGetAllOrdersQueryVariables>;
export function useAdminGetAllOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>(AdminGetAllOrdersDocument, options);
        }
export type AdminGetAllOrdersQueryHookResult = ReturnType<typeof useAdminGetAllOrdersQuery>;
export type AdminGetAllOrdersLazyQueryHookResult = ReturnType<typeof useAdminGetAllOrdersLazyQuery>;
export type AdminGetAllOrdersSuspenseQueryHookResult = ReturnType<typeof useAdminGetAllOrdersSuspenseQuery>;
export type AdminGetAllOrdersQueryResult = ApolloReactCommon.QueryResult<AdminGetAllOrdersQuery, AdminGetAllOrdersQueryVariables>;
export const AdminGetBranchesDocument = gql`
    query AdminGetBranches {
  adminGetBranches {
    id
    name
    city
    address
    phone
    workingHours
    isActive
    latitude
    longitude
    createdAt
  }
}
    `;

/**
 * __useAdminGetBranchesQuery__
 *
 * To run a query within a React component, call `useAdminGetBranchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminGetBranchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminGetBranchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminGetBranchesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>(AdminGetBranchesDocument, options);
      }
export function useAdminGetBranchesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>(AdminGetBranchesDocument, options);
        }
// @ts-ignore
export function useAdminGetBranchesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>;
export function useAdminGetBranchesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetBranchesQuery | undefined, AdminGetBranchesQueryVariables>;
export function useAdminGetBranchesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>(AdminGetBranchesDocument, options);
        }
export type AdminGetBranchesQueryHookResult = ReturnType<typeof useAdminGetBranchesQuery>;
export type AdminGetBranchesLazyQueryHookResult = ReturnType<typeof useAdminGetBranchesLazyQuery>;
export type AdminGetBranchesSuspenseQueryHookResult = ReturnType<typeof useAdminGetBranchesSuspenseQuery>;
export type AdminGetBranchesQueryResult = ApolloReactCommon.QueryResult<AdminGetBranchesQuery, AdminGetBranchesQueryVariables>;
export const AdminGetOrderDocument = gql`
    query AdminGetOrder($orderId: String!) {
  adminGetOrder(orderId: $orderId) {
    id
    status
    totalAmount
    discountAmount
    createdAt
    note
    userId
    items {
      id
      quantity
      priceAtOrder
      subtotal
      variantName
      product {
        id
        name
        images
      }
    }
    shipping {
      fullName
      phone
      city
      street
      building
      apartment
      postalCode
      deliveryType
      branchId
    }
    payment {
      id
      method
      status
      amount
      currency
      paidAt
      createdAt
    }
  }
}
    `;

/**
 * __useAdminGetOrderQuery__
 *
 * To run a query within a React component, call `useAdminGetOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminGetOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminGetOrderQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useAdminGetOrderQuery(baseOptions: ApolloReactHooks.QueryHookOptions<AdminGetOrderQuery, AdminGetOrderQueryVariables> & ({ variables: AdminGetOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AdminGetOrderQuery, AdminGetOrderQueryVariables>(AdminGetOrderDocument, options);
      }
export function useAdminGetOrderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AdminGetOrderQuery, AdminGetOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AdminGetOrderQuery, AdminGetOrderQueryVariables>(AdminGetOrderDocument, options);
        }
// @ts-ignore
export function useAdminGetOrderSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<AdminGetOrderQuery, AdminGetOrderQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetOrderQuery, AdminGetOrderQueryVariables>;
export function useAdminGetOrderSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetOrderQuery, AdminGetOrderQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<AdminGetOrderQuery | undefined, AdminGetOrderQueryVariables>;
export function useAdminGetOrderSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<AdminGetOrderQuery, AdminGetOrderQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<AdminGetOrderQuery, AdminGetOrderQueryVariables>(AdminGetOrderDocument, options);
        }
export type AdminGetOrderQueryHookResult = ReturnType<typeof useAdminGetOrderQuery>;
export type AdminGetOrderLazyQueryHookResult = ReturnType<typeof useAdminGetOrderLazyQuery>;
export type AdminGetOrderSuspenseQueryHookResult = ReturnType<typeof useAdminGetOrderSuspenseQuery>;
export type AdminGetOrderQueryResult = ApolloReactCommon.QueryResult<AdminGetOrderQuery, AdminGetOrderQueryVariables>;
export const FindAllCategoriesDocument = gql`
    query FindAllCategories {
  findAllCategories {
    id
    name
    slug
    imageUrl
    parentId
    children {
      id
      name
      slug
      imageUrl
      createdAt
    }
    createdAt
  }
}
    `;

/**
 * __useFindAllCategoriesQuery__
 *
 * To run a query within a React component, call `useFindAllCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindAllCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>(FindAllCategoriesDocument, options);
      }
export function useFindAllCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>(FindAllCategoriesDocument, options);
        }
// @ts-ignore
export function useFindAllCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>;
export function useFindAllCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllCategoriesQuery | undefined, FindAllCategoriesQueryVariables>;
export function useFindAllCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>(FindAllCategoriesDocument, options);
        }
export type FindAllCategoriesQueryHookResult = ReturnType<typeof useFindAllCategoriesQuery>;
export type FindAllCategoriesLazyQueryHookResult = ReturnType<typeof useFindAllCategoriesLazyQuery>;
export type FindAllCategoriesSuspenseQueryHookResult = ReturnType<typeof useFindAllCategoriesSuspenseQuery>;
export type FindAllCategoriesQueryResult = ApolloReactCommon.QueryResult<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>;
export const FindAllProductsAdminDocument = gql`
    query FindAllProductsAdmin($filter: FilterProductInput) {
  findAllProductsAdmin(filter: $filter) {
    data {
      id
      name
      price
      discountedPrice
      stock
      isDraft
      isPublished
      medias {
        url
        mediaType
      }
      category {
        id
        name
        parent {
          id
          name
        }
      }
      createdAt
    }
    meta {
      total
      page
      limit
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllProductsAdminQuery__
 *
 * To run a query within a React component, call `useFindAllProductsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllProductsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllProductsAdminQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllProductsAdminQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>(FindAllProductsAdminDocument, options);
      }
export function useFindAllProductsAdminLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>(FindAllProductsAdminDocument, options);
        }
// @ts-ignore
export function useFindAllProductsAdminSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>;
export function useFindAllProductsAdminSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllProductsAdminQuery | undefined, FindAllProductsAdminQueryVariables>;
export function useFindAllProductsAdminSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>(FindAllProductsAdminDocument, options);
        }
export type FindAllProductsAdminQueryHookResult = ReturnType<typeof useFindAllProductsAdminQuery>;
export type FindAllProductsAdminLazyQueryHookResult = ReturnType<typeof useFindAllProductsAdminLazyQuery>;
export type FindAllProductsAdminSuspenseQueryHookResult = ReturnType<typeof useFindAllProductsAdminSuspenseQuery>;
export type FindAllProductsAdminQueryResult = ApolloReactCommon.QueryResult<FindAllProductsAdminQuery, FindAllProductsAdminQueryVariables>;
export const FindAllUsersDocument = gql`
    query FindAllUsers {
  findAllUser {
    id
    username
    email
    avatar
    role
    isEmailVerified
    isDeactivated
    createdAt
  }
}
    `;

/**
 * __useFindAllUsersQuery__
 *
 * To run a query within a React component, call `useFindAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindAllUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
      }
export function useFindAllUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
// @ts-ignore
export function useFindAllUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllUsersQuery, FindAllUsersQueryVariables>;
export function useFindAllUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllUsersQuery | undefined, FindAllUsersQueryVariables>;
export function useFindAllUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
export type FindAllUsersQueryHookResult = ReturnType<typeof useFindAllUsersQuery>;
export type FindAllUsersLazyQueryHookResult = ReturnType<typeof useFindAllUsersLazyQuery>;
export type FindAllUsersSuspenseQueryHookResult = ReturnType<typeof useFindAllUsersSuspenseQuery>;
export type FindAllUsersQueryResult = ApolloReactCommon.QueryResult<FindAllUsersQuery, FindAllUsersQueryVariables>;
export const FindProductByIdDocument = gql`
    query FindProductById($id: String!) {
  findProductById(id: $id) {
    id
    name
    price
    stock
    isDraft
    isPublished
    categoryId
    description
    discountPercent
    createdAt
    updatedAt
    category {
      id
      name
      parent {
        id
        name
      }
    }
    medias {
      id
      url
      mediaType
    }
  }
}
    `;

/**
 * __useFindProductByIdQuery__
 *
 * To run a query within a React component, call `useFindProductByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProductByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProductByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFindProductByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables> & ({ variables: FindProductByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindProductByIdQuery, FindProductByIdQueryVariables>(FindProductByIdDocument, options);
      }
export function useFindProductByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindProductByIdQuery, FindProductByIdQueryVariables>(FindProductByIdDocument, options);
        }
// @ts-ignore
export function useFindProductByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindProductByIdQuery, FindProductByIdQueryVariables>;
export function useFindProductByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindProductByIdQuery | undefined, FindProductByIdQueryVariables>;
export function useFindProductByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindProductByIdQuery, FindProductByIdQueryVariables>(FindProductByIdDocument, options);
        }
export type FindProductByIdQueryHookResult = ReturnType<typeof useFindProductByIdQuery>;
export type FindProductByIdLazyQueryHookResult = ReturnType<typeof useFindProductByIdLazyQuery>;
export type FindProductByIdSuspenseQueryHookResult = ReturnType<typeof useFindProductByIdSuspenseQuery>;
export type FindProductByIdQueryResult = ApolloReactCommon.QueryResult<FindProductByIdQuery, FindProductByIdQueryVariables>;
export const GetAnalyticsSummaryDocument = gql`
    query GetAnalyticsSummary($from: String!, $to: String!) {
  getAnalyticsSummary(from: $from, to: $to) {
    totalRevenue
    totalOrders
    newCustomers
    avgOrderValue
    conversionRate
    revenueByDay {
      date
      revenue
      ordersCount
    }
    topProducts {
      productId
      productName
      totalSold
      totalRevenue
    }
  }
}
    `;

/**
 * __useGetAnalyticsSummaryQuery__
 *
 * To run a query within a React component, call `useGetAnalyticsSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnalyticsSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnalyticsSummaryQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useGetAnalyticsSummaryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables> & ({ variables: GetAnalyticsSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>(GetAnalyticsSummaryDocument, options);
      }
export function useGetAnalyticsSummaryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>(GetAnalyticsSummaryDocument, options);
        }
// @ts-ignore
export function useGetAnalyticsSummarySuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>;
export function useGetAnalyticsSummarySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAnalyticsSummaryQuery | undefined, GetAnalyticsSummaryQueryVariables>;
export function useGetAnalyticsSummarySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>(GetAnalyticsSummaryDocument, options);
        }
export type GetAnalyticsSummaryQueryHookResult = ReturnType<typeof useGetAnalyticsSummaryQuery>;
export type GetAnalyticsSummaryLazyQueryHookResult = ReturnType<typeof useGetAnalyticsSummaryLazyQuery>;
export type GetAnalyticsSummarySuspenseQueryHookResult = ReturnType<typeof useGetAnalyticsSummarySuspenseQuery>;
export type GetAnalyticsSummaryQueryResult = ApolloReactCommon.QueryResult<GetAnalyticsSummaryQuery, GetAnalyticsSummaryQueryVariables>;
export const FindProfileDocument = gql`
    query FindProfile {
  findProfile {
    id
    username
    email
    avatar
    bio
    phoneNumber
    role
    isEmailVerified
    isTotpEnabled
    isVerified
    isDeactivated
    pendingNewEmail
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useFindProfileQuery__
 *
 * To run a query within a React component, call `useFindProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindProfileQuery, FindProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindProfileQuery, FindProfileQueryVariables>(FindProfileDocument, options);
      }
export function useFindProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindProfileQuery, FindProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindProfileQuery, FindProfileQueryVariables>(FindProfileDocument, options);
        }
// @ts-ignore
export function useFindProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindProfileQuery, FindProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindProfileQuery, FindProfileQueryVariables>;
export function useFindProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindProfileQuery, FindProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindProfileQuery | undefined, FindProfileQueryVariables>;
export function useFindProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindProfileQuery, FindProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindProfileQuery, FindProfileQueryVariables>(FindProfileDocument, options);
        }
export type FindProfileQueryHookResult = ReturnType<typeof useFindProfileQuery>;
export type FindProfileLazyQueryHookResult = ReturnType<typeof useFindProfileLazyQuery>;
export type FindProfileSuspenseQueryHookResult = ReturnType<typeof useFindProfileSuspenseQuery>;
export type FindProfileQueryResult = ApolloReactCommon.QueryResult<FindProfileQuery, FindProfileQueryVariables>;
export const GenerateTotpSecretDocument = gql`
    query GenerateTotpSecret {
  generateTotpSecret {
    secret
    qrcodeUrl
  }
}
    `;

/**
 * __useGenerateTotpSecretQuery__
 *
 * To run a query within a React component, call `useGenerateTotpSecretQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateTotpSecretQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateTotpSecretQuery({
 *   variables: {
 *   },
 * });
 */
export function useGenerateTotpSecretQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>(GenerateTotpSecretDocument, options);
      }
export function useGenerateTotpSecretLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>(GenerateTotpSecretDocument, options);
        }
// @ts-ignore
export function useGenerateTotpSecretSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>;
export function useGenerateTotpSecretSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GenerateTotpSecretQuery | undefined, GenerateTotpSecretQueryVariables>;
export function useGenerateTotpSecretSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>(GenerateTotpSecretDocument, options);
        }
export type GenerateTotpSecretQueryHookResult = ReturnType<typeof useGenerateTotpSecretQuery>;
export type GenerateTotpSecretLazyQueryHookResult = ReturnType<typeof useGenerateTotpSecretLazyQuery>;
export type GenerateTotpSecretSuspenseQueryHookResult = ReturnType<typeof useGenerateTotpSecretSuspenseQuery>;
export type GenerateTotpSecretQueryResult = ApolloReactCommon.QueryResult<GenerateTotpSecretQuery, GenerateTotpSecretQueryVariables>;
export const FindAllProductsDocument = gql`
    query FindAllProducts($filter: FilterProductInput) {
  findAllProducts(filter: $filter) {
    data {
      id
      name
      price
      discountedPrice
      discountPercent
      stock
      isPublished
      category {
        id
        name
        slug
      }
      medias {
        id
        url
        mediaType
      }
    }
    meta {
      total
      page
      limit
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllProductsQuery__
 *
 * To run a query within a React component, call `useFindAllProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllProductsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FindAllProductsQuery, FindAllProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindAllProductsQuery, FindAllProductsQueryVariables>(FindAllProductsDocument, options);
      }
export function useFindAllProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindAllProductsQuery, FindAllProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindAllProductsQuery, FindAllProductsQueryVariables>(FindAllProductsDocument, options);
        }
// @ts-ignore
export function useFindAllProductsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsQuery, FindAllProductsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllProductsQuery, FindAllProductsQueryVariables>;
export function useFindAllProductsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsQuery, FindAllProductsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<FindAllProductsQuery | undefined, FindAllProductsQueryVariables>;
export function useFindAllProductsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindAllProductsQuery, FindAllProductsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindAllProductsQuery, FindAllProductsQueryVariables>(FindAllProductsDocument, options);
        }
export type FindAllProductsQueryHookResult = ReturnType<typeof useFindAllProductsQuery>;
export type FindAllProductsLazyQueryHookResult = ReturnType<typeof useFindAllProductsLazyQuery>;
export type FindAllProductsSuspenseQueryHookResult = ReturnType<typeof useFindAllProductsSuspenseQuery>;
export type FindAllProductsQueryResult = ApolloReactCommon.QueryResult<FindAllProductsQuery, FindAllProductsQueryVariables>;
export const GetMyOrdersDocument = gql`
    query GetMyOrders($filter: FilterOrderInput) {
  getMyOrders(filter: $filter) {
    data {
      id
      status
      totalAmount
      discountAmount
      createdAt
      note
      items {
        id
        quantity
        priceAtOrder
        subtotal
        variantName
        product {
          id
          name
          images
        }
      }
      shipping {
        fullName
        phone
        city
        street
        building
        apartment
        deliveryType
        branchId
      }
      payment {
        method
        status
        amount
        currency
        paidAt
      }
    }
    total
    page
    limit
  }
}
    `;

/**
 * __useGetMyOrdersQuery__
 *
 * To run a query within a React component, call `useGetMyOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyOrdersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetMyOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
      }
export function useGetMyOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
        }
// @ts-ignore
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyOrdersQuery, GetMyOrdersQueryVariables>;
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetMyOrdersQuery | undefined, GetMyOrdersQueryVariables>;
export function useGetMyOrdersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetMyOrdersQuery, GetMyOrdersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetMyOrdersQuery, GetMyOrdersQueryVariables>(GetMyOrdersDocument, options);
        }
export type GetMyOrdersQueryHookResult = ReturnType<typeof useGetMyOrdersQuery>;
export type GetMyOrdersLazyQueryHookResult = ReturnType<typeof useGetMyOrdersLazyQuery>;
export type GetMyOrdersSuspenseQueryHookResult = ReturnType<typeof useGetMyOrdersSuspenseQuery>;
export type GetMyOrdersQueryResult = ApolloReactCommon.QueryResult<GetMyOrdersQuery, GetMyOrdersQueryVariables>;
export const GetProductReviewsDocument = gql`
    query GetProductReviews($productId: String!) {
  getProductReviews(productId: $productId) {
    total
    avgRating
    data {
      id
      userId
      rating
      title
      text
      isVerified
      createdAt
    }
  }
}
    `;

/**
 * __useGetProductReviewsQuery__
 *
 * To run a query within a React component, call `useGetProductReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductReviewsQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useGetProductReviewsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetProductReviewsQuery, GetProductReviewsQueryVariables> & ({ variables: GetProductReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetProductReviewsQuery, GetProductReviewsQueryVariables>(GetProductReviewsDocument, options);
      }
export function useGetProductReviewsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductReviewsQuery, GetProductReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetProductReviewsQuery, GetProductReviewsQueryVariables>(GetProductReviewsDocument, options);
        }
// @ts-ignore
export function useGetProductReviewsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetProductReviewsQuery, GetProductReviewsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetProductReviewsQuery, GetProductReviewsQueryVariables>;
export function useGetProductReviewsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetProductReviewsQuery, GetProductReviewsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetProductReviewsQuery | undefined, GetProductReviewsQueryVariables>;
export function useGetProductReviewsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetProductReviewsQuery, GetProductReviewsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetProductReviewsQuery, GetProductReviewsQueryVariables>(GetProductReviewsDocument, options);
        }
export type GetProductReviewsQueryHookResult = ReturnType<typeof useGetProductReviewsQuery>;
export type GetProductReviewsLazyQueryHookResult = ReturnType<typeof useGetProductReviewsLazyQuery>;
export type GetProductReviewsSuspenseQueryHookResult = ReturnType<typeof useGetProductReviewsSuspenseQuery>;
export type GetProductReviewsQueryResult = ApolloReactCommon.QueryResult<GetProductReviewsQuery, GetProductReviewsQueryVariables>;
export const MyLoyaltyCardDocument = gql`
    query MyLoyaltyCard {
  myLoyaltyCard {
    id
    totalOrders
    discountPct
    qrToken
    qrUrl
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMyLoyaltyCardQuery__
 *
 * To run a query within a React component, call `useMyLoyaltyCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLoyaltyCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyLoyaltyCardQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyLoyaltyCardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>(MyLoyaltyCardDocument, options);
      }
export function useMyLoyaltyCardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>(MyLoyaltyCardDocument, options);
        }
// @ts-ignore
export function useMyLoyaltyCardSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>;
export function useMyLoyaltyCardSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<MyLoyaltyCardQuery | undefined, MyLoyaltyCardQueryVariables>;
export function useMyLoyaltyCardSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>(MyLoyaltyCardDocument, options);
        }
export type MyLoyaltyCardQueryHookResult = ReturnType<typeof useMyLoyaltyCardQuery>;
export type MyLoyaltyCardLazyQueryHookResult = ReturnType<typeof useMyLoyaltyCardLazyQuery>;
export type MyLoyaltyCardSuspenseQueryHookResult = ReturnType<typeof useMyLoyaltyCardSuspenseQuery>;
export type MyLoyaltyCardQueryResult = ApolloReactCommon.QueryResult<MyLoyaltyCardQuery, MyLoyaltyCardQueryVariables>;