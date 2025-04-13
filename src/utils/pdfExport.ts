
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { InvoiceItem } from '@/types/invoice';

export const exportToPdf = async (
  invoiceData: {
    items: InvoiceItem[];
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
    vehicleInfo: {
      registration: string;
      odometer: string;
      makeModel: string;
    };
    invoiceInfo: {
      number: string;
      date: string;
      gstNumber: string;
      serviceDate: string;
      nextServiceDate: string;
      salesperson: string;
      enteredBy: string;
      crimNumber: string;
    };
    companyInfo: {
      name: string;
      address: string[];
      phone: string;
    };
    calculation: {
      subtotal: number;
      discount: number;
      discountType: 'percentage' | 'fixed';
      gst: number;
      total: number;
      rounding: number;
    };
    saleNote: string;
  },
  companyLogo: string
) => {
  try {
    // Create a new jsPDF instance with autoTable typing support
    const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };

    // Add logo
    doc.addImage(companyLogo, 'PNG', 10, 10, 50, 25);

    // Add invoice title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 190, 20, { align: 'right' });

    // Add company details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceData.companyInfo.name, 10, 45);
    invoiceData.companyInfo.address.forEach((line, index) => {
      doc.text(line, 10, 50 + (index * 5));
    });
    doc.text(`Phone: ${invoiceData.companyInfo.phone}`, 10, 65);

    // Add invoice details
    doc.text(`Invoice #: ${invoiceData.invoiceInfo.number}`, 190, 45, { align: 'right' });
    doc.text(`Date: ${invoiceData.invoiceInfo.date}`, 190, 50, { align: 'right' });
    doc.text(`GST #: ${invoiceData.invoiceInfo.gstNumber}`, 190, 55, { align: 'right' });

    // Add customer details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 10, 80);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${invoiceData.customerInfo.name}`, 10, 85);
    doc.text(`Phone: ${invoiceData.customerInfo.phone}`, 10, 90);
    doc.text(`Email: ${invoiceData.customerInfo.email}`, 10, 95);

    // Add vehicle details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE DETAILS:', 140, 80);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Registration: ${invoiceData.vehicleInfo.registration}`, 140, 85);
    doc.text(`Odometer: ${invoiceData.vehicleInfo.odometer}`, 140, 90);
    doc.text(`Make/Model: ${invoiceData.vehicleInfo.makeModel}`, 140, 95);

    // Add service details
    doc.text(`Service Date: ${invoiceData.invoiceInfo.serviceDate}`, 10, 105);
    doc.text(`CRIM #: ${invoiceData.invoiceInfo.crimNumber}`, 140, 105);
    doc.text(`Salesperson: ${invoiceData.invoiceInfo.salesperson}`, 10, 110);
    doc.text(`Entered by: ${invoiceData.invoiceInfo.enteredBy}`, 140, 110);

    // Add invoice items table
    autoTable(doc, {
      startY: 120,
      head: [['Item/Service', 'Description', 'Qty', 'Unit Price', 'Total']],
      body: invoiceData.items.map(item => [
        item.name,
        item.description,
        item.quantity.toString(),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.total.toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [245, 166, 35],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9
      }
    });

    // Position after table
    const contentStartY = doc.lastAutoTable.finalY + 10;
    
    // Add totals
    const totalsStartY = contentStartY;
    
    doc.setFont('helvetica', 'normal');
    const discountText = invoiceData.calculation.discountType === 'percentage'
      ? `Discount (${invoiceData.calculation.discount}%):`
      : 'Discount:';

    const discountAmount = invoiceData.calculation.discountType === 'percentage'
      ? (invoiceData.calculation.subtotal * (invoiceData.calculation.discount / 100))
      : invoiceData.calculation.discount;

    doc.text('Subtotal:', 150, totalsStartY, { align: 'right' });
    doc.text(`$${invoiceData.calculation.subtotal.toFixed(2)}`, 190, totalsStartY, { align: 'right' });

    doc.text(discountText, 150, totalsStartY + 5, { align: 'right' });
    doc.text(`$${discountAmount.toFixed(2)}`, 190, totalsStartY + 5, { align: 'right' });

    doc.text('GST (15%):', 150, totalsStartY + 10, { align: 'right' });
    doc.text(`$${invoiceData.calculation.gst.toFixed(2)}`, 190, totalsStartY + 10, { align: 'right' });

    let finalTotalY = totalsStartY + 15;
    
    if (invoiceData.calculation.rounding !== 0) {
      doc.text('Rounding:', 150, totalsStartY + 15, { align: 'right' });
      doc.text(`$${invoiceData.calculation.rounding.toFixed(2)}`, 190, totalsStartY + 15, { align: 'right' });
      finalTotalY = totalsStartY + 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 150, finalTotalY, { align: 'right' });
    doc.text(`$${invoiceData.calculation.total.toFixed(2)}`, 190, finalTotalY, { align: 'right' });
    
    // Add next service date below totals
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Next Service Date: ${invoiceData.invoiceInfo.nextServiceDate}`, 10, finalTotalY + 10);
    
    // Calculate position for sales note, which comes at the very end
    const noteY = finalTotalY + 20;
    
    // Check if there's enough space for the sales note
    const availableHeight = doc.internal.pageSize.height - noteY - 20; // 20 points buffer for footer
    
    // Add sales note (last element)
    doc.setFont('helvetica', 'italic');
    doc.text('Note:', 10, noteY);
    
    // Split long note text into multiple lines
    const noteText = invoiceData.saleNote || '';
    const splitNoteText = doc.splitTextToSize(noteText, 180);
    
    // Check if note will fit on current page or needs a new page
    if (splitNoteText.length * 5 > availableHeight) {
      // Not enough space, add a new page
      doc.addPage();
      
      // Add sales note on the new page
      doc.setFont('helvetica', 'italic');
      doc.text('Note:', 10, 20);
      doc.text(splitNoteText, 10, 30);
      
      // Add footer on the new page
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    } else {
      // Enough space, add note on current page
      doc.text(splitNoteText, 10, noteY + 10);
      
      // Add footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    }

    // Save the PDF
    doc.save(`Invoice-${invoiceData.invoiceInfo.number}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
