import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkButtonProps {
    linkToken: string;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ linkToken }) => {
  const onSuccess = React.useCallback(async(public_token: any, metadata: any) => {
    const userId = localStorage.getItem('userId');
    const endpoint = 'http://localhost:4000/api/createAccessToken';
    const body = {
      userId: userId,
      public_token: public_token
    };
    console.log('Public Token: ', public_token);
    const response = await fetch(endpoint, {body : JSON.stringify(body), headers: {'Content-Type': 'application/json'}, method: 'POST'});
    if (response.status === 200) {
      console.log('Successfully created access token');
    } else {
      console.log('Error creating access token');
    }
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