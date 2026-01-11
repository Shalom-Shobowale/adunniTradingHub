import { CheckCircle, Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function OrderConfirmationPage({ orderNumber, onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            You will receive an email confirmation once your payment has been
            successfully verified. We’ll notify you again when your order ships.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-600 mb-2">Your Order Number</p>
            <p className="text-2xl font-bold text-[#CA993B]">{orderNumber}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mb-6">
            <h2 className="font-bold mb-2">Bank Transfer Details</h2>

            <p>
              <strong>Bank Name:</strong> Wema Bank
            </p>
            <p>
              <strong>Account Name:</strong> Bakare Risikat
            </p>
            <p>
              <strong>Account Number:</strong> 0222871716
            </p>

            <p className="mt-3 text-sm text-red-600">
              ⚠️ Use <strong>{orderNumber}</strong> as your payment reference.
            </p>
          </div>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start space-x-3">
              <Package className="h-6 w-6 text-[#CA993B] mt-1" />
              <div>
                <h3 className="font-bold mb-1">What's Next?</h3>
                <p className="text-gray-600">
                  You'll receive an email confirmation with your order details.
                  We'll notify you when your order ships.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button fullWidth onClick={() => onNavigate("dashboard")}>
              View My Orders
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => onNavigate("home")}
            >
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
