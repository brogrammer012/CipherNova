import React from 'react';

const DomainRegistrarInfo = ({ whois }) => {
  if (!whois) return null;
  return (
    <div className="domain-registrar-info">
      <h3>Registrar Information</h3>
      <ul>
        <li><strong>Domain Name:</strong> {whois.domainName}</li>
        <li><strong>Registry Domain ID:</strong> {whois.registryDomainId}</li>
        <li><strong>Registrar:</strong> {whois.registrar}</li>
        <li><strong>Registrar IANA ID:</strong> {whois.registrarIanaId}</li>
        <li><strong>Domain Status:</strong> {whois.domainStatus}</li>
      </ul>
    </div>
  );
};

export default DomainRegistrarInfo;
