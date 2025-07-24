import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { generateBookingPDF } from '../../PDFGeneratorReact';

// Generate and download PDF using React components
export const downloadReactPDF = async (jobData, jobId, otp) => {
  try {
    console.log('Generating PDF with data:', { jobData, jobId, otp });
    
    // Generate the PDF with QR codes and barcodes
    const documentWithCodes = await generateBookingPDF(jobData, jobId, otp);
    const blob = await pdf(documentWithCodes).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Phoenix_Shipper_Complete_${jobId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PDF downloaded successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};


// Generate PDF blob for preview (without download)
export const generateReactPDFBlob = async (jobData, jobId, otp) => {
  try {
    // Generate the PDF with QR codes and barcodes
    const documentWithCodes = await generateBookingPDF(jobData, jobId, otp);
    const blob = await pdf(documentWithCodes).toBlob();
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};

// Generate PDF as base64 string
export const generateReactPDFBase64 = async (jobData, jobId, otp) => {
  try {
    // Generate the PDF with QR codes and barcodes
    const documentWithCodes = await generateBookingPDF(jobData, jobId, otp);
    const pdfDoc = pdf(documentWithCodes);
    
    const blob = await pdfDoc.toBlob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    throw error;
  }
};

// Backward compatibility - Main PDF download function matching original API
export const downloadBookingPDF = async (jobData, jobId, otp) => {
  try {
    if (!jobData || !jobId || !otp) {
      throw new Error('Missing required data for PDF generation');
    }

    console.log('Generating comprehensive PDF with React PDF Renderer...');
    
    // Generate the PDF with QR codes and barcodes
    const documentWithCodes = await generateBookingPDF(jobData, jobId, otp);
    const blob = await pdf(documentWithCodes).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Phoenix_Shipper_Complete_${jobId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Comprehensive PDF generated successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    return false;
  }
};