import React, { Suspense } from "react";
import LoginScreen from "./LoginScreen";

export default function Page() {
  return (
    <Suspense fallback={<div className="container section-padding" style={{ textAlign: 'center' }}>Initialising...</div>}>
      <LoginScreen />
    </Suspense>
  );
}
