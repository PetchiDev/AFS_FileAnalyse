import React from 'react';
import { useMsal, MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType, InteractionStatus } from '@azure/msal-browser';

const AuthGuard = ({ children }) => {
  const { inProgress } = useMsal();

  // Temporary bypass for local development
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
    return <>{children}</>;
  }

  // If a redirect is being handled, show loading to avoid redundant triggers
  if (inProgress === InteractionStatus.HandleRedirect) {
    return <LoadingComponent />;
  }

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={{
        scopes: ['user.read']
      }}
      errorComponent={ErrorComponent}
      loadingComponent={LoadingComponent}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
};

const ErrorComponent = ({ error }) => {
  return <p>An error occurred: {error.errorMessage}</p>;
};

const LoadingComponent = () => {
  return <p>Authentication in progress...</p>;
};

export default AuthGuard;
