import { Capacitor } from '@capacitor/core';

export function testCapacitor() {
  console.log('Capacitor Platform:', Capacitor.getPlatform());
  console.log('Is Native Platform:', Capacitor.isNativePlatform());
  
  return {
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform()
  };
}