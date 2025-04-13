
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface InvoiceFooterProps {
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  gst: number;
  total: number;
  rounding: number;
  saleNote: string;
  nextServiceDate: string;
  updateDiscount: (value: number) => void;
  updateDiscountType: (type: 'percentage' | 'fixed') => void;
  updateSaleNote: (note: string) => void;
  updateNextServiceDate: (date: string) => void;
  exportInvoice: () => void;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  subtotal,
  discount,
  discountType,
  gst,
  total,
  rounding,
  saleNote,
  nextServiceDate,
  updateDiscount,
  updateDiscountType,
  updateSaleNote,
  updateNextServiceDate,
  exportInvoice
}) => {
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    updateDiscount(value);
  };

  const discountAmount = discountType === 'percentage' 
    ? (subtotal * (discount / 100)) 
    : discount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 shadow-invoice border-invoice-border">
        <h3 className="font-semibold text-lg border-b-2 border-national-yellow pb-1 mb-4 inline-block">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sale-notes" className="text-invoice-text mb-2 block">Sale Notes</Label>
            <Textarea
              id="sale-notes"
              value={saleNote}
              onChange={(e) => updateSaleNote(e.target.value)}
              className="min-h-[120px] bg-invoice-gray/50 border-invoice-border"
              placeholder="Add any additional notes about this sale..."
            />
          </div>
          
          <div>
            <Label htmlFor="next-service-date" className="text-invoice-text mb-2 block">Next Service Date</Label>
            <Input
              id="next-service-date"
              type="date"
              value={nextServiceDate}
              onChange={(e) => updateNextServiceDate(e.target.value)}
              className="bg-white border-invoice-border"
            />
          </div>
        </div>
{/*         
        <div className="mt-6 text-sm text-invoice-text">
          <p className="font-semibold mb-2">Terms & Conditions:</p>
          <p>Thank you for choosing National Tyres and Auto Care Ltd. All work is guaranteed for 6 months or 10,000km, whichever comes first. Please retain this invoice for warranty purposes.</p>
        </div> */}
      </Card>

      <div className="space-y-6">
        <Card className="p-6 shadow-invoice border-invoice-border">
          <h3 className="font-semibold text-lg border-b-2 border-national-yellow pb-1 mb-4 inline-block">Invoice Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-invoice-text">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4 items-center py-2">
              <div className="flex-1">
                <Label htmlFor="discount" className="text-invoice-text">Discount</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    step={discountType === 'percentage' ? '1' : '0.01'}
                    value={discount === 0 ? '' : discount}
                    onChange={handleDiscountChange}
                    className="flex-1 border-invoice-border"
                  />
                  <Select 
                    value={discountType}
                    onValueChange={(value) => updateDiscountType(value as 'percentage' | 'fixed')}
                  >
                    <SelectTrigger className="w-[100px] border-invoice-border">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">$</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="self-end text-right min-w-[80px] text-invoice-text">
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-invoice-text">GST (15%):</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            
            {rounding !== 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-invoice-text">Rounding:</span>
                <span>${rounding.toFixed(2)}</span>
              </div>
            )}
            
            <Separator className="my-2 bg-invoice-border" />
            
            <div className="flex justify-between items-center py-2">
              <span className="font-semibold text-lg">Total:</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
        
        <div className="flex gap-4">
          <Button 
            onClick={exportInvoice}
            className="flex-1 bg-national-yellow hover:bg-national-yellow/80 text-black"
          >
            <FileDown className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-invoice-border text-invoice-text hover:bg-invoice-gray"
            onClick={exportInvoice}
          >
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
