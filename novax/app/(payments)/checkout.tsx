import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PrimaryButton, Card } from '@/src/components/UI';
import { initStripe, startStripeCheckout, startPayPalCheckout, startWiseTransfer, payWithCrypto } from '@/src/services/payments';
import { useUserStore } from '@/src/stores/userStore';

export default function Checkout() {
  const user = useUserStore((s) => s.user);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    initStripe('pk_test_12345').finally(() => setReady(true));
  }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Payments</Text>
      <Card>
        <Text>Pay with Stripe</Text>
        <PrimaryButton title="Stripe Checkout" onPress={() => startStripeCheckout('https://buy.stripe.com/test_123')} />
      </Card>
      <Card>
        <Text>Pay with PayPal</Text>
        <PrimaryButton title="PayPal Checkout" onPress={() => startPayPalCheckout('https://www.sandbox.paypal.com/checkoutnow?token=EC-TEST')} />
      </Card>
      <Card>
        <Text>Pay with Wise</Text>
        <PrimaryButton title="Wise Transfer" onPress={() => startWiseTransfer('https://wise.com/transfer')} />
      </Card>
      <Card>
        <Text>Crypto Payment</Text>
        <PrimaryButton title="Generate ETH Payment" onPress={async () => {
          const tx = await payWithCrypto('0x000000000000000000000000000000000000dead', '0.01');
          alert(`Send ${tx.value} wei to ${tx.to}`);
        }} />
      </Card>
    </ScrollView>
  );
}