import React from 'react';

const DomainImportantDates = ({ whois }) => {
  if (!whois) return null;
  return (
    <div className="domain-important-dates">
      <h3>Important Dates</h3>
      <ul>
        <li><strong>Updated Date:</strong> {whois.updatedDate}</li>
        <li><strong>Creation Date:</strong> {whois.creationDate}</li>
        <li><strong>Registry Expiry Date:</strong> {whois.registryExpiryDate}</li>
        <li><strong>Registrar Registration Expiry Date:</strong> {whois.registrarRegistrationExpirationDate}</li>
      </ul>
    </div>
  );
};

export default DomainImportantDates;
