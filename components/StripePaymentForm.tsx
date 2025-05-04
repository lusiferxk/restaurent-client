// "use client";

// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { useState } from 'react';
// import { toast } from 'react-hot-toast';

// interface StripePaymentFormProps {
//   orderId: string;
//   totalAmount: number;
//   restaurantId: string;
//   onPaymentSuccess: () => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// const StripePaymentForm = ({
//   orderId,
//   totalAmount,
//   restaurantId,
//   onPaymentSuccess,
//   loading,
//   setLoading
// }: StripePaymentFormProps) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement)!,
//       }
//     });

//     if (stripeError) {
//       setError(stripeError.message || 'Payment failed');
//       setLoading(false);
//       toast.error(stripeError.message || 'Payment failed');
//       return;
//     }

//     if (paymentIntent?.status === 'succeeded') {
//       onPaymentSuccess();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-4">
//       <div className="mb-4">
//         <div className="border rounded-md p-3">
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: '16px',
//                   color: '#424770',
//                   '::placeholder': {
//                     color: '#aab7c4',
//                   },
//                 },
//                 invalid: {
//                   color: '#9e2146',
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className={`w-full bg-purple-600 text-white py-3 rounded-lg font-medium ${
//           !stripe || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
//         }`}
//       >
//         {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
//       </button>
//     </form>
//   );
// };

// export default StripePaymentForm;

// components/StripePaymentForm.tsx
"use client";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface StripePaymentFormProps {
  orderId: string;
  totalAmount: number;
  restaurantId: string;
  onPaymentSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clientSecret: string; // Added this line
}

const StripePaymentForm = ({
  orderId,
  totalAmount,
  restaurantId,
  onPaymentSuccess,
  loading,
  setLoading,
  clientSecret 
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
      toast.error(stripeError.message || 'Payment failed');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <div className="border rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-purple-600 text-white py-3 rounded-lg font-medium ${
          !stripe || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;