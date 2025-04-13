
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

    // Add next service date ABOVE the sales note
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Next Service Date: ${invoiceData.invoiceInfo.nextServiceDate}`, 10, contentStartY);

    // Add sale note below the next service date
    const noteY = contentStartY + 7;
    doc.setFont('helvetica', 'italic');
    doc.text('Note:', 10, noteY);
    
    // Split long note text into multiple lines with max width to prevent overlapping
    const noteText = invoiceData.saleNote || '';
    const splitNoteText = doc.splitTextToSize(noteText, 150);
    
    // Calculate if note will fit on current page
    const availableHeight = doc.internal.pageSize.height - noteY - 50; // 50 points buffer for footer and margins
    const estimatedNoteHeight = splitNoteText.length * 5; // Approximately 5 points per line
    
    let currentY = noteY;
    
    // If note will not fit completely on this page, split it across pages
    if (estimatedNoteHeight > availableHeight) {
      // Calculate how many lines can fit on current page
      const linesPerPage = Math.floor(availableHeight / 5);
      const firstPageLines = splitNoteText.slice(0, linesPerPage);
      const remainingLines = splitNoteText.slice(linesPerPage);
      
      // Draw first part of the note
      doc.text(firstPageLines, 25, noteY);
      
      // Add a new page
      doc.addPage();
      
      // Continue note on new page
      doc.text('Note (continued):', 10, 20);
      doc.text(remainingLines, 25, 20);
      
      // Update Y position for totals (on new page)
      currentY = 20 + remainingLines.length * 5 + 10;
    } else {
      // Note fits on current page, draw it normally
      doc.text(splitNoteText, 25, noteY);
      currentY = noteY + estimatedNoteHeight + 10;
    }

    // Add totals (either on current or new page)
    const totalsStartY = currentY;
    
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

    if (invoiceData.calculation.rounding !== 0) {
      doc.text('Rounding:', 150, totalsStartY + 15, { align: 'right' });
      doc.text(`$${invoiceData.calculation.rounding.toFixed(2)}`, 190, totalsStartY + 15, { align: 'right' });
    }

    const finalTotalY = invoiceData.calculation.rounding !== 0 ? totalsStartY + 20 : totalsStartY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 150, finalTotalY, { align: 'right' });
    doc.text(`$${invoiceData.calculation.total.toFixed(2)}`, 190, finalTotalY, { align: 'right' });

    // Add footer on the last page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice-${invoiceData.invoiceInfo.number}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
