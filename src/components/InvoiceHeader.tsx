
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface InvoiceHeaderProps {
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
    salesperson: string;
    enteredBy: string;
    crimNumber: string;
  };
  updateCustomerInfo: (field: string, value: string) => void;
  updateVehicleInfo: (field: string, value: string) => void;
  updateInvoiceInfo: (field: string, value: string) => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  customerInfo,
  vehicleInfo,
  invoiceInfo,
  updateCustomerInfo,
  updateVehicleInfo,
  updateInvoiceInfo
}) => {
  return (
    <Card className="p-6 shadow-invoice-lg border-invoice-border">
      <div className="flex justify-between items-start gap-8 flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-4">
            <img 
              src="/images/group33.png" 
              alt="National Tyres Logo" 
              className="h-20 object-contain"
            />
            <div className="text-sm text-invoice-text">
              <p className="font-bold text-lg text-black">National Tyres and Auto Care Ltd</p>
              <p>4/789 Te Rapa Road,</p>
              <p>Te Rapa, Hamilton 3200,</p>
              <p>New Zealand</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-national-yellow rounded-t-md py-2 px-4">
            <h2 className="font-bold text-xl text-black text-center">TAX INVOICE</h2>
          </div>
          <div className="border border-t-0 border-invoice-border rounded-b-md p-4 bg-invoice-gray">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice-number" className="text-invoice-text">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceInfo.number}
                  onChange={(e) => updateInvoiceInfo('number', e.target.value)}
                  className="bg-white border-invoice-border"
                />
              </div>
              <div>
                <Label htmlFor="invoice-date" className="text-invoice-text">Date</Label>
                <Input
                  id="invoice-date"
                  type="date"
                  value={invoiceInfo.date}
                  onChange={(e) => updateInvoiceInfo('date', e.target.value)}
                  className="bg-white border-invoice-border"
                />
              </div>
              <div>
                <Label htmlFor="gst-number" className="text-invoice-text">GST Number</Label>
                <Input
                  id="gst-number"
                  value={invoiceInfo.gstNumber}
                  onChange={(e) => updateInvoiceInfo('gstNumber', e.target.value)}
                  className="bg-white border-invoice-border"
                />
              </div>
              <div>
                <Label htmlFor="service-date" className="text-invoice-text">Service Date</Label>
                <Input
                  id="service-date"
                  type="date"
                  value={invoiceInfo.serviceDate}
                  onChange={(e) => updateInvoiceInfo('serviceDate', e.target.value)}
                  className="bg-white border-invoice-border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 bg-invoice-border" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b-2 border-national-yellow pb-1 inline-block">Bill To</h3>
          <div className="space-y-3 bg-invoice-gray p-4 rounded-md border border-invoice-border">
            <div>
              <Label htmlFor="customer-name" className="text-invoice-text">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerInfo.name}
                onChange={(e) => updateCustomerInfo('name', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
            <div>
              <Label htmlFor="customer-email" className="text-invoice-text">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => updateCustomerInfo('email', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
            <div>
              <Label htmlFor="customer-phone" className="text-invoice-text">Phone</Label>
              <Input
                id="customer-phone"
                value={customerInfo.phone}
                onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b-2 border-national-yellow pb-1 inline-block">Vehicle Details</h3>
          <div className="space-y-3 bg-invoice-gray p-4 rounded-md border border-invoice-border">
            <div>
              <Label htmlFor="vehicle-registration" className="text-invoice-text">Registration</Label>
              <Input
                id="vehicle-registration"
                value={vehicleInfo.registration}
                onChange={(e) => updateVehicleInfo('registration', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
            <div>
              <Label htmlFor="odometer" className="text-invoice-text">Odometer</Label>
              <Input
                id="odometer"
                value={vehicleInfo.odometer}
                onChange={(e) => updateVehicleInfo('odometer', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
            <div>
              <Label htmlFor="make-model" className="text-invoice-text">Make/Model</Label>
              <Input
                id="make-model"
                value={vehicleInfo.makeModel}
                onChange={(e) => updateVehicleInfo('makeModel', e.target.value)}
                className="bg-white border-invoice-border"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <Label htmlFor="salesperson" className="text-invoice-text">Salesperson</Label>
          <Input
            id="salesperson"
            value={invoiceInfo.salesperson}
            onChange={(e) => updateInvoiceInfo('salesperson', e.target.value)}
            className="bg-white border-invoice-border"
          />
        </div>
        <div>
          <Label htmlFor="entered-by" className="text-invoice-text">Entered By</Label>
          <Input
            id="entered-by"
            value={invoiceInfo.enteredBy}
            onChange={(e) => updateInvoiceInfo('enteredBy', e.target.value)}
            className="bg-white border-invoice-border"
          />
        </div>
        <div>
          <Label htmlFor="crim-number" className="text-invoice-text">CRIM Number</Label>
          <Input
            id="crim-number"
            value={invoiceInfo.crimNumber}
            onChange={(e) => updateInvoiceInfo('crimNumber', e.target.value)}
            className="bg-white border-invoice-border"
          />
        </div>
      </div>
    </Card>
  );
};

export default InvoiceHeader;
