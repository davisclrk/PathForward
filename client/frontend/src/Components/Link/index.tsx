import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkButtonProps {
    linkToken: string;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ linkToken }) => {
  const onSuccess = React.useCallback((public_token: any, metadata: any) => {
    // send public_token to your server
    console.log('Public Token: ', public_token);
    console.log('Metadata: ', metadata);
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
    onExit: (error: any, metadata: any) => {
      // handle the exit event
      console.log('Exit: ', error, metadata);
    },
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button type="button" onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLinkButton;