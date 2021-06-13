import express,{Request,Response,NextFunction} from 'express';
import braintree from 'braintree';

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "ftxwvg7rcsqjjg8r",
    publicKey: "65tyf8y2kpcq25v8",
    privateKey: "a5fd5d6ee70a137ec76ab20819e7775b"
  });

export const getToken=(req:Request,res:Response)=>{
    gateway.clientToken.generate({}).then((response)=>{
        return res.json(response)
    }).catch(error =>{ return res.status(500).json(error)})
}

export const processPayment=(req:Request, res:Response)=>{
    const { nonceFromTheClient, totalAmount } = req.body
    gateway.transaction.sale({
        amount: totalAmount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }).then((response)=>{
        return res.json(response)
      }).catch(error=>{return res.status(500).json(error)});
}