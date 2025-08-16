import * as WebBrowser from 'expo-web-browser';
import { ethers } from 'ethers';

let stripePublishableKey: string | null = null;

export const initStripe = async (publishableKey: string) => {
  stripePublishableKey = publishableKey;
  return true;
};

export const startStripeCheckout = async (paymentLinkUrl: string) => {
  await WebBrowser.openBrowserAsync(paymentLinkUrl);
};

export const startPayPalCheckout = async (approvalUrl: string) => {
  await WebBrowser.openBrowserAsync(approvalUrl);
};

export const startWiseTransfer = async (wisePayUrl: string) => {
  await WebBrowser.openBrowserAsync(wisePayUrl);
};

export const payWithCrypto = async (recipientAddress: string, amountEth: string) => {
  const wei = ethers.parseEther(amountEth);
  return { to: recipientAddress, value: wei.toString() };
};