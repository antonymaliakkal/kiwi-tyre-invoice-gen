
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import InvoiceHeader from '@/components/InvoiceHeader';
import InvoiceTable from '@/components/InvoiceTable';
import InvoiceFooter from '@/components/InvoiceFooter';
import { InvoiceItem } from '@/types/invoice';
import { exportToPdf } from '@/utils/pdfExport';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Vehicle information state
  const [vehicleInfo, setVehicleInfo] = useState({
    registration: '',
    odometer: '',
    makeModel: '',
  });

  // Invoice information state
  const [invoiceInfo, setInvoiceInfo] = useState({
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    gstNumber: '123-456-789',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    salesperson: '',
    enteredBy: '',
    crimNumber: '',
  });

  // Company information
  const companyInfo = {
    name: 'National Tyres and Auto Care Ltd',
    address: ['4/789 Te Rapa Road', 'Te Rapa, Hamilton 3200', 'New Zealand'],
    phone: '',
  };

  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Calculation state
  const [calculation, setCalculation] = useState({
    subtotal: 0,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    gst: 0,
    total: 0,
    rounding: 0,
  });

  // Sale note state
  const [saleNote, setSaleNote] = useState('');

  // Update customer information
  const updateCustomerInfo = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update vehicle information
  const updateVehicleInfo = (field: string, value: string) => {
    setVehicleInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update invoice information
  const updateInvoiceInfo = (field: string, value: string) => {
    setInvoiceInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Update item
  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate total if quantity or unit price changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Update discount
  const updateDiscount = (value: number) => {
    setCalculation(prev => ({
      ...prev,
      discount: value
    }));
  };

  // Update discount type
  const updateDiscountType = (type: 'percentage' | 'fixed') => {
    setCalculation(prev => ({
      ...prev,
      discountType: type
    }));
  };

  // Update calculations
  useEffect(() => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate discount amount
    const discountAmount = calculation.discountType === 'percentage'
      ? subtotal * (calculation.discount / 100)
      : calculation.discount;
    
    // Calculate GST (15%)
    const gst = (subtotal - discountAmount) * 0.15;
    
    // Calculate total before rounding
    const totalBeforeRounding = subtotal - discountAmount + gst;
    
    // Round to nearest 5 cents
    const roundedTotal = Math.round(totalBeforeRounding * 20) / 20;
    
    // Calculate rounding adjustment
    const rounding = roundedTotal - totalBeforeRounding;
    
    setCalculation(prev => ({
      ...prev,
      subtotal,
      gst,
      total: roundedTotal,
      rounding,
    }));
  }, [items, calculation.discount, calculation.discountType]);

  // Export invoice to PDF
  const exportInvoice = async () => {
    try {
      const success = await exportToPdf(
        {
          items,
          customerInfo,
          vehicleInfo,
          invoiceInfo,
          companyInfo,
          calculation,
          saleNote,
        },
        '/images/group33.png'
      );
      
      if (success) {
        toast.success('Invoice exported successfully!');
      } else {
        toast.error('Failed to export invoice');
      }
    } catch (error) {
      console.error('Error exporting invoice:', error);
      toast.error('An error occurred while exporting the invoice');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-invoice-text">Invoice Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create and export professional invoices
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <InvoiceHeader
          customerInfo={customerInfo}
          vehicleInfo={vehicleInfo}
          invoiceInfo={invoiceInfo}
          updateCustomerInfo={updateCustomerInfo}
          updateVehicleInfo={updateVehicleInfo}
          updateInvoiceInfo={updateInvoiceInfo}
        />
        
        <InvoiceTable
          items={items}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
        />
        
        <InvoiceFooter
          subtotal={calculation.subtotal}
          discount={calculation.discount}
          discountType={calculation.discountType}
          gst={calculation.gst}
          total={calculation.total}
          rounding={calculation.rounding}
          saleNote={saleNote}
          nextServiceDate={invoiceInfo.nextServiceDate}
          updateDiscount={updateDiscount}
          updateDiscountType={updateDiscountType}
          updateSaleNote={setSaleNote}
          updateNextServiceDate={(date) => updateInvoiceInfo('nextServiceDate', date)}
          exportInvoice={exportInvoice}
        />
        
        <div className="text-center text-sm text-muted-foreground py-4">
          © {new Date().getFullYear()} National Tyres and Auto Care Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Index;
