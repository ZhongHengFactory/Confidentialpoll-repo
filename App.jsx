import React, { useEffect, useState } from 'react';
import { createEncryptedVote, toBytes } from './fheClient';
import { ethers } from 'ethers';
import ABI from './FHEVotingABI.json';

export default function App(){
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('');
  const [contractAddr, setContractAddr] = useState(import.meta.env.VITE_CONTRACT || '');
  const options = ['Option A','Option B','Option C'];

  useEffect(()=>{
    if(window.ethereum){
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
    }
  },[]);

  async function connect(){
    if(!window.ethereum) return alert('Install MetaMask');
    await window.ethereum.request({method:'eth_requestAccounts'});
    const accounts = await window.ethereum.request({method:'eth_accounts'});
    setAccount(accounts[0]);
    setStatus('Wallet connected: ' + accounts[0].slice(0,8));
  }

  async function vote(i){
    if(!provider) return alert('Connect wallet');
    if(!contractAddr) return alert('Set VITE_CONTRACT env before deploy');
    try{
      setStatus('Encrypting vote...');
      const cipher = await createEncryptedVote();
      const bytes = toBytes(cipher);
      setStatus('Sending encrypted vote transaction...');
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddr, ABI, signer);
      const tx = await contract.submitEncryptedVote(i, bytes);
      await tx.wait();
      setStatus('Submitted (encrypted).');
    }catch(e){
      console.error(e);
      setStatus('Error: ' + (e.message||e));
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>ConfidentialPoll</h1>
        <p className="lead">Privacy-preserving on-chain voting (FHEVM demo).</p>
        <div className="small">Contract: <strong>{contractAddr || 'not set'}</strong></div>
        <div style={{marginTop:12}}>
          {!account ? <button onClick={connect} className="opt">Connect Wallet</button> : <div className="small">Connected: {account}</div>}
        </div>
        <div className="options">
          {options.map((o,i)=>(
            <button key={i} className="opt" onClick={()=>vote(i)}>{o}</button>
          ))}
        </div>
        <div className="status">{status}</div>
        <p className="small" style={{marginTop:10}}>
          This demo encrypts votes locally using the FHE SDK and submits ciphertexts to the contract. The smart contract only stores encrypted buckets and performs homomorphic adds.
        </p>
      </div>
    </div>
  );
}
