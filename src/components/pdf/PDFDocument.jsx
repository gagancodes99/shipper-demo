import { Document } from '@react-pdf/renderer';
import MasterPage from './pages/MasterPage';

const ShippingPDFDocument = ({ jobData, jobId, otp }) => {
  return (
    <Document>
      {/* Master Summary Page */}
      <MasterPage 
        jobData={jobData} 
        jobId={jobId} 
        otp={otp} 
      />
      
      {/* TODO: Add individual pickup and delivery pages */}
      {/* These will be implemented in the next phase */}
    </Document>
  );
};

export default ShippingPDFDocument;