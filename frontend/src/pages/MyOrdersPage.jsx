import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/useAuth";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";
import { formatCurrency } from "../lib/utils";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token;

        const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <Button onClick={() => navigate("/products")}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-bold text-lg text-[#CA993B]">
                  {order.order_number}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">{formatCurrency(order.total)}</p>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 border-t pt-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>

            {/* Payment Status */}
            <div className="mt-4 text-sm">
              Payment:{" "}
              <span className="font-medium">
                {order.payment_status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}