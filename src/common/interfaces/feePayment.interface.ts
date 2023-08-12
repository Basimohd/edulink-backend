export interface feePaymentDetail {
    year: number;
    amountPaid: number;
    paymentDate: Date;
    transactionId: string;
  }

  export const feePaymentDetailType ={
    year: { type: Number },
    amountPaid: { type: Number },
    paymentDate: { type: Date },
    transactionId: { type: String },
  }