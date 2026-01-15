import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppContent from './src/App';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppContent />
    </>
  );
}
